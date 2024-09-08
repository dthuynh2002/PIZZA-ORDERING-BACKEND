const userRouter = require("./user.router");
const roleRouter = require("./role.router");
const routes = (app) => {
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/role", roleRouter);
};

module.exports = routes;
