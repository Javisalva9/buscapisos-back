import mongoose, { Schema, Document } from 'mongoose';
import {
  PropertyId,
  Address,
  Price,
  PropertyType,
  PropertyStatus,
  Property as PropertyEntity,
} from '../../../../domain/property/property.entity';

// Define Mongoose interfaces for Document and Model
interface PropertyDocument extends Document {
  _id: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  price: {
    amount: number;
    currency: string;
  };
  type: string;
  description: string;
  photos: string[];
  status: string;
}

// Define the schema for the Property entity
const propertySchema = new Schema<PropertyDocument>(
  {
    _id: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    price: {
      amount: { type: Number, required: true },
      currency: { type: String, required: true },
    },
    type: {
      type: String,
      enum: Object.values(PropertyType),
      required: true,
    },
    description: { type: String, required: true },
    photos: [{ type: String }],
    status: {
      type: String,
      enum: Object.values(PropertyStatus),
      required: true,
    },
  },
  {
    // Use toJSON options to handle the transformation
    toJSON: {
      virtuals: true, // Include virtual properties in the JSON output
      versionKey: false, // Exclude the __v property
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id; // Remove _id in toJSON output
      },
    },
  }
);

// Create and export the Mongoose model
const PropertyModel = mongoose.model<PropertyDocument>('Property', propertySchema);

export default PropertyModel;