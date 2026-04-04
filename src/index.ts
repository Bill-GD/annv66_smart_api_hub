import express from 'express';
import morgan from 'morgan';
import { runMigration } from './database/migrate';

import healthRouter from './routes/health.router';

(async () => await runMigration('./schema.json'))();

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/health', healthRouter);

const port = process.env.PORT || 2000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
