const { Type } = require("../models/models");
const ApiError = require("../errors/ApiError");

async function create(req, res, next) {
  const { name } = req.query;
  console.log({ name });

  if (!name) {
    return next(ApiError.badRequest("Name cannot be null or empty."));
  }
  
  try {
    const type = await Type.create({name });
    console.log(type);
    return res.status(200).json(type);
  } catch (error) {
    return next(ApiError.internal("Failed to create a Type."));
  }
}

async function getAll(req, res, next) {
  try {
    const types = await Type.findAll();

    return res.status(200).json(types);
  } catch (error) {
    return next(ApiError.internal("Failed to create a Type."));
  }
}

module.exports = { create, getAll };
