import config from 'dos-config';

const debug = (log) => {
  if (config.environment === 'development') {
    // eslint-disable-next-line no-console
    console.log(`DEBUG :: ${log}`);
  }
};

const error = (err) => {
  if (config.environment === 'development') {
    // eslint-disable-next-line no-console
    console.log(`ERROR :: ${err.toString()}`);
  } else {
    // handle error in other envs, maybe send it to some external logger?
  }
};

export { debug, error };
