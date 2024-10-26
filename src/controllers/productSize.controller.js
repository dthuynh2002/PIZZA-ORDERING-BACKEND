const productService = require("../services/product.service");
const sizeService = require("../services/size.service");
const productSizeService = require("../services/productSize.service");

const createProductSizeHandler = async (req, res) => {
  const { size_id, product_id, price } = req.body;
  if (!size_id || !product_id || !price) {
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
  const existedSize = await sizeService.findSizeById(size_id);
  if (!existedSize) {
    return res.status(404).json({
      status: false,
      message: "Size không tồn tại",
    });
  }
  if (price < 0) {
    return res.status(400).json({
      status: false,
      message: "Giá sản phẩm phải là số dương",
    });
  }
  const createdProductSize = await productSizeService.createProductSize({
    size_id,
    product_id,
    price,
  });
  if (!createdProductSize) {
    return res.status(500).json({
      status: false,
      message: "Tạo mới kích cỡ sản phẩm thất bại",
    });
  }
  return res.status(201).json({
    status: true,
    message: "Tạo mới kích cỡ sản phẩm thành công",
    data: createdProductSize,
  });
};

const updateProductSizeByIdHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: false,
      message: "Id là bắt buộc",
      data: {},
    });
  }
  const existedProductSize = await productSizeService.findProductSizeById(id);
  if (!existedProductSize) {
    return res.status(404).json({
      status: false,
      message: "Kích cỡ sản phẩm không tồn tại",
      data: {},
    });
  }

  const { price } = req.body;
  if (price < 0) {
    return res.status(400).json({
      status: false,
      message: "Giá sản phẩm phải là số dương",
    });
  }
  const updatedProductSize = await productSizeService.updateProductSizeById(
    id,
    req.body
  );
  if (!updatedProductSize) {
    return res.status(404).json({
      status: false,
      message: "Kích cỡ sản phẩm không tồn tại",
    });
  }
  return res.status(200).json({
    status: true,
    message: "Cập nhật kích cỡ sản phẩm thành công",
    data: updatedProductSize,
  });
};

const deleteProductSizeHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: false,
      message: "Id là bắt buộc",
      data: {},
    });
  }
  const deletedProductSize = await productSizeService.deleteProductSizeById(id);
  if (!deletedProductSize) {
    return res.status(404).json({
      status: false,
      message: "Kích cỡ sản phẩm không tồn tại",
      data: {},
    });
  }
  return res.status(200).json({
    status: true,
    message: "Xóa kích cỡ sản phẩm thành công",
    data: deletedProductSize,
  });
};

const getProductSizeHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: false,
      message: "Id là bắt buộc",
      data: {},
    });
  }
  const productSize = await productSizeService.findProductSizeById(id);
  return res.status(200).json({
    status: true,
    message: "Lấy kích cỡ sản phẩm thành công",
    data: productSize,
  });
};

const getProductSizeAllHandler = async (req, res) => {
  const { product_id } = req.query;
  const productSizes = await productSizeService.getAllProductSizes(product_id);
  return res.status(200).json({
    status: true,
    message: "Lấy tất cả kích cỡ sản phẩm thành công",
    data: productSizes,
  });
};

module.exports = {
  createProductSizeHandler,
  updateProductSizeByIdHandler,
  deleteProductSizeHandler,
  getProductSizeHandler,
  getProductSizeAllHandler,
};
