import request from 'supertest';
import express from 'express';
import propertyRoutes from '../../../../src/presentation/api/routes/property.routes';
import {
  connectToDatabase,
  getDatabaseConnection,
} from '../../../../src/infrastructure/persistence/mongodb/database';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/properties', propertyRoutes);

describe('Property API (E2E)', () => {
  beforeAll(async () => {
    const connectionString = process.env.MONGO_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error(
        'MongoDB connection string is not defined in environment variables'
      );
    }
    await connectToDatabase(connectionString);
  });

  beforeEach(async () => {
    const db = getDatabaseConnection().connection.db;
    if (!db) {
      throw new Error('Database connection is not available');
    }
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((collection) => collection.name);
    if (collectionNames.includes('properties')) {
      await db.dropCollection('properties');
    }
  });

  afterAll(async () => {
    await getDatabaseConnection().disconnect();
  });

  it('POST /properties - should create a new property', async () => {
    const newProperty = {
      id: 'uuid-123',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        postalCode: '12345',
        country: 'USA',
      },
      price: {
        amount: 250000,
        currency: 'USD',
      },
      type: 'House',
      description: 'A beautiful house in Anytown',
      photos: ['photo1.jpg', 'photo2.jpg'],
    };

    const response = await request(app)
      .post('/properties')
      .send(newProperty);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Property created successfully');
  });
});