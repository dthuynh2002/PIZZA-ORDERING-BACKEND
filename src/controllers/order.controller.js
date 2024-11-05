const axios = require("axios").default;
const CryptoJS = require("crypto-js");
const moment = require("moment");
const qs = require("qs");
const orderService = require("../services/order.service");
const ShortUniqueId = require("short-unique-id");
const { sequelize } = require("../models");
const productService = require("../services/product.service");
const sizeService = require("../services/size.service");
const orderDetailService = require("../services/orderDetail.service");
const emailService = require("../services/email.service");
const {
  DELIVERY_METHOD_CODE,
  ORDER_STATUS_CODE,
  ORDER_STATUS_KEYS,
} = require("../utils/order");
const {
  PAYMENT_STATUS_CODE,
  PAYMENT_METHOD_CODE,
  PAYMENT_STATUS_KEYS,
} = require("../utils/payment");
const {
  PHONE_NUMBER_VALIDATION,
  ORDER_CODE_VALIDATION,
  EMAIL_VALIDATION,
} = require("../utils/valications");
const configs = require("../config/paymentConfig");

const { config } = require("dotenv");

config();

const createOrderHandler = async (req, res) => {
  try {
    const {
      order_code,
      total_quantity,
      total_price,
      order_status,
      payment_status,
      payment_method,
      delivery_method,
      user_id,
      name,
      email,
      phone,
      detail,
      notes,
    } = req.body;
    if (!total_quantity || !total_price || !name || !email || !phone) {
      return res.status(400).json({
        message: "Các trường là bắt buộc",
      });
    }
    if (!email.match(EMAIL_VALIDATION)) {
      return res.status(400).json({
        status: false,
        message: "Email không hợp lệ",
      });
    }
    if (!phone.match(PHONE_NUMBER_VALIDATION)) {
      return res.status(400).json({
        status: false,
        message: "Số điện thoại không hợp lệ",
      });
    }
    const uidGenerator = new ShortUniqueId({ length: 6 });
    const orderCode = uidGenerator.randomUUID();
    const existedOrder = await orderService.findByOrderCode(orderCode);
    if (existedOrder) {
      return res.status(400).json({
        status: false,
        message: "Đã có lỗi xảy ra. Vui lòng thử lại.",
      });
    }

    let custom_order = {
      name: name,
      email: email,
      phone: phone,
      total_quantity: total_quantity,
      total_price: total_price,
      order_status: ORDER_STATUS_CODE["PENDING"],
      payment_status: payment_status
        ? payment_status
        : PAYMENT_STATUS_CODE["UNPAID"],
      order_code: orderCode,
      user_id: req.user.id,
      delivery_method: delivery_method
        ? delivery_method
        : DELIVERY_METHOD_CODE["DELIVERY"],
      payment_method: payment_method
        ? payment_method
        : PAYMENT_METHOD_CODE["COD"],
      order_date: "",
      notes,
    };

    if (payment_method === PAYMENT_METHOD_CODE["COD"]) {
      const t = await sequelize.transaction();
      try {
        const newOrder = await orderService.createOrder(custom_order, {
          transaction: t,
        });
        if (!newOrder) {
          await t.rollback();
          return res.status(500).json({
            status: false,
            message: "Có lỗi xảy ra khi tạo đơn hàng",
          });
        }

        if (detail && Array.isArray(detail)) {
          for (let item of detail) {
            const { quantity, price, total_price, product_id, size_id } = item;

            if (!quantity || !price || !total_price || !product_id) {
              await t.rollback();
              return res.status(400).json({
                status: false,
                message: "Chi tiết order là bắt buộc",
                data: {},
              });
            }

            const existedProduct = await productService.findProductById(
              product_id
            );
            if (!existedProduct) {
              await t.rollback();
              return res.status(404).json({
                status: false,
                message: "Sản phẩm không tồn tại",
                data: {},
              });
            }

            if (existedProduct.quantity <= 0) {
              await t.rollback();
              return res.status(400).json({
                status: false,
                message: "Sản phẩm đã hết hàng",
                data: {},
              });
            }

            const existedSize = await sizeService.findSizeById(size_id);
            if (!existedSize) {
              await t.rollback();
              return res.status(404).json({
                status: false,
                message: "Size không tồn tại",
                data: {},
              });
            }

            if (price < 0) {
              await t.rollback();
              return res.status(400).json({
                status: false,
                message: "Giá sản phẩm phải là số dương",
                data: {},
              });
            }

            if (quantity <= 0) {
              await t.rollback();
              return res.status(400).json({
                status: false,
                message: "Số lượng phải lớn hơn 0",
                data: {},
              });
            }

            const resDetail = await orderDetailService.createOrderDetail(
              {
                quantity,
                price,
                total_price,
                order_id: newOrder.id,
                product_id,
                size_id,
              },
              { transaction: t }
            );

            await productService.updateProduct(product_id, {
              quantity: existedProduct.quantity - resDetail.quantity,
            });
          }
        }

        const createdAt = newOrder?.createdAt;
        let order_date = createdAt.toLocaleString(
          "vi-VN",
          { timeZone: "Asia/Ho_Chi_Minh" },
          {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
          }
        );
        newOrder.order_date = order_date;
        await newOrder.save();
        await emailService.sendEmailCreateOrder(email, detail);
        await t.commit();

        return res.status(200).json({
          status: true,
          message: "Tạo đơn hàng thành công",
          data: {
            ...newOrder.dataValues,
            ...(detail && {
              details: detail.map((item) => ({
                quantity: item.quantity,
                price: item.price,
                total_price: item.total_price,
                product_id: item.product_id,
                size_id: item.size_id,
                product_name: item.product ? item.product.name : null,
                size_name: item.size ? item.size.name : null,
              })),
            }),
          },
        });
      } catch (error) {
        console.error(error);
        await t.rollback();
        return res.status(500).json({
          status: false,
          message: "Có lỗi xảy ra khi tạo đơn hàng",
        });
      }
    }

    const paymentResponse = await paymentHandler(custom_order, detail);

    if (paymentResponse && paymentResponse.order_url) {
      return res.status(200).json({
        status: true,
        message: "Tạo đơn hàng thành công",
        orderUrl: paymentResponse.order_url,
      });
    } else {
      return res.status(500).json({
        status: false,
        message: "Có lỗi xảy ra khi tạo đơn hàng",
        data: {},
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      message: "Có lỗi xảy ra khi tạo đơn hàng",
      data: {},
    });
  }
};

const deleteOrderHandler = async (req, res) => {
  const { code } = req.params;
  if (!code) {
    return res.status(400).json({
      status: false,
      message: "Mã đơn hàng là bắt buộc",
    });
  }
  try {
    await orderService.deleteOrder({ order_code: code });
    return res.status(200).json({
      status: true,
      message: "Xóa đơn hàng thành công",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Có lỗi xảy ra khi xóa đơn hàng",
    });
  }
};

const getTrackingHandler = async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({
      status: false,
      message: "Mã đơn hàng là bắt buộc",
    });
  }
  let order;
  if (code.match(ORDER_CODE_VALIDATION)) {
    order = await orderService.findAllByOrderCode(code);
  } else if (code.match(PHONE_NUMBER_VALIDATION)) {
    order = await orderService.findByPhoneNumber(code);
  } else {
    return res.status(400).json({
      status: true,
      message: "Order không tồn tại",
      data: [],
    });
  }
  return res.status(200).json({
    status: true,
    message: "Lấy thông tin đơn hàng thành công",
    data: order,
  });
};

