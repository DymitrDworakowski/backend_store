const { Brand } = require("../models/models");
const ApiError = require("../errors/ApiError");

async function create(req, res, next) {
  const { name } = req.query;
  console.log({ name });

  if (!name) {
    return next(ApiError.badRequest("Name cannot be null or empty."));
  }

  try {
    const brand = await Brand.create({ name });
    return res.status(200).json(brand);
  } catch (error) {
    return next(ApiError.internal("Failed to create a Type."));
  }
}

async function getAll(req, res, next) {
  try {
    const brands = await Brand.findAll();

    return res.status(200).json(brands);
  } catch (error) {
    return next(ApiError.internal("Failed to create a Type."));
  }
}


module.exports = {create, getAll};
