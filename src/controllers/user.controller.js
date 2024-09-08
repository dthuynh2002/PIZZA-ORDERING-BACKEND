const userService = require("../services/user.service");
const {
  PASSWORD_VALIDATION,
  EMAIL_VALIDATION,
  PHONE_NUMBER_VALIDATION,
} = require("../utils/valications");

const createUserHandler = async (req, res) => {
  const { user_name, password, email, phone_number } = req.body;
  if (!user_name || !password || !email || !phone_number) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  if (!password.match(PASSWORD_VALIDATION)) {
    return res.status(400).json({
      status: false,
      message:
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      data: {},
    });
  }
  if (!email.match(EMAIL_VALIDATION)) {
    return res.status(400).json({
      status: false,
      message: "Invalid email format",
      data: {},
    });
  }
  if (!phone_number.match(PHONE_NUMBER_VALIDATION)) {
    return res.status(400).json({
      status: false,
      message: "Invalid phone number format",
      data: {},
    });
  }
  const checkUser = await userService.getUserByEmail(email);
  if (checkUser) {
    return res.status(409).json({
      status: false,
      message: "Email already exists",
      data: {},
    });
  }
  const checkPhone = await userService.getUserByPhone(phone_number);
  if (checkPhone) {
    return res.status(409).json({
      status: false,
      message: "Phone number already exists",
      data: {},
    });
  }
  // const newUser = await userService.createUser({
  //     user_name,
  //     password,
  //     email,
  //     phone_number,
  //     role_id:
  // })
};

module.exports = {
  createUserHandler,
};
