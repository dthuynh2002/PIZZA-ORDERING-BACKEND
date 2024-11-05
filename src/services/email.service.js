const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const productService = require("./product.service");
const path = require("path");
dotenv.config();
var inlineBase64 = require("nodemailer-plugin-inline-base64");

const sendEmailCreateOrder = async (email, detail) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_ACCOUNT,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  transporter.use("compile", inlineBase64({ cidPrefix: "somePrefix_" }));

  let listItem = "";
  const attachImage = [];
  for (const order of detail) {
    const item = await productService.findProductById(order.product_id);
    if (!item) {
      continue;
    }

    listItem += `<div>
      <div>
        Bạn đã đặt sản phẩm <b>${item.name_product}</b> với số lượng: <b>${order.quantity}</b> và giá là: <b>${order.total_price} VND</b></div>
        <div>Bên dưới là hình ảnh của sản phẩm</div>
      </div>`;

    if (item.image && item.image.startsWith("http")) {
      attachImage.push({ path: item.image });
    } else {
      const imagePath = path.join(__dirname, "../uploads", item.image);
      attachImage.push({ path: imagePath });
    }
  }

  let info = await transporter.sendMail({
    from: process.env.MAIL_ACCOUNT,
    to: email,
    subject: "Bạn đã đặt hàng tại cửa hàng pizza line97",
    text: "Hello world?",
    html: `<div><b>Bạn đã đặt hàng thành công tại cửa hàng pizza line97</b></div> ${listItem}`,
    attachments: attachImage,
  });
};

module.exports = {
  sendEmailCreateOrder,
};
