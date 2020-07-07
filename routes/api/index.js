import { Router } from 'express';

import login from './login';
import searchCountries from './search-countries';
import rateLimiter from '../../lib/rate-limiter';
import validateJwt from '../../lib/validate-jwt';

const router = new Router();

router.post('/login', login);

router.get('/countries/:needle', validateJwt, rateLimiter, searchCountries);

export default router;
