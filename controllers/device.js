const uuid = require("uuid");
const path = require("path");
const { Device, DeviceInfo } = require("../models/models");
const ApiError = require("../errors/ApiError");
const { title } = require("process");
const e = require("express");

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
    if (info) {
      info = JSON.parse(info);
      info.forEach((e) =>
        DeviceInfo.create({
          title: e.title,
          description: e.description,
          deviceId: device.id,
        })
      );
    }
    return res.json(device);
  } catch (error) {
    return next(ApiError.internal(error.message));
  }
}

async function getAll(req, res, next) {
  let { brandId, typeId, limit, page } = req.query;
  page = page || 1;
  limit = limit || 9;
  const offset = page * limit - limit;
  let devices;

  try {
    if (!brandId && !typeId) {
      devices = await Device.findAndCountAll({ limit, offset });
    }
    if (brandId && !typeId) {
      devices = await Device.findAndCountAll({
        where: { brandId },
        limit,
        offset,
      });
    }
    if (!brandId && typeId) {
      devices = await Device.findAndCountAll({
        where: { typeId },
        limit,
        offset,
      });
    }
    if (brandId && typeId) {
      devices = await Device.findAndCountAll({
        where: { typeId, brandId },
        limit,
        offset,
      });
    }
  } catch (error) {
    return next(ApiError.internal(error.message));
  }
  return res.json(devices);
}

async function getById(req, res, next) {
  const { id } = req.params;
  const device = await Device.findOne({
    where: { id },
    include: [
      {
        model: DeviceInfo,
        as: "info",
      },
    ],
  });
  return res.json(device);
}

module.exports = { create, getAll, getById };
