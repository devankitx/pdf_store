const fs = require("fs");
const { PUBLIC_FOLDER, IMAGES_FOLDER } = require("../config/constants");

function setupFolders() {
  if (!fs.existsSync(PUBLIC_FOLDER)) fs.mkdirSync(PUBLIC_FOLDER);
  if (!fs.existsSync(IMAGES_FOLDER)) fs.mkdirSync(IMAGES_FOLDER);
}

module.exports = {
  setupFolders
};