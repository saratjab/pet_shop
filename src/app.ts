import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import userRoutes from './routes/userRoutes';
import petRoutes from './routes/petRoutes';
import adoptRoutes from './routes/adoptRoutes';

import { swaggerDocs } from './swaggerConfig';
import { env } from './config/envConfig';
import logger from './config/logger';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerDocs.serve, swaggerDocs.setup);
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/adopts', adoptRoutes);

app.get('/', (req, res) => {
  logger.info('Get / route hit');
  logger.warn('something looks off');
  logger.error('something broke!');
  logger.debug('for development');
  res.send(`Running in ${env.node_env} mode`);
});

export const refresshTokenSecret = env.REFRESH_TOKEN_SECRET;
export const accessTokenSecret = env.ACCESS_TOKEN_SECRET;

if (!refresshTokenSecret || !accessTokenSecret)
  throw Error('JWT secrets are not defined in .env');

const mongoUrl = env.DATABASE_URL;
if (!mongoUrl) throw new Error('Mongo Url is not define');

mongoose
  .connect(mongoUrl)
  .then((data) =>
    app.listen(parseInt(env.PORT), () => console.log('Server started'))
  )
  .catch((err) => new Error(err));
