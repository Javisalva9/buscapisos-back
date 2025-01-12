import express from 'express';
import { propertyController } from '../controllers/property.controller';

const propertyRouter = express.Router();

propertyRouter.post('/', propertyController.createProperty);

export default propertyRouter ;