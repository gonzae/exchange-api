import axios from 'axios';
import config from 'dos-config';

import { error } from '../lib/logger';

const { api } = config.restcountries;

const searchByName = async (needle) => {
  let countries;
  try {
    const response = await axios.get(`${api}/name/${needle}`);
    countries = response.data;
  } catch (e) {
    // if API returns 404, return empty array.
    if (e.response && e.response.status === 404) {
      countries = [];
    } else {
      // Log API error and send generic error to next stage.
      error(e.toString());
      throw Error('Country service error!');
    }
  }
  return countries;
};

export default {
  searchByName,
  // we could add more stuff here...
};
