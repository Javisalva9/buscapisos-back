// src/domain/aggregates/property/property.repository.ts

import { PropertyId } from "./property.entity";
import { Property } from "./property.entity";

export interface PropertyRepository {
  findById(propertyId: PropertyId): Promise<Property | null>;
  findAll(): Promise<Property[]>;
  save(property: Property): Promise<void>;
}