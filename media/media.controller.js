/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const _ = require("lodash");
const mime = require("mime-types");

exports.uploadImage = async (req, res) => {
  const image = req.file;
  try {
    const urlImage = await saveImage(image);
    return res.send({ error: null, data: urlImage });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message, data: null });
  }
};

const saveImage = async (image) => {
  try {
    const extension = mime.extension(image.mimetype);
    const accessExtension = ["jpeg", "jpg", "png"];
    if (_.indexOf(accessExtension, extension) === -1) {
      output.error = "Invalid file";
      return output;
    }
    fs.renameSync(image.path, `${image.path}.${extension}`);
    const fileName = `${image.filename}.${extension}`;
    const urlImage = `${process.env.ENDPOINT}/api/v1/image/${fileName}`;
    return urlImage;
  } catch (error) {
    throw new Error(error);
  }
};

const getImage = (filePath) => {
  const fullfilePath = `uploads/${filePath}`;
  return `${process.cwd()}/${fullfilePath}`;
};
