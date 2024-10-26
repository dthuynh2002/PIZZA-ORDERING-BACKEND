const toppingService = require("../services/topping.service");

const createHandler = async (req, res) => {
  const { topping_name, status, description } = req.body;
  if (!topping_name) {
    return res.status(400).json({
      status: false,
      message: "Topping name is required",
      message: "Required fields must not be empty",
      data: {},
    });
  }
  if (status !== undefined && status !== null && typeof status !== "boolean") {
    return res.status(400).json({
      status: false,
      message: "Status must be true or false",
    });
  }
  const existedTopping = await toppingService.findToppingByName(topping_name);
  if (existedTopping) {
    return res.status(400).json({
      status: false,
      message: "Topping name already existed",
      data: {},
    });
  }

  const topping = await toppingService.createTopping(req.body);
  return res.status(201).json({
    status: true,
    message: "Topping created successfully",
    data: topping,
  });
};

const updateToppingByIdHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: false,
      message: "Id is required",
      data: {},
    });
  }

  const { topping_name, status, description } = req.body;
  if (!topping_name) {
    return res.status(400).json({
      status: false,
      message: "Required fields must not be empty",
      data: {},
    });
  }
  if (status !== undefined && status !== null && typeof status !== "boolean") {
    return res.status(400).json({
      status: false,
      message: "Status must be true or false",
    });
  }

  const existedTopping = await toppingService.findToppingById(id);
  if (!existedTopping) {
    return res.status(404).json({
      status: false,
      message: `Topping '${id}' doesn't existed`,
    });
  }
  const topping = await toppingService.updateToppingById(id, req.body);
  return res.status(200).json({
    status: true,
    message: "Topping was updated successfully",
    data: topping,
  });
};

const changeStatusToppingHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: false,
      message: "Id is required",
      data: {},
    });
  }
  const existedTopping = await toppingService.findToppingById(id);
  if (!existedTopping) {
    return res.status(400).json({
      status: false,
      message: `Topping '${id}' doesn't existed`,
      data: {},
    });
  }
  const { status } = req.body;
  let statusVar = true;
  if (status === "false" || status === false) statusVar = false;
  await toppingService.updateTopping(id, statusVar);
  return res.status(200).json({
    status: true,
    message: statusVar
      ? "topping was active successfully"
      : "topping was inactive successfully",
    data: {},
  });
};

const deleteToppingByIdHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: false,
      message: "Id is required",
      data: {},
    });
  }
  const topping = await toppingService.deleteToppingById(id);
  if (!topping) {
    return res.status(404).json({
      status: false,
      message: `Topping '${id}' doesn't existed`,
      data: {},
    });
  }
  return res.status(200).json({
    status: true,
    message: "Topping was deleted successfully",
    data: {},
  });
};

const getToppingByIdHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: false,
      message: "Id is required",
      data: {},
    });
  }
  const topping = await toppingService.findToppingById(id);
  if (!topping) {
    return res.status(404).json({
      status: false,
      message: `Topping '${id}' doesn't existed`,
    });
  }
  return res.status(200).json({
    status: true,
    message: "Successfully",
    data: topping,
  });
};

const getAllToppingsHandler = async (req, res) => {
  const { status, page = 1, limit = 5 } = req.query;
  const offset = (page - 1) * parseInt(limit);
  let toppings = [];
  if (status === "true" || status === true)
    toppings = await toppingService.findToppings({
      status: { status: true },
      offset,
      limit: parseInt(limit),
    });
  else if (status === "false" || status === false)
    toppings = await toppingService.findToppings({
      status: { status: false },
      offset,
      limit: parseInt(limit),
    });
  else
    toppings = await toppingService.findToppings({
      status: {},
      offset,
      limit: parseInt(limit),
    });
  return res.status(200).json({
    status: true,
    message: "Successfully",
    data: toppings.rows,
    total: toppings.count,
    page: parseInt(page),
    limit: parseInt(limit),
  });
};

const getToppingsHandler = async (req, res) => {
  let toppings = [];
  toppings = await toppingService.findToppings({
    status: { status: true },
  });
  return res.status(200).json({
    status: true,
    message: "Successfully",
    data: toppings.rows,
    total: toppings.count,
  });
};
module.exports = {
  createHandler,
  updateToppingByIdHandler,
  changeStatusToppingHandler,
  deleteToppingByIdHandler,
  getToppingByIdHandler,
  getAllToppingsHandler,
  getToppingsHandler,
};
