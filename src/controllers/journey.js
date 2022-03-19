const joi = require("joi");
const { Op } = require("sequelize");
const cloudinary = require("../utils/cloudinary");
const { User, Journey, Bookmark } = require("../../models");

exports.addJourney = async (req, res) => {
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "journeydiary",
    use_filename: true,
    unique_filename: true,
  });

  const schema = joi.object({
    title: joi.string(),
    description: joi.string(),
  });

  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).send({
      error,
    });

  try {
    const body = req.body;
    const file = req.file.filename;
    const data = { body, file };
    const newJourney = await Journey.create({
      ...data,
      userId: req.user.id,
      title: req.body.title,
      description: req.body.description,
      image: result.public_id,
      date: new Date(),
    });

    const getJourney = await Journey.findOne({
      where: {
        id: newJourney.id,
      },
      attributes: {
        exclude: ["createdAt"],
      },
      include: [
        {
          model: User,
          as: "User",
          attributes: {
            exclude: ["updatedAt"],
          },
        },
      ],
    });

    res.status(200).send({
      status: "success",
      message: "success",
      getJourney,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.updateJourney = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const file = req.file.filename;
    const data = { body, file };
    await Journey.update(
      {
        ...data,
        title: req.body.title,
        description: req.body.description,
        image: req.file.filename,
      },
      {
        where: {
          id,
        },
      }
    );

    const updateJourney = await Journey.findOne({ where: { id } });
    res.status(201).send({
      status: "success",
      message: `update ${id} success`,
      data: {
        updateJourney,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.getJourneysUser = async (req, res) => {
  try {
    const profile = await Journey.findAll({
      where: { userId: req.user.id },
      attributes: {
        exclude: ["createdAt"],
      },
      include: [
        {
          model: User,
          as: "User",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });

    res.status(200).send({
      status: "success",
      message: "success",
      data: {
        allprofile: profile.map((item) => ({
          date: item.date,
          description: item.description,
          id: item.id,
          image: process.env.FILE_PATH + item.image,
          title: item.title,
          userId: item.User.id,
          name: item.User.name,
          email: item.User.email,
          phone: item.User.phone,
          address: item.User.address,
          updatedAt: item.updatedAt,
        })),
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.getJourneys = async (req, res) => {
  try {
    const journeys = await Journey.findAll({
      attributes: {
        exclude: ["createdAt"],
      },
      include: [
        {
          model: User,
          as: "User",

          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
      ],
      include: [
        {
          model: Bookmark,
          as: "Bookmark",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "journeyId"],
          },
        },
      ],
    });
    res.status(200).send({
      status: "success",
      message: "success",
      journeys,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.getJourneyDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const journey = await Journey.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt"],
      },
      include: [
        {
          model: User,
          as: "User",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });
    res.status(200).send({
      status: "success",
      message: "success",
      journey: {
        date: journey.date,
        description: journey.description,
        id: journey.id,
        image: process.env.FILE_PATH + journey.image,
        title: journey.title,
        userId: journey.userId,
        name: journey.User.name,
        address: journey.User.address,
        email: journey.User.email,
        phone: journey.User.phone,
        updatedAt: journey.updatedAt,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.getJourneySearch = async (req, res) => {
  try {
    const journeys = await Journey.findAll({
      where: { title: { [Op.like]: `%${req.query.title}%` } },
      attributes: {
        exclude: ["createdAt"],
      },
      include: [
        {
          model: User,
          as: "User",

          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
      ],
      include: [
        {
          model: Bookmark,
          as: "Bookmark",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "journeyId"],
          },
        },
      ],
    });
    res.status(200).send({
      status: "success",
      message: "success",
      journeys,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.deleteJourney = async (req, res) => {
  try {
    const { id } = req.params;
    await Journey.destroy({
      where: {
        id,
      },
    });
    res.status(201).send({
      status: "success",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};
