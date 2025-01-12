import { MongoPropertyRepository } from '../../../../../../src/infrastructure/persistence/mongodb/repositories/property.respository';
import {
  Property,
  PropertyId,
  Address,
  Price,
  PropertyType, 
} from '../../../../../../src/domain/property/property.entity';
import { connectToDatabase, getDatabaseConnection } from '../../../../../../src/infrastructure/persistence/mongodb/database';
import PropertyModel from '../../../../../../src/infrastructure/persistence/mongodb/schemas/property.schema';

describe('MongoPropertyRepository', () => {
  let repository: MongoPropertyRepository;

  beforeAll(async () => {
    const connectionString = process.env.MONGO_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error(
        'MongoDB connection string is not defined in environment variables'
      );
    }
    await connectToDatabase(connectionString);
    repository = new MongoPropertyRepository(PropertyModel);
  });

  beforeEach(async () => {
    // Clear the properties collection before each test
    const connection = getDatabaseConnection()?.connection?.db;
    if (!connection)  {
      throw new Error('Database connection is not available');
    }
    await connection.dropCollection('properties');
  });

  afterAll(async () => {
    // Close the database connection after all tests are done
    await getDatabaseConnection().disconnect();
  });

  it('should save a property', async () => {
    const property = Property.create(
      new PropertyId('1'),
      new Address('Street 1', 'City 1', '12345', 'Country 1'),
      new Price(100000, 'USD'),
      PropertyType.House,
      'Description 1',
      []
    );

    await repository.save(property);
    const savedProperty = await repository.findById(property.id);

    expect(savedProperty).not.toBeNull();
    expect(savedProperty?.id.value).toBe(property.id.value);
  });
});