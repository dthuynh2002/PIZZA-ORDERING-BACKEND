const userService = require("../services/user.service");
const roleService = require("../services/role.service");
const { ROLE_CODE } = require("../utils/role");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} = require("../services/jwt.service");

const {
  PASSWORD_VALIDATION,
  EMAIL_VALIDATION,
  PHONE_NUMBER_VALIDATION,
} = require("../utils/valications");

const createUserHandler = async (req, res) => {
  const { user_name, password, email, phone_number, role_id } = req.body;
  if (!user_name || !password || !email || !phone_number) {
    return res
      .status(400)
      .json({ message: "Không được để trống các trường bắt buộc" });
  }
  if (!password.match(PASSWORD_VALIDATION)) {
    return res.status(400).json({
      status: false,
      message:
        "Mật khẩu phải dài ít nhất tám ký tự, có ít nhất một chữ hoa, một chữ thường, một số, một ký tự đặc biệt.",
      data: {},
    });
  }
  if (!email.match(EMAIL_VALIDATION)) {
    return res.status(400).json({
      status: false,
      message: "Email không hợp lệ",
      data: {},
    });
  }
  if (!phone_number.match(PHONE_NUMBER_VALIDATION)) {
    return res.status(400).json({
      status: false,
      message: "Số điện thoại không hợp lệ",
      data: {},
    });
  }
  const checkUser = await userService.getUserByEmail(email);
  if (checkUser) {
    return res.status(409).json({
      status: false,
      message: "Email đã tồn tại",
      data: {},
    });
  }
  const checkPhone = await userService.getUserByPhone(phone_number);
  if (checkPhone) {
    return res.status(409).json({
      status: false,
      message: "Số điện thoại đã tồn tại",
      data: {},
    });
  }
  const roleId =
    role_id ?? (await roleService.getName({ name: ROLE_CODE.USER })).id;

  const newUser = await userService.createUser({
    user_name,
    password,
    email,
    phone_number,
    role_id: roleId,
  });
  if (newUser) {
    return res.status(201).json({
      status: true,
      message: "Tạo tài khoản thành công",
      data: newUser,
    });
  } else {
    return res.status(404).json({
      status: false,
      message: "Tạo tài khoản thất bại",
      data: {},
    });
  }
};
const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Các trường bắt buộc không được để trống" });
  }
  if (!password.match(PASSWORD_VALIDATION)) {
    return res.status(400).json({
      status: false,
      message:
        "Mật khẩu phải dài ít nhất tám ký tự, có ít nhất một chữ hoa, một chữ thường, một số, một ký tự đặc biệt.",
      data: {},
    });
  }
  if (!email.match(EMAIL_VALIDATION)) {
    return res.status(400).json({
      status: false,
      message: "Email không hợp lại",
      data: {},
    });
  }
  const user = await userService.getUserByEmail(email);
  if (!user) {
    return res.status(404).json({
      status: false,
      message: "Người dùng không tồn tại",
      data: {},
    });
  }
  const isMatch = await userService.vailidatePassword({ email, password });
  if (!isMatch) {
    return res.status(401).json({
      status: false,
      message: "Thông tin tài khoản hoặc mật khẩu không chính xác",
      data: {},
    });
  }
  if (!user.active) {
    return res.status(401).json({
      status: false,
      message: "Tài khoản người dùng đã bị khóa",
      data: {},
    });
  }
  const access_token = await generateAccessToken({
    id: user.id,
    role_id: user.role_id,
  });
  const refresh_token = await generateRefreshToken({
    id: user.id,
    role_id: user.role_id,
  });
  res.cookie("refresh_token", refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
  });
  return res.status(200).json({
    status: true,
    message: "Đăng nhập thành công",
    data: { name: user.user_name, email: user.email, access_token },
  });
};

const updateHandler = async (req, res) => {
  const { id } = req.user;
  if (!id) {
    return res.status(401).json({
      status: false,
      message: "Không có sự thay đổi",
      data: {},
    });
  }
  let avatar_fileName;
  if (req.file) {
    avatar_fileName = `${req.file.filename}`;
  }
  const { user_name, phone_number, address } = req.body;
  const user = await userService.updateUser(id, {
    user_name,
    phone_number,
    address,
    ...(avatar_fileName && { avatar: avatar_fileName }),
  });
  if (user) {
    return res.status(200).json({
      status: true,
      message: "Cập nhật thông tin người dùng thành công.",
      data: user,
    });
  } else {
    return res.status(400).json({
      status: false,
      message: "Cập nhật thông tin người dùng thất bại.",
      data: {},
    });
  }
};

const getProfileHandler = async (req, res) => {
  const { id } = req.user;
  const user = await userService.getUserProfile(id);
  if (!id) {
    return res.status(401).json({
      status: false,
      message: "Không tìm thấy người dùng",
      data: {},
    });
  } else {
    return res.status(200).json({
      status: true,
      message: "Lấy thông tin người dùng thành công",
      data: user,
    });
  }
};
const changePasswordHandler = async (req, res) => {
  const { id } = req.user;
  if (!id) {
    return res.status(401).json({
      status: false,
      message: "User not found",
      data: {},
    });
  }
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      status: false,
      message: "Không được để trống các trường bắt buộc",
      data: {},
    });
  }
  if (
    !currentPassword.match(PASSWORD_VALIDATION) ||
    !newPassword.match(PASSWORD_VALIDATION)
  ) {
    return res.status(400).json({
      status: false,
      message:
        "Mật khẩu phải dài ít nhất tám ký tự, có ít nhất một chữ hoa, một chữ thường, một số, một ký tự đặc biệt.",
      data: {},
    });
  }
  const result = await userService.changePassword({
    id,
    currentPassword,
    newPassword,
  });
  return res.status(result.statusCode).json({
    status: result.status,
    message: result.message,
    data: {},
  });
};

const refreshTokenHandler = async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    return res.status(401).json({
      status: false,
      message: "No refresh token",
      data: {},
    });
  }
  const response = await verifyToken(refresh_token);
  return res.status(200).json({
    status: response.status,
    message: response.message,
    data: response.access_token,
  });
};

const createStaffHandler = async (req, res) => {
  const { user_name, password, email, phone_number, role_id } = req.body;
  if (!user_name || !password || !email || !phone_number || !role_id) {
    return res
      .status(400)
      .json({ message: "Các trường bắt buộc không được để trống" });
  }
  if (!password.match(PASSWORD_VALIDATION)) {
    return res.status(400).json({
      status: false,
      message:
        "Mật khẩu phải dài ít nhất tám ký tự, có ít nhất một chữ hoa, một chữ thường, một số, một ký tự đặc biệt.",
      data: {},
    });
  }
  if (!email.match(EMAIL_VALIDATION)) {
    return res.status(400).json({
      status: false,
      message: "Email không hợp lệ",
      data: {},
    });
  }
  if (!phone_number.match(PHONE_NUMBER_VALIDATION)) {
    return res.status(400).json({
      status: false,
      message: "Số điện thoại không hợp lệ",
      data: {},
    });
  }
  const checkUser = await userService.getUserByEmail(email);
  if (checkUser) {
    return res.status(409).json({
      status: false,
      message: "Email đã tồn tại",
      data: {},
    });
  }
  const checkPhone = await userService.getUserByPhone(phone_number);
  if (checkPhone) {
    return res.status(409).json({
      status: false,
      message: "Số điện thoại này đã tồn tại",
      data: {},
    });
  }
  const roleId =
    role_id ?? (await roleService.getName({ name: ROLE_CODE.USER })).id;

  const newUser = await userService.createUser({
    user_name,
    password,
    email,
    phone_number,
    role_id: roleId,
  });
  if (newUser) {
    return res.status(201).json({
      status: true,
      message: "Tạo mới nhân viên thành công.",
      data: newUser,
    });
  } else {
    return res.status(404).json({
      status: false,
      message: "Tạo mới nhân viên thất bại.",
      data: {},
    });
  }
};

