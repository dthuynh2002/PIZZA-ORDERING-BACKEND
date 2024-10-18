const orderService = require("../services/order.service");
const orderDetailService = require("../services/orderDetail.service");
const productService = require("../services/product.service");
const sizeService = require("../services/size.service");

const createOrderDetailHandler = async (req, res) => {
  const { quantity, price, total_price, order_id, product_id, size_id } =
    req.body;
  if (
    !quantity ||
    !price ||
    !total_price ||
    !order_id ||
    !product_id ||
    !size_id
  ) {
    return res.status(400).json({
      message: "Các trường là bắt buộc",
    });
  }
  const existedOrder = await orderService.findOrderById(order_id);
  if (!existedOrder) {
    return res.status(404).json({
      status: false,
      message: "Đơn hàng không tồn tại",
    });
  }
  const existedProduct = await productService.findProductById(product_id);
  if (!existedProduct) {
    return res.status(404).json({
      status: false,
      message: "Sản phẩm không tồn tại",
    });
  }
  const existedSize = await sizeService.findSizeById(size_id);
  if (!existedSize) {
    return res.status(404).json({
      status: false,
      message: "Kích cở sản phẩm không tồn tại",
    });
  }
  if (quantity <= 0 || price <= 0 || total_price <= 0) {
    return res.status(400).json({
      message: "Số lượng, giá, và tổng giá phải là số dương",
    });
  }

  const orderDetail = await orderDetailService.createOrderDetail({
    quantity,
    price,
    total_price,
    order_id,
    product_id,
    size_id,
  });
  if (!orderDetail) {
    return res.status(500).json({
      status: false,
      message: "Có lỗi xảy ra khi tạo đơn hàng chi tiết",
    });
  }
  return res.status(201).json({
    status: true,
    message: "Tạo đơn hàng chi tiết thành công",
    data: orderDetail,
  });
};

const getAllOrderDetailHandler = async (req, res) => {
  const { order_id } = req.query;
  if (!order_id) {
    return res.status(400).json({
      status: false,
      message: "Id đơn hàng là bắt buộc",
      data: {},
    });
  }
  let orders = [];
  orders = await orderDetailService.getOrders(order_id);
  if (!orders) {
    return res.status(404).json({
      status: false,
      message: "Đơn hàng chi tiết không tồn tại",
      data: {},
    });
  }
  return res.status(200).json({
    status: true,
    message: "Lấy danh sách đơn hàng chi tiết thành công",
    data: orders.rows,
    total: orders.count,
  });
};

module.exports = {
  createOrderDetailHandler,
  getAllOrderDetailHandler,
};
