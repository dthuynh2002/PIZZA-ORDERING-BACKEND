const sizeService = require("../services/size.service");

const createHandler = async (req, res) => {
  const { size_name, status, description } = req.body;
  if (!size_name) {
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
  const existedSize = await sizeService.findSizeByName(size_name);
  if (existedSize) {
    return res.status(400).json({
      status: false,
      message: " Size name already existed",
      data: {},
    });
  }
  const size = await sizeService.createSize(req.body);
  return res.status(201).json({
    status: true,
    message: " Size created successfully",
    data: size,
  });
};

const updateSizeByIdHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: false,
      message: "Id is required",
      data: {},
    });
  }
  const { size_name, status, description } = req.body;
  if (!size_name) {
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
  const existedSize = await sizeService.findSizeById(id);
  if (!existedSize) {
    return res.status(404).json({
      status: false,
      message: `Size '${id}' doesn't existed`,
    });
  }
  const size = await sizeService.updateSizeById(id, req.body);
  return res.status(200).json({
    status: true,
    message: "Size was updated successfully",
    data: size,
  });
};

const changeStatusSizeHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: false,
      message: "Id is required",
      data: {},
    });
  }
  const existedSize = await sizeService.findSizeById(id);
  if (!existedSize) {
    return res.status(400).json({
      status: false,
      message: `Size '${id}' doesn't existed`,
      data: {},
    });
  }
  const { status } = req.body;
  let statusVar = true;
  if (status === "false" || status === false) statusVar = false;
  await sizeService.updateSize(id, statusVar);
  return res.status(200).json({
    status: true,
    message: statusVar
      ? "size was active successfully"
      : "size was inactive successfully",
    data: {},
  });
};

const deleteSizeByIdHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: false,
      message: "Id is required",
      data: {},
    });
  }
  const size = await sizeService.deleteSizeById(id);
  if (!size) {
    return res.status(404).json({
      status: false,
      message: `Size '${id}' doesn't existed`,
      data: {},
    });
  }
  return res.status(200).json({
    status: true,
    message: "Size was deleted successfully",
    data: {},
  });
};

const getSizeByIdHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: false,
      message: "Id is required",
      data: {},
    });
  }
  const size = await sizeService.findSizeById(id);
  if (!size) {
    return res.status(404).json({
      status: false,
      message: `Size '${id}' doesn't existed`,
    });
  }
  return res.status(200).json({
    status: true,
    message: "Successfully",
    data: size,
  });
};

const getAllSizesHandler = async (req, res) => {
  const { status, page = 1, limit = 5 } = req.query;
  const offset = (page - 1) * parseInt(limit);
  let sizes = [];
  if (status === "true" || status === true)
    sizes = await sizeService.findSizes({
      status: { status: true },
      offset,
      limit: parseInt(limit),
    });
  else if (status === "false" || status === false)
    sizes = await sizeService.findSizes({
      status: { status: false },
      offset,
      limit: parseInt(limit),
    });
  else
    sizes = await sizeService.findSizes({
      status: {},
      offset,
      limit: parseInt(limit),
    });
  return res.status(200).json({
    status: true,
    message: "Successfully",
    data: sizes.rows,
    total: sizes.count,
    page: parseInt(page),
    limit: parseInt(limit),
  });
};

const getSizesHandler = async (req, res) => {
  let sizes = [];
  sizes = await sizeService.findSizes({
    status: { status: true },
  });
  return res.status(200).json({
    status: true,
    message: "Successfully",
    data: sizes.rows,
    total: sizes.count,
  });
};

module.exports = {
  createHandler,
  updateSizeByIdHandler,
  changeStatusSizeHandler,
  deleteSizeByIdHandler,
  getSizeByIdHandler,
  getAllSizesHandler,
  getSizesHandler,
};
