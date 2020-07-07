import config from 'dos-config';
import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';

export default (req, res) => {
  const id = v4();
  const payload = {
    id,
  };

  const token = jwt.sign(payload, config.jwt.secret);

  return res.status(200).send({ token });
};
