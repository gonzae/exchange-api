import services from '../../services';

export default async (req, res, next) => {
  try {
    if (!req.params.needle) return res.sendStatus(400);

    const { needle } = req.params;

    const countries = await services.country.searchByName(needle);
    const filter = countries
      .map((c) => c.currencies.map((cu) => cu.code))
      .flat();

    const rates = await services.currency.getRates(filter);

    const data = countries.map((country) => {
      const { flag, name, population, currencies } = country;

      const currenciesWithRate = currencies.map((currency) => {
        const rate = rates[currency.code];
        return { ...currency, rate };
      });
      return {
        flag,
        name,
        population,
        currencies: currenciesWithRate,
      };
    });

    return res.status(200).send({ countries: data });
  } catch (e) {
    return next(e);
  }
};
