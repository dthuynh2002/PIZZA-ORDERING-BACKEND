const productService = require("../services/product.service");
const toppingService = require("../services/topping.service");
const productToppingService = require("../services/productTopping.service");

const createProductToppingHandler = async (req, res) => {
  const { product_id, topping_id, price } = req.body;
  if (!product_id || !topping_id || !price) {
    return res.status(400).json({
      message: "Các trường là bắt buộc",
    });
  }
  const existedProduct = await productService.findProductById(product_id);
  if (!existedProduct) {
    return res.status(404).json({
      status: false,
      message: "Sản phẩm không tồn tại",
    });
  }
  const existedTopping = await toppingService.findToppingById(topping_id);
  if (!existedTopping) {
    return res.status(404).json({
      status: false,
      message: "Topping không tồn tại",
    });
  }
  if (price < 0) {
    return res.status(400).json({
      status: false,
      message: "Giá của topping phải là số dương",
    });
  }
  const createdProductTopping =
    await productToppingService.createProductTopping({
      product_id,
      topping_id,
      price,
    });
  if (!createdProductTopping) {
    return res.status(500).json({
      status: false,
      message: "Tạo topping sản phẩm thất bại",
    });
  }
  return res.status(201).json({
    status: true,
    message: "Tạo topping sản phẩm thành công",
    data: createdProductTopping,
  });
};

const updateProductToppingHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: false,
      message: "Id topping sản phẩm là bắt buộc",
      data: {},
    });
  }
  const existedProductTopping =
    await productToppingService.findProductToppingById(id);
  if (!existedProductTopping) {
    return res.status(404).json({
      status: false,
      message: "Topping sản phẩm không tồn tại",
      data: {},
    });
  }
  const { topping_id, price } = req.body;
  if (!topping_id) {
    return res.status(400).json({
      status: false,
      message: "Id topping sản phẩm không được để trống",
      data: {},
    });
  }
  if (price < 0) {
    return res.status(400).json({
      status: false,
      message: "Giá của topping phải là số dương",
    });
  }
  const updatedProductTopping =
    await productToppingService.updateProductToppingById(id, req.body);
  if (!updatedProductTopping) {
    return res.status(500).json({
      status: false,
      message: "Cập nhật topping sản phẩm thất bại",
      data: {},
    });
  }
  return res.status(200).json({
    status: true,
    message: "Cập nhật topping sản phẩm thành công",
    data: updatedProductTopping,
  });
};

const deleteProductToppingHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: false,
      message: "Id topping sản phẩm là bắt buộc",
      data: {},
    });
  }
  const deletedProductTopping =
    await productToppingService.deleteProductToppingById(id);
  if (!deletedProductTopping) {
    return res.status(404).json({
      status: false,
      message: "Topping sản phẩm không tồn tại",
      data: {},
    });
  }
  return res.status(200).json({
    status: true,
    message: "Xóa topping sản phẩm thành công",
    data: deletedProductTopping,
  });
};

const getProductToppingHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: false,
      message: "Id topping sản phẩm là bắt buộc",
      data: {},
    });
  }
  const productTopping = await productToppingService.findProductToppingById(id);
  if (!productTopping) {
    return res.status(404).json({
      status: false,
      message: "Topping sản phẩm không tồn tại",
      data: {},
    });
  }
  return res.status(200).json({
    status: true,
    message: "Lấy topping sản phẩm thành công",
    data: productTopping,
  });
};

const getAllProductToppingHandler = async (req, res) => {
  const { product_id } = req.query;
  const productToppings = await productToppingService.getAllProductToppings(
    product_id
  );
  return res.status(200).json({
    status: true,
    message: "Lấy tất cả kích cỡ sản phẩm thành công",
    data: productToppings,
  });
};

module.exports = {
  createProductToppingHandler,
  updateProductToppingHandler,
  deleteProductToppingHandler,
  getProductToppingHandler,
  getAllProductToppingHandler,
};
