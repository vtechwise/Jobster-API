const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      email: user.email,
      location: user.location,
      lastNmae: user.lastName,
      token,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide Email and Password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      email: user.email,
      location: user.location,
      lastNmae: user.lastName,
      token,
    },
  });
};

const updateUser = async (req, res) => {
  const { name, email, location, lastName } = req.body;
  if (!name || !email || !lastName || !location) {
    throw new BadRequestError("Please provide all fields");
  }

  const user = await User.findOne({ _id: req.user.userId });
  user.name = name;
  user.email = email;
  user.lastName = lastName;
  user.location = location;

  await user.save();
  const token = user.createJWT();

  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      email: user.email,
      location: user.location,
      lastNmae: user.lastName,
      token,
    },
  });
};

module.exports = {
  register,
  login,
  updateUser
};