const updateStatusHandler = async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Id là bắt buộc" });
  }
  let activeVar = true;
  if (active === "false" || active === false) activeVar = false;
  await userService.updateUser(id, { active: activeVar });
  return res.status(200).json({
    status: true,
    message: activeVar ? "Tài khoản đã được kích hoạt" : "Tài khoản đã bị khóa",
  });
};

const getAllUsersHandler = async (req, res) => {
  const { active, page = 1, limit = 5 } = req.query;
  const offset = (page - 1) * parseInt(limit);
  const roleId = (await roleService.getName({ name: ROLE_CODE.USER }))?.id;
  let users = [];
  if (active === true || active === "true")
    users = await userService.findUsers({
      query: { role_id: roleId },
      active: { active: true },
      offset,
      limit: parseInt(limit),
    });
  else if (active === false || active === "false")
    users = await userService.findUsers({
      query: { role_id: roleId },
      active: { active: false },
      offset,
      limit: parseInt(limit),
    });
  else
    users = await userService.findUsers({
      query: { role_id: roleId },
      active: {},
      offset,
      limit: parseInt(limit),
    });
  return res.status(200).json({
    status: true,
    message: "Lấy danh sách người dùng thành công.",
    data: users,
    total: users.length,
    page: parseInt(page),
    limit: parseInt(limit),
  });
};

const getAllStaffsHandler = async (req, res) => {
  const { active, page = 1, limit = 5 } = req.query;
  const offset = (page - 1) * parseInt(limit);
  const roleId = (await roleService.getName({ name: ROLE_CODE.STAFF }))?.id;
  let staffs = [];
  if (active === true || active === "true")
    staffs = await userService.findUsers({
      query: { role_id: roleId },
      active: { active: true },
      offset,
      limit: parseInt(limit),
    });
  else if (active === false || active === "false")
    staffs = await userService.findUsers({
      query: { role_id: roleId },
      active: { active: false },
      offset,
      limit: parseInt(limit),
    });
  else
    staffs = await userService.findUsers({
      query: { role_id: roleId },
      active: {},
      offset,
      limit: parseInt(limit),
    });
  return res.status(200).json({
    status: true,
    message: "Lấy danh sách nhân viên thành công.",
    data: staffs,
    total: staffs.length,
    page: parseInt(page),
    limit: parseInt(limit),
  });
};

const getAllAdminsHandler = async (req, res) => {
  const { active, page = 1, limit = 5 } = req.query;
  const offset = (page - 1) * parseInt(limit);
  const roleId = (await roleService.getName({ name: ROLE_CODE.ADMIN }))?.id;
  let admins = [];
  if (active === true || active === "true")
    admins = await userService.findUsers({
      query: { role_id: roleId },
      active: { active: true },
      offset,
      limit: parseInt(limit),
    });
  else if (active === false || active === "false")
    admins = await userService.findUsers({
      query: { role_id: roleId },
      active: { active: false },
      offset,
      limit: parseInt(limit),
    });
  else
    admins = await userService.findUsers({
      query: { role_id: roleId },
      active: {},
      offset,
      limit: parseInt(limit),
    });
  return res.status(200).json({
    status: true,
    message: "Lấy danh sách quản lý thành công.",
    data: admins,
    total: admins.length,
    page: parseInt(page),
    limit: parseInt(limit),
  });
};

module.exports = {
  createUserHandler,
  loginHandler,
  updateHandler,
  getProfileHandler,
  changePasswordHandler,
  refreshTokenHandler,
  createStaffHandler,
  updateStatusHandler,
  getAllUsersHandler,
  getAllStaffsHandler,
  getAllAdminsHandler,
};
