import axios from 'axios';
import config from 'dos-config';

import { error } from '../lib/logger';

const { accessKey, api, isFreePlan } = config.fixer;

const normalizeRates = (toCurrency, rates) => {
  const toRate = rates[toCurrency];

  const result = {};
  Object.entries(rates).forEach(([currency, rate]) => {
    if (currency === toCurrency) {
      result[currency] = 1;
    } else {
      result[currency] = rate / toRate;
    }
  });
  return result;
};

const getRates = async (optFilter = []) => {
  let rates;

  // I always add baseCurrency in case I need to reconvert
  const filter = [...optFilter, config.baseCurrency];

  // Fixer IO free plan only can use EUR as base
  const baseCurrency = isFreePlan ? 'EUR' : config.baseCurrency;
  try {
    let url = `${api}/latest?access_key=${accessKey}&base=${baseCurrency}`;

    url += `&symbols=${filter.join(',')}`;
    const response = await axios.get(url);
    const { data } = response;
    if (!data || !data.success) {
      const responseError = data.error;
      throw new Error(
        `Fixer API response: code: ${responseError.code} - type: ${responseError.type}`,
      );
    }
    rates = data.rates;
    // Workaround for Fixer IO free plan. If free plan, need to re-arrange rates
    // (this is less accurate because of calculation compared to using paid plan)
    rates = isFreePlan ? normalizeRates(config.baseCurrency, rates) : rates;
    return rates;
  } catch (e) {
    // Log API error and send generic error to next stage.
    error(e.toString());
    throw new Error('Currency service error!');
  }
};

export default {
  getRates,
  // we could add more stuff here...
};
