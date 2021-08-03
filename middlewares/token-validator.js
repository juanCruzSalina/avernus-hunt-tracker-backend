const { response } = require('express');
const jwt = require('jsonwebtoken');

const tokenValidator = (req, res = response, next) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'There is no token in petition',
    });
  }

  try {
    const { uid, username } = jwt.verify(token, process.env.SECRET_JWT_SEED);
    req.uid = uid;
    req.username = username;
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      ok: false,
      msg: 'Invalid Token',
    });
  }

  next();
};

module.exports = {
  tokenValidator,
};
