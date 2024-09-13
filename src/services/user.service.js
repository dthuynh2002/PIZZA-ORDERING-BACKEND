const bcrypt = require("bcrypt");
const { omit } = require("lodash");
const db = require("../models/index");

const createUser = async ({
  user_name,
  password,
  email,
  phone_number,
  role_id,
}) => {
  try {
    const hash = bcrypt.hashSync(password, 10);
    const newUser = await db.User.create({
      user_name: user_name,
      password: hash,
      email: email,
      phone_number: phone_number,
      role_id: role_id,
    });
    return omit(newUser.toJSON(), ["role_id", "password"]);
  } catch (err) {
    console.error(err);
    throw new Error("Create user failed");
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await db.User.findOne({ where: { email } });
    if (user) return omit(user.toJSON(), ["role_id", "password"]);
    return null;
  } catch (err) {
    console.error(err);
    throw new Error("Get user by email failed");
  }
};

const getUserByPhone = async (phone_number) => {
  try {
    const user = await db.User.findOne({ where: { phone_number } });
    if (user) return omit(user.toJSON(), ["role_id", "password"]);
    return null;
  } catch (err) {
    console.error(err);
    throw new Error("Get user by phone number failed");
  }
};

const vailidatePassword = async ({ email, password }) => {
  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) return false;

    const match = bcrypt.compareSync(password, user.password);
    if (!match) return false;

    return omit(user?.toJSON(), ["role_id", "password"]);
  } catch (err) {
    console.error(err);
    throw new Error("Validate password failed");
  }
};

const getUserProfile = async (id) => {
  const user = await db.User.findOne({ where: { id } });
  return omit(user.toJSON(), ["password"]);
};

const updateUser = async (id, data) => {
  try {
    const user = await db.User.findOne({ where: { id } });
    if (!user) return null;
    await user.update(data);
    return omit(user?.toJSON(), ["password"]);
  } catch (err) {
    console.error(err);
    throw new Error("Update user failed");
  }
};

const changePassword = async ({ id, currentPassword, newPassword }) => {
  try {
    const user = await db.User.findOne({ where: { id } });
    if (!user)
      return {
        statusCode: 404,
        status: false,
        message: "User not found",
      };
    const isvalid = bcrypt.compareSync(currentPassword, user.password);
    if (!isvalid)
      return {
        statusCode: 400,
        status: false,
        message: "Current password is incorrect",
      };
    const hash = bcrypt.hashSync(newPassword, 10);
    await user.update({ password: hash });
    return {
      statusCode: 200,
      status: true,
      message: "Password updated successfully",
    };
  } catch (err) {
    console.error(err);
    throw new Error("Change password failed");
  }
};

const findUsers = async ({ query, active, offset, limit }) => {
  try {
    const { rows: users } = await db.User.findAndCountAll({
      where: { ...query, ...active },
      offset,
      limit,
    });
    return users.map((user) => {
      return omit(user.toJSON(), ["password"]);
    });
  } catch (err) {
    console.error(err);
    throw new Error("Find users failed");
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserByPhone,
  vailidatePassword,
  updateUser,
  getUserProfile,
  changePassword,
  findUsers,
};
