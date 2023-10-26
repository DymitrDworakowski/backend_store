const uuid = require("uuid");
const path = require("path");
const { Device } = require("../models/models");
const ApiError = require("../errors/ApiError");

async function create(req, res, next) {
  const { name, price, brandId, typeId, info } = req.body;
  const { img } = req.files;
  let fileName = uuid.v4() + ".jpg";
  img.mv(path.resolve(__dirname, "..", "static", fileName));
  try {
    const device = await Device.create({
      name,
      price,
      brandId,
      typeId,
      img: fileName,
    });
    return res.json(device);
  } catch (error) {
    return next(ApiError.internal(error.message));
  }
}

async function getAll(req, res, next) {}

async function getById(req, res, next) {
  const { id } = req.query;
}

module.exports = { create, getAll, getById };
