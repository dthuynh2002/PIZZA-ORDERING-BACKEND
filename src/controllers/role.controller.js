const roleService = require("../services/role.service");
const { ROLE_CODE } = require("../utils/role");

const createRoleHandler = async (req, res) => {
  const { name } = req.body;
  if (!name || Object.values(ROLE_CODE).indexOf(name) === -1) {
    return res.status(400).json({ message: "Invalid Role name" });
  }
  try {
    const newRole = await roleService.createRole({ name });
    if (newRole) {
      return res.status(201).json({
        status: true,
        message: "Role created successfully.",
        data: newRole,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Failed to create role.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: error,
    });
  }
};

const getInfoHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Invalid Role ID" });
  }
  const role = await roleService.getInfo({ id });
  if (role) {
    return res.status(200).json({
      status: true,
      message: "Role information retrieved successfully.",
      data: role,
    });
  } else {
    return res.status(404).json({
      status: false,
      message: "Role not found.",
    });
  }
};

const getNameHandler = async (req, res) => {
  const { name } = req.params;
  if (!name) {
    return res.status(400).json({ message: "Invalid Role name" });
  }
  const role = await roleService.getName({ name });
  if (role) {
    return res.status(200).json({
      status: true,
      message: "Role name retrieved successfully.",
      data: role,
    });
  } else {
    return res.status(404).json({
      status: false,
      message: "Role not found.",
    });
  }
};

const updateRoleByIdHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(404).json({
      status: false,
      message: "Id là bắt buộc",
      data: {},
    });
  }
  const { name } = req.body;
  if (!name && Object.values(ROLE_CODE).indexOf(name) === -1) {
    return res.status(400).json({
      status: false,
      message: "Các trường bắc buộc không được để trống",
      data: {},
    });
  }

  if (name) {
    const existedRole = await roleService.getName({ name });
    if (existedRole) {
      return res.status(400).json({
        status: false,
        message: "Tên Role đã tồn tại",
        data: {},
      });
    }

    const updatedRole = await roleService.updateRoleById(id, req.body);
    if (updatedRole) {
      return res.status(200).json({
        status: true,
        message: "Cập nhật thông tin vai trò thành công",
        data: updatedRole,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Cập nhật thông tin vai trò thất bại",
      });
    }
  }
};

const getAll = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  const offset = (page - 1) * parseInt(limit);

  let roles = [];
  roles = await roleService.getAll({ offset, limit: parseInt(limit) });
  if (roles) {
    return res.status(200).json({
      status: true,
      message: "Roles retrieved successfully.",
      data: roles.rows,
      total: roles.count,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  }
};

module.exports = {
  createRoleHandler,
  getInfoHandler,
  getNameHandler,
  getAll,
  updateRoleByIdHandler,
};