const changeStatusOrderHandler = async (req, res) => {
  const { id } = req.params;
  const { status } = req.query;
  if (!id) {
    return res.status(400).json({
      status: false,
      message: "Id đơn hàng là bắt buộc",
    });
  }
  if (!ORDER_STATUS_KEYS) {
    return res.status(400).json({
      status: false,
      message: "Trạng thái đơn hàng không hợp lệ",
    });
  }
  let order;
  if (status === ORDER_STATUS_CODE["DELIVERED"]) {
    order = await orderService.updateOrderById(id, {
      order_status: ORDER_STATUS_CODE["DELIVERED"],
      payment_status: PAYMENT_STATUS_CODE["PAID"],
    });
  } else {
    order = await orderService.updateOrderById(id, {
      order_status: status.toUpperCase(),
    });
  }
  if (!order) {
    return res.status(404).json({
      status: false,
      message: "Đơn hàng không tồn tại",
    });
  }
  return res.status(200).json({
    status: true,
    message: `Trạng thái đơn hàng đã được ${status}`,
    data: order,
  });
};

const changePaymentStatsHandler = async (req, res) => {
  const { orderCode } = req.params;
  const { status } = req.query;
  if (!orderCode) {
    return res.status(400).json({
      status: false,
      message: "Mã đơn hàng là bắt buộc",
    });
  }

  if (!PAYMENT_STATUS_KEYS.includes(status.toUpperCase())) {
    return res.status(400).json({
      status: false,
      message: "Trạng thái đơn hàng không hợp lệ",
    });
  }

  const order = await orderService.updateOrderByCode(
    { order_code: orderCode },
    {
      payment_status: status.toUpperCase(),
    }
  );
  if (!order) {
    return res.status(404).json({
      status: false,
      message: "Đơn hàng không tồn tại",
    });
  }
  return res.status(200).json({
    status: true,
    message: `Trạng thái đơn hàng đã được ${status}`,
    data: order,
  });
};

// Lấy tất cả order của một User
const getAllOrdersHandler = async (req, res) => {
  const { id } = req.user;
  const { page = 1, limit = 5 } = req.query;
  const offset = (page - 1) * parseInt(limit);
  let orders = [];
  orders = await orderService.findOrders(id, {
    offset,
    limit: parseInt(limit),
  });
  return res.status(200).json({
    status: true,
    message: "Lấy thông tin đơn hàng thành công",
    data: orders.rows.map((item) => ({
      id: item.id,
      order_code: item.order_code,
      total_price: item.total_price,
      total_quantity: item.total_quantity,
      order_status: item.order_status,
      payment_status: item.payment_status,
      payment_method: item.payment_method,
      delivery_method: item.delivery_method,
      order_date: item.order_date,
      notes: item.notes,
      user_id: item.user_id,
      name: item.name ? item.name : "Không xác định",
      email: item.email ? item.email : "Không xác định",
      phone: item.phone ? item.phone : "Không xác định",
      detail: item.orderDetails.map((detailItem) => ({
        id: detailItem.id,
        quantity: detailItem.quantity,
        price: detailItem.price,
        total_price: detailItem.total_price,
        product_id: detailItem.product_id,
        size_id: detailItem.size_id,
      })),
    })),
    total: orders.count,
    page: parseInt(page),
    limit: parseInt(limit),
  });
};

// Lấy tất cả order của hệ thống
const allOrdersHandler = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  const offset = (page - 1) * parseInt(limit);

  const orders = await orderService.allOrders({
    offset,
    limit: parseInt(limit),
  });

  return res.status(200).json({
    status: true,
    message: "Lấy thông tin đơn hàng thành công",
    data: orders.rows.map((item) => ({
      id: item.id,
      order_code: item.order_code,
      total_price: item.total_price,
      total_quantity: item.total_quantity,
      order_status: item.order_status,
      payment_status: item.payment_status,
      payment_method: item.payment_method,
      delivery_method: item.delivery_method,
      order_date: item.order_date,
      notes: item.notes,
      user_id: item.user_id,
      name: item.name ? item.name : "Không xác định",
      email: item.email ? item.email : "Không xác định",
      phone: item.phone ? item.phone : "Không xác định",
      detail: item.orderDetails.map((detailItem) => ({
        id: detailItem.id,
        quantity: detailItem.quantity,
        price: detailItem.price,
        total_price: detailItem.total_price,
        product_id: detailItem.product_id,
        size_id: detailItem.size_id,
      })),
    })),
    total: orders.count,
    page: parseInt(page),
    limit: parseInt(limit),
  });
};

const paymentHandler = async (order, details) => {
  try {
    const items = details.map((item) => ({
      item_id: item.product_id,
      item_name: item.product_name || "Unknown Product",
      item_quantity: item.quantity,
      item_price: item.price,
    }));

    const embed_data = {
      redirecturl:
        `${process.env.URL_REACT}/product` || "http://localhost:3000/product",
      order_code: order.order_code,
      name: order.name,
      email: order.email,
      phone: order.phone,
      total_price: order.total_price,
      notes: order.notes,
      total_quantity: order.total_quantity,
      order_status: order.order_status,
      payment_status: order.payment_status,
      payment_method: order.payment_method,
      delivery_method: order.delivery_method,
      order_date: order.order_date,
      user_id: order.user_id,
      order_date: order.order_date,
      detail: details,
    };

    const transID = Math.floor(Math.random() * 1000000);

    const paymentOrder = {
      app_id: configs.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
      app_user: "user123",
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: order.total_price,
      description: `Payment for the order #${order.order_code}`,
      callback_url: `${process.env.URL_NGROK}/api/v1/payment/paymentCallback`,
    };

    const data = [
      configs.app_id,
      paymentOrder.app_trans_id,
      paymentOrder.app_user,
      paymentOrder.amount,
      paymentOrder.app_time,
      paymentOrder.embed_data,
      paymentOrder.item,
    ].join("|");

    paymentOrder.mac = CryptoJS.HmacSHA256(data, configs.key1).toString();

    const result = await axios.post(configs.endpoint, null, {
      params: paymentOrder,
    });

    return result.data;
  } catch (error) {
    console.error("Error in paymentHandler:", error.message);
  }
};

const paymentCallbackHandler = async (req, res) => {
  let result = {};
  try {
    const dataStr = req.body.data;
    const reqMac = req.body.mac;

    const mac = CryptoJS.HmacSHA256(dataStr, configs.key2).toString();

    if (reqMac !== mac) {
      return res.status(403).json({
        return_code: -1,
        return_message: "MAC không hợp lệ",
      });
    }

    const dataJson = JSON.parse(dataStr);
    const { app_trans_id } = dataJson;

    const paymentStatusResponse = await checkPaymentStatusHandler(
      req,
      res,
      app_trans_id
    );

    if (paymentStatusResponse.return_code === 1) {
      const embedData = JSON.parse(dataJson.embed_data);

      const newOrderData = {
        name: embedData.name,
        email: embedData.email,
        phone: embedData.phone,
        total_quantity: embedData.total_quantity,
        total_price: embedData.total_price,
        order_status: ORDER_STATUS_CODE["PENDING"],
        payment_status: PAYMENT_STATUS_CODE["PAID"],
        order_code: embedData.order_code,
        user_id: embedData.user_id,
        delivery_method: DELIVERY_METHOD_CODE[embedData.delivery_method],
        payment_method: PAYMENT_METHOD_CODE[embedData.payment_method],
        order_date: "",
        notes: embedData.notes,
      };

      const newOrder = await orderService.createOrder(newOrderData);

      for (let item of embedData.detail) {
        const existedProduct = await productService.findProductById(
          item.product_id
        );
        if (!existedProduct) {
          console.log(
            "Sản phẩm không tồn tại khi tạo đơn hàng khi thanh toán online:",
            item.product_id
          );
          continue;
        }

        try {
          const resDetail = await orderDetailService.createOrderDetail({
            quantity: item.quantity,
            price: item.price,
            total_price: item.total_price,
            order_id: newOrder.id,
            product_id: item.product_id,
            size_id: item.size_id || null,
          });
          await productService.updateProduct(item.product_id, {
            quantity: existedProduct.quantity - resDetail.quantity,
          });
        } catch (e) {
          console.log(
            "Lỗi tạo chi tiết đơn hàng khi thanh toán online:",
            e.message
          );
          return;
        }
      }

      const orderDate = newOrder.createdAt;
      newOrder.order_date = orderDate?.toLocaleString(
        "vi-VN",
        { timeZone: "Asia/Ho_Chi_Minh" },
        {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        }
      );
      await newOrder.save();

      await emailService.sendEmailCreateOrder(
        embedData.email,
        embedData.detail
      );

      result.return_code = 1;
      result.return_message = "Đơn hàng đã được tạo thành công";
      result.order_id = newOrder.id;
      if (result.return_code === 1) {
      }
    } else {
      result.return_code = 0;
      result.return_message = "Thanh toán thất bại hoặc đang chờ xử lý";
    }
  } catch (ex) {
    console.error("Lỗi khi xử lý thanh toán online với zalopay:", ex.message);
    result.return_code = 0;
    result.return_message = "Có lỗi xảy ra khi xử lý thanh toán";
  }
  return res.json(result);
};

const checkPaymentStatusHandler = async (req, res, app_trans_id) => {
  const postData = { app_id: configs.app_id, app_trans_id };

  const data = `${postData.app_id}|${postData.app_trans_id}|${configs.key1}`;

  postData.mac = CryptoJS.HmacSHA256(data, configs.key1).toString();

  const postConfigs = {
    method: "post",
    url: process.env.CREATE_ZLP_ENDPOINT_QUERY,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: qs.stringify(postData),
  };

  try {
    const response = await axios(postConfigs);

    return response.data;
  } catch (error) {
    console.error("Error checking payment status:", error);

    return {
      status: false,
      message: "Có lỗi xảy ra khi kiểm tra trạng thái thanh toán",
    };
  }
};

module.exports = {
  createOrderHandler,
  deleteOrderHandler,
  getTrackingHandler,
  changeStatusOrderHandler,
  changePaymentStatsHandler,
  getAllOrdersHandler,
  allOrdersHandler,
  paymentHandler,
  paymentCallbackHandler,
  checkPaymentStatusHandler,
};
