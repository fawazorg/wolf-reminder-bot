import mongoose from 'mongoose';
import logger from './utility/logger.js';

mongoose.set({ strictQuery: false });

mongoose
  .connect(`mongodb://127.0.0.1:27023/${process.env.MONGO_DB_NAME}`, {
    pass: process.env.MONGO_PWD,
    user: process.env.MONGO_USER,
  })
  .then(() => {
    logger.info('Database is a live!');
  })
  .catch((_error) => {
    logger.error(_error?.message);
  });
