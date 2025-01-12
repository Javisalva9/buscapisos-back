import { PropertyRepository } from '../../../../domain/property/property.repository';
import {
  Property,
  PropertyId,
  Address,
  Price,
  PropertyType,
} from '../../../../domain/property/property.entity';
import PropertyModel from '../schemas/property.schema';
import { Model } from 'mongoose';

export class MongoPropertyRepository implements PropertyRepository {
  constructor(private readonly propertyModel: Model<any>) {}

  async findById(propertyId: PropertyId): Promise<Property | null> {
    const doc = await this.propertyModel.findById(propertyId.value);
    if (!doc) {
      return null;
    }
    return this.mapDocumentToDomain(doc);
  }

  async findAll(): Promise<Property[]> {
    const docs = await this.propertyModel.find();
    return docs.map((doc) => this.mapDocumentToDomain(doc));
  }

  async save(property: Property): Promise<void> {
    const existingProperty = await this.propertyModel.findById(property.id.value);

    if (existingProperty) {
      // Update existing document
      existingProperty.address = {
        street: property.address.street,
        city: property.address.city,
        postalCode: property.address.postalCode,
        country: property.address.country,
      };
      existingProperty.price = {
        amount: property.price.amount,
        currency: property.price.currency,
      };
      existingProperty.type = property.type;
      existingProperty.description = property.description;
      existingProperty.photos = property.photos;
      existingProperty.status = property.status;
      await existingProperty.save();
    } else {
      // Create new document
      const newProperty = new this.propertyModel({
        _id: property.id.value,
        address: {
          street: property.address.street,
          city: property.address.city,
          postalCode: property.address.postalCode,
          country: property.address.country,
        },
        price: {
          amount: property.price.amount,
          currency: property.price.currency,
        },
        type: property.type,
        description: property.description,
        photos: property.photos,
        status: property.status,
      });
      await newProperty.save();
    }
  }

  private mapDocumentToDomain(doc: any): Property {
    return Property.create(
      new PropertyId(doc._id.toString()),
      new Address(
        doc.address.street,
        doc.address.city,
        doc.address.postalCode,
        doc.address.country
      ),
      new Price(doc.price.amount, doc.price.currency),
      doc.type as PropertyType,
      doc.description,
      doc.photos
    );
  }
}