const categoryService = require("../services/category.service");

const createHandler = async (req, res) => {
  const { category_name, status, description } = req.body;
  if (!category_name) {
    return res.status(400).json({
      status: false,
      message: "Required fields must not be empty",
      data: {},
    });
  }
  if (status !== undefined && status !== null && typeof status !== "boolean") {
    return res.status(400).json({
      status: false,
      message: " Status must be true or false",
    });
  }
  const existedCategory = await categoryService.findCategoryByName(
    category_name
  );
  if (existedCategory) {
    return res.status(400).json({
      status: false,
      message: "Category name already existed",
      data: {},
    });
  }
  const category = await categoryService.createCategory(req.body);
  return res.status(201).json({
    status: true,
    message: " Category created successfully",
    data: category,
  });
};

const updateCategoryByIdHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: false,
      message: "Id is required",
      data: {},
    });
  }
  const { category_name, status, description } = req.body;
  if (!category_name) {
    return res.status(400).json({
      status: false,
      message: "Required fields must be empty",
      data: {},
    });
  }
  if (status !== undefined && status !== null && typeof status !== "boolean") {
    return res.status(400).json({
      status: false,
      message: "Status must be true or false",
    });
  }
  const existedCategory = await categoryService.findCategoryById(id);
  if (!existedCategory) {
    return res.status(404).json({
      status: false,
      message: `Category '${id}' doesn't existed`,
    });
  }
  const category = await categoryService.updateCategoryById(id, req.body);
  return res.status(200).json({
    status: true,
    message: "Category was updated successfully",
    data: category,
  });
};

const changeStatusCategoryHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: false,
      message: "Id is required",
      data: {},
    });
  }
  const existedCategory = await categoryService.findCategoryById(id);
  if (!existedCategory) {
    return res.status(400).json({
      status: false,
      message: `Category '${id}' doesn't existed`,
      data: {},
    });
  }
  const { status } = req.body;
  let statusVar = true;
  if (status === "false" || status === false) statusVar = false;
  await categoryService.updateCategory(id, statusVar);
  return res.status(200).json({
    status: true,
    message: statusVar
      ? "category was active successfully"
      : "category was inactive successfully",
    data: {},
  });
};

const deleteCategoryByIdHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: false,
      message: "Id is required",
      data: {},
    });
  }
  const category = await categoryService.deleteCategoryById(id);
  if (!category) {
    return res.status(404).json({
      status: false,
      message: `Category '${id}' doesn't existed`,
      data: {},
    });
  }
  return res.status(200).json({
    status: true,
    message: "Category was deleted successfully",
    data: {},
  });
};

const getCategoryByIdHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: false,
      message: "Id is required",
      data: {},
    });
  }
  const category = await categoryService.findCategoryById(id);
  if (!category) {
    return res.status(404).json({
      status: false,
      message: `Category '${id}' doesn't existed`,
    });
  }
  return res.status(200).json({
    status: true,
    message: "Successfully",
    data: category,
  });
};

const getAllCategoriesHandler = async (req, res) => {
  const { status, page = 1, limit = 5 } = req.query;
  const offset = (page - 1) * parseInt(limit);
  let categories = [];
  if (status === "true" || status === true)
    categories = await categoryService.findCategories({
      status: { status: true },
      offset,
      limit: parseInt(limit),
    });
  else if (status === "false" || status === false)
    categories = await categoryService.findCategories({
      status: { status: false },
      offset,
      limit: parseInt(limit),
    });
  else
    categories = await categoryService.findCategories({
      status: {},
      offset,
      limit: parseInt(limit),
    });
  return res.status(200).json({
    status: true,
    message: "Successfully",
    data: categories.rows,
    total: categories.count,
    page: parseInt(page),
    limit: parseInt(limit),
  });
};

const getCategoriesHandler = async (req, res) => {
  let categories = [];
  categories = await categoryService.findCategories({
    status: { status: true },
  });
  return res.status(200).json({
    status: true,
    message: "Successfully",
    data: categories.rows,
    total: categories.count,
  });
};

module.exports = {
  createHandler,
  updateCategoryByIdHandler,
  changeStatusCategoryHandler,
  deleteCategoryByIdHandler,
  getCategoryByIdHandler,
  getAllCategoriesHandler,
  getCategoriesHandler,
};
