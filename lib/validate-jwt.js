import config from 'dos-config';
import jwt from 'jsonwebtoken';

const { secret } = config.jwt;

const validate = (req, res, next) => {
  const parts = req.headers.authorization.split(' ');
  if (!parts || parts[0] !== 'Bearer' || !parts[1]) return res.sendStatus(401);

  const token = parts[1];
  let user;
  try {
    user = jwt.verify(token, secret);
  } catch (_) {
    return res.sendStatus(401);
  }

  // Add all available user data & token to request
  req.user = { ...req.user, ...user, token };

  return next();
};

export default validate;
