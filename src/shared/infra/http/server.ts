import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import cors from 'cors'
import { errors } from 'celebrate'
import 'express-async-errors';
import routes from './routes';
import uploadConfig  from '@config/upload';
import ErrorHandle from '@shared/errors/ErrorHandle';

import '@shared/infra/typeorm';
import '@shared/container'

const app = express();
app.use(cors())
app.use(express.json());
app.use('/file', express.static(uploadConfig.uploadFolder));

app.use(routes);
app.use(errors)

app.use(ErrorHandle);
app.listen(3333, () => {
  console.log('Listening on port 3333');
});
