import bodyParser from 'body-parser';
import config from 'dos-config';
import express from 'express';
import morgan from 'morgan';

import { debug, error } from './lib/logger';
import routes from './routes';

const app = express();

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.use('/api/v0', routes.api);

app.use((err, req, res, next) => {
  if (err) {
    // Log error, do not expose to final user
    error(err);
    return res.status(500).send('UNKNOWN_ERROR!');
  }
  return next();
});

app.listen(config.port, () => {
  debug(`Server up and running on port ${config.port}`);
});
