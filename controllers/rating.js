const { Rating, Device, User } = require("../models/models");
const ApiError = require("../errors/ApiError");

async function create(req, res, next) {
  try {
    const { deviceId,userId,rate } = req.body;

    const device = await Device.findOne({ where: { id: deviceId } });
    const user = await User.findOne({ where: { id: userId } });
    if (!device) {
      return next(ApiError.badRequest("Device not found"));
    }
    if (!user) {
      return next(ApiError.badRequest("User not found"));
    }
    const ratings = await Rating.create({
      rate,
        deviceId: device.id,
      userId: user.id,
    });
    return res.json(ratings);
  } catch (error) {
    return next(ApiError.internal(error.message));
  }
}

async function deleteRating(req, res, next) {
  const { id } = req.params;
  try {
     await Rating.destroy({
      where: { id },
    });
    return res.status(204).json({message:"Rating has been deleted !"});
  } catch (error) {
    return next(ApiError.internal(error.message));
  }
}

async function getById(req, res, next) {
  const { id } = req.params;
  const device = await Rating.findOne({
    where: { id },
  });
  return res.json(device);
}

module.exports = { create, deleteRating, getById };
