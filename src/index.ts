import express from 'express';
import propertyRouter from './presentation/api/routes/property.routes';
import { connectToDatabase } from './infrastructure/persistence/mongodb/database';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoConnectionString = process.env.MONGO_CONNECTION_STRING;

app.use(express.json());
app.use('/properties', propertyRouter);

if (!mongoConnectionString) {
  console.error('MONGO_CONNECTION_STRING is not defined.');
  process.exit(1);
}

connectToDatabase(mongoConnectionString)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  });