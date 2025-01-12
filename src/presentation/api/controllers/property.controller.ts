import { Request, Response } from 'express';
import { CreatePropertyService } from '../../../../src/application/property/createProperty.service'; // Import the service ;
import { MongoPropertyRepository } from '../../../../src/infrastructure/persistence/mongodb/repositories/property.respository'; // Import the repository ;
import PropertyModel from '../../../../src/infrastructure/persistence/mongodb/schemas/property.schema'; // Import the Mongoose model

const propertyRepository = new MongoPropertyRepository(PropertyModel); // Pass the Mongoose model
const createPropertyService = new CreatePropertyService(propertyRepository);

export const propertyController = {
  async createProperty(req: Request, res: Response) {
    try {
      // Extract the data from the request body
      const {
        id,
        address: { street, city, postalCode, country },
        price: { amount, currency },
        type,
        description,
        photos,
      } = req.body;

      // Construct the request object for the service
      const serviceRequest = {
        id,
        address: { street, city, postalCode, country },
        price: { amount, currency },
        type,
        description,
        photos,
      };

      // Call the service to create the property
      await createPropertyService.execute(serviceRequest);

      // Send a success response
      res.status(201).send({ message: 'Property created successfully' });
    } catch (error) {
      console.error('Error creating property:', error);
      res.status(500).send({ message: 'Failed to create property' });
    }
  },
};