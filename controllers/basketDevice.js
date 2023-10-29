const { Basket, BasketDevice, Device } = require("../models/models");
const ApiError = require("../errors/ApiError");

async function create(req, res, next) {
  try {
    const { basketId, deviceId } = req.body;
    console.log({ basketId, deviceId });
    const basket = await Basket.findOne({ where: { id: basketId } });
    const device = await Device.findOne({ where: { id: deviceId } });

    if (!basket) {
      return next(ApiError.badRequest("Basket not found"));
    }

    if (!device) {
      return next(ApiError.badRequest("Device not found"));
    }

    const basketDevice = await BasketDevice.create({
      basketId: basket.id,
      deviceId: device.id,
    });

    return res.json(basketDevice);
  } catch (error) {
    return next(ApiError.internal(error.message));
  }
}

async function deleteDevice(req, res, next) {
  const { id } = req.params;
  try {
    const delDev = await BasketDevice.destroy({
      where: { id },
    });
    return res.status(204).json(delDev);
  } catch (error) {
    return next(ApiError.internal(error.message));
  }
}

async function getById(req, res, next) {
  const { id } = req.params;
  const device = await BasketDevice.findOne({
    where: { id },
  });
  return res.json(device);
}

module.exports = { create, deleteDevice, getById };
