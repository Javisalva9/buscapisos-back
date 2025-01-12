import { PropertyRepository } from '../../domain/property/property.repository';
import {
  Property,
  PropertyId,
  Address,
  Price,
  PropertyType,
} from '../../domain/property/property.entity';

interface CreatePropertyRequest {
  id: string;
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
}

export class CreatePropertyService {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async execute(request: CreatePropertyRequest): Promise<void> {
    const property = Property.create(
      new PropertyId(request.id),
      new Address(
        request.address.street,
        request.address.city,
        request.address.postalCode,
        request.address.country
      ),
      new Price(request.price.amount, request.price.currency),
      request.type as PropertyType,
      request.description,
      request.photos
    );

    await this.propertyRepository.save(property);
  }
}