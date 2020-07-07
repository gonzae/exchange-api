import config from 'dos-config';
import { error } from './logger';

const { max, interval } = config.ratelimiter;

const registry = {};

const MAX_REQUEST_ERROR_MESSAGE = 'max_request_reached';

const addRecord = (id) => {
  if (!registry[id]) registry[id] = 0;

  registry[id] += 1;

  setTimeout(() => {
    registry[id] -= 1;
  }, interval * 1000); // interval is expressed in secs, convert to milisecs

  if (registry[id] > max) throw new Error(MAX_REQUEST_ERROR_MESSAGE);
};

const rateLimiter = (req, res, next) => {
  if (req.user && req.user.token) {
    try {
      addRecord(req.user.token);
    } catch (e) {
      if (e.message === MAX_REQUEST_ERROR_MESSAGE) {
        error(`User with id=${req.user.id} reached max limit rate.`);
        return res.sendStatus(429);
      }
      return res.sendStatus(500);
    }
  }
  return next();
};

export default rateLimiter;
