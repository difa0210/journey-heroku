const joi = require("joi");
const { Op } = require("sequelize");
const { User, Journey, Bookmark } = require("../../models");

exports.addBookmark = async (req, res) => {
  const schema = joi.object({
    journeyId: joi.number(),
    value: joi.boolean(),
  });

  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).send({
      error,
    });
  try {
    const body = req.body;

    let data;
    if (body.value) {
      data = await Bookmark.create({
        userId: req.user.id,
        journeyId: body.journeyId,
      });
    } else {
      data = await Bookmark.destroy({
        where: { journeyId: body.journeyId, userId: req.user.id },
      });
    }

    res.status(200).send({
      status: "success",
      message: "success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.findAll({
      where: { userId: req.user.id },
      attributes: {
        exclude: ["createdAt"],
      },
      include: [
        {
          model: Journey,
          as: "Journey",
          include: [
            {
              model: User,
              as: "User",

              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          ],
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });

    res.status(200).send({
      status: "success",
      message: "success",
      bookmarks,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.deleteBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    await Bookmark.destroy({
      where: {
        id,
      },
    });
    res.status(201).send({
      status: "success",
      message: "delete success",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};
