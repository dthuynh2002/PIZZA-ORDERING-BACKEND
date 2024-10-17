const productService = require("../services/product.service");
const categoryService = require("../services/category.service");

const createProductHandler = async (req, res) => {
  const { name_product, description, price, quantity, category_id } = req.body;
  if (!name_product || !description || !price || !quantity || !category_id) {
    return res.status(400).json({
      message: "Các trường là bắt buộc",
    });
  }
  const existedProduct = await productService.findProductByName(name_product);
  if (existedProduct) {
    return res.status(400).json({
      status: false,
      message: "Sản phẩm đã tồn tại",
    });
  }
  if (price < 0 && quantity < 0) {
    return res.status(400).json({
      status: false,
      message: "Giá sản phẩm và số lượng phải là số dương",
    });
  }
  const existedCategory = await categoryService.findCategoryById(category_id);
  if (!existedCategory) {
    return res.status(404).json({
      status: false,
      message: `Danh mục '${category_id}' không tồn tại`,
    });
  }
  let imageProduct;
  if (req.file) {
    imageProduct = `${req.file.filename}`;
  }
  const product = await productService.createProduct({
    name_product,
    description,
    price,
    quantity,
    ...(imageProduct && { image: imageProduct }),
    category_id,
  });
  if (!product) {
    return res.status(500).json({
      status: false,
      message: "Tạo sản phẩm thất bại",
      data: {},
    });
  }
  return res.status(201).json({
    status: true,
    message: "Tạo sản phẩm thành công",
    data: product,
  });
};

const updateProductByIdHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: false,
      message: "Id sản phẩm là bắt buộc",
      data: {},
    });
  }
  const { name_product, description, price, quantity, category_id, status } =
    req.body;
  if (status !== undefined && status !== null && typeof status !== "boolean") {
    return res.status(400).json({
      status: false,
      message: "Trạng thái phải là true hoặc false",
    });
  }
  const existedProduct = await productService.findProductById(id);
  if (!existedProduct) {
    return res.status(404).json({
      status: false,
      message: `Sản phẩm '${id}' không tồn tại`,
    });
  }
  if (price < 0 && quantity < 0) {
    return res.status(400).json({
      status: false,
      message: "Giá sản phẩm và số lượng phải là số dương",
    });
  }
  let imageProduct;
  if (req.file) {
    imageProduct = `${req.file.filename}`;
  }
  const product = await productService.updateProduct(id, {
    name_product,
    description,
    price,
    quantity,
    ...(imageProduct && { image: imageProduct }),
    category_id,
    status,
  });
  if (!product) {
    return res.status(500).json({
      status: false,
      message: "Cập nhật sản phẩm thất bại",
      data: {},
    });
  }
  return res.status(200).json({
    status: true,
    message: "Cập nhật sản phẩm thành công",
    data: product,
  });
};

const changeStatusByIdHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: false,
      message: "Id sản phẩm là bắt buộc",
      data: {},
    });
  }
  const existedProduct = await productService.findProductById(id);
  if (!existedProduct) {
    return res.status(404).json({
      status: false,
      message: `Sản phẩm '${id}' không tồn tại`,
    });
  }
  const { status } = req.body;
  let statusVar = true;
  if (status === "false" || status === false) statusVar = false;
  await productService.changeStatus(id, statusVar);
  return res.status(200).json({
    status: true,
    message: statusVar
      ? "Sản phẩm đã kích hoạt thành công"
      : "Sản phẩm đã ẩn thành công",
    data: {},
  });
};

const deleteProductByIdHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: false,
      message: "Id sản phẩm là bắt buộc",
      data: {},
    });
  }
  const product = await productService.deleteProductById(id);
  if (!product) {
    return res.status(404).json({
      status: false,
      message: `Sản phẩm '${id}' không tồn tại`,
      data: {},
    });
  }
  return res.status(200).json({
    status: true,
    message: "Xóa sản phẩm thành công",
    data: {},
  });
};

const getProductByIdHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: false,
      message: "Id sản phẩm là bắt buộc",
      data: {},
    });
  }
  const product = await productService.findProductById(id);
  if (!product) {
    return res.status(404).json({
      status: false,
      message: `Sản phẩm '${id}' không tồn tại`,
      data: {},
    });
  }
  return res.status(200).json({
    status: true,
    message: "Lấy sản phẩm thành công",
    data: product,
  });
};

const getAllProductsHandler = async (req, res) => {
  const { status, page = 1, limit = 5 } = req.query;
  const offset = (page - 1) * parseInt(limit);
  let products = [];
  if (status === "true" || status === true)
    products = await productService.getAllProducts({
      active: { status: true },
      offset: offset,
      limit: parseInt(limit),
    });
  else if (status === "false" || status === false)
    products = await productService.getAllProducts({
      active: { status: false },
      offset: offset,
      limit: parseInt(limit),
    });
  else
    products = await productService.getAllProducts({
      active: {},
      offset: offset,
      limit: parseInt(limit),
    });
  return res.status(200).json({
    status: true,
    message: "Lấy tất cả sản phẩm thành công",
    data: products.rows,
    total: products.count,
    page: parseInt(page),
    limit: parseInt(limit),
  });
};

const getProductsHandler = async (req, res) => {
  let products = [];
  products = await productService.getAllProducts({ active: { status: true } });
  return res.status(200).json({
    status: true,
    message: "Lấy tất cả sản phẩm hoạt thành công",
    data: products.rows,
    total: products.count,
  });
};

module.exports = {
  createProductHandler,
  updateProductByIdHandler,
  changeStatusByIdHandler,
  deleteProductByIdHandler,
  getProductByIdHandler,
  getAllProductsHandler,
  getProductsHandler,
};
