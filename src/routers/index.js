const userRouter = require("./user.router");
const roleRouter = require("./role.router");
const categoryRouter = require("./category.router");
const sizeRouter = require("./size.router");
const toppingRouter = require("./topping.router");
const productRouter = require("./product.router");
const productSize = require("./productSize.router");
const productTopping = require("./productTopping.router");
const orderRouter = require("./order.router");
const orderDetail = require("./orderDetail.router");
const payment = require("./payment.router");

const routes = (app) => {
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/role", roleRouter);
  app.use("/api/v1/category", categoryRouter);
  app.use("/api/v1/size", sizeRouter);
  app.use("/api/v1/topping", toppingRouter);
  app.use("/api/v1/product", productRouter);
  app.use("/api/v1/product-size", productSize);
  app.use("/api/v1/product-topping", productTopping);
  app.use("/api/v1/order", orderRouter);
  app.use("/api/v1/order-detail", orderDetail);
  app.use("/api/v1/payment", payment);
};

module.exports = routes;
