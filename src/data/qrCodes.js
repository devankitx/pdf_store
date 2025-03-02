const path = require("path");
const { IMAGES_FOLDER } = require("../config/constants");

const QR_CODES = {
  cengage_maths_chapter1: path.join(IMAGES_FOLDER, "19_payment_qr.jpg"),
  cengage_maths_chapter2: path.join(IMAGES_FOLDER, "19_payment_qr.jpg"),
  default: path.join(IMAGES_FOLDER, "coming_soon.jpg"),
};

module.exports = QR_CODES;
