const { User } = require("../../models");

const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const schema = joi.object({
    name: joi.string().min(3),
    email: joi.string().email().min(5),
    password: joi.string().min(3),
    phone: joi.number().min(9),
    address: joi.string(),
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await User.create({
      ...data,
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
      address: req.body.address,
      image: req.file.filename,
    });

    const token = jwt.sign({ id: User.id }, process.env.SECRET_KEY);

    res.status(201).send({
      status: "success",
      message: "register success",
      data: {
        newUser,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {
  const schema = joi.object({
    email: joi.string().email().min(5),
    password: joi.string().min(3),
  });

  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).send({
      error,
    });

  try {
    const userExist = await User.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ["createdAt", "updateAt"],
      },
    });

    if (!userExist) {
      return res.status(400).send({
        status: "failed",
        message: "Email & Password not found",
      });
    }

    const isValid = await bcrypt.compare(req.body.password, userExist.password);

    if (!isValid) {
      return res.status(400).send({
        status: "failed",
        message: "Email & Password not found",
      });
    }

    const token = jwt.sign({ id: userExist.id }, process.env.SECRET_KEY);

    res.status(200).send({
      status: "success",
      message: "login success",
      username: userExist.email,
      token,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const { id } = req.user;

    const data = await User.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!data) {
      return res.status(404).send({
        status: "failed",
      });
    }
    res.status(200).send({
      status: "success",
      message: `check-auth ${id} success`,
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        image: process.env.FILE_PATH + data.image,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const file = req.file.filename;
    const data = { body, file };
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    await User.update(
      {
        ...data,
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        phone: req.body.phone,
        image: req.file.filename,
        address: req.body.address,
      },
      {
        where: {
          id,
        },
      }
    );

    const token = jwt.sign({ id: User.id }, process.env.SECRET_KEY);
    const user = await User.findOne({ where: { id } });
    res.status(201).send({
      status: "success",
      message: `update user ${id} success`,
      updateUser: {
        name: user.name,
        email: user.email,
        password: user.password,
        phone: user.phone,
        address: user.address,
        image: process.env.FILE_PATH + user.image,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.profile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["password", "image", "createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      user,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};
