const { response } = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    // Verify account existance
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        msg: 'Email already in use',
        ok: false,
      });
    }

    // New DB user entry
    user = new User(req.body);

    // Password encrypt
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // DB save
    await user.save();

    // JWT creation
    const token = await generateJWT(user.id, user.username);

    // Response
    res.status(201).json({
      uid: user.id,
      username: user.username,
      ok: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'An error has ocurred, try again later',
      ok: false,
    });
  }
};

const loginUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Verify account existance
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: 'No user with that email',
        ok: false,
      });
    }

    // Compare Passwords
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Incorrect Password',
      });
    }

    // JWT creation
    const token = await generateJWT(user.id, user.username);

    // Response
    res.json({
      msg: 'Logged in',
      ok: true,
      uid: user.id,
      username: user.username,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'An error has ocurred, try again later',
      ok: true,
    });
  }
};

const renewToken = async (req, res = response) => {
  const { uid, username } = req;

  const token = await generateJWT(uid, username);

  res.json({
    ok: true,
    token,
  });
};

module.exports = {
  createUser,
  loginUser,
  renewToken,
};
