const path = require("path");
const { IMAGES_FOLDER } = require("../config/constants");
const pdfs = require("./pdfs");

const QR_CODES = {};

// Helper function to set QR codes for available PDFs
Object.keys(pdfs).forEach((key) => {
  if (pdfs[key] !== "PDF coming soon") {
    QR_CODES[key] = path.join(IMAGES_FOLDER, "19_payment_qr.jpg");
  }
});

// Set default for unavailable PDFs
QR_CODES.default = path.join(IMAGES_FOLDER, "coming_soon.jpg");

module.exports = QR_CODES;
