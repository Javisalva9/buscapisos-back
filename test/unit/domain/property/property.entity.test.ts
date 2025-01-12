// tests/unit/domain/aggregates/property/property.entity.test.ts

import { Property, PropertyId, Address, Price, PropertyType, PropertyStatus } from '../../../../src/domain/property/property.entity';

describe('Property Aggregate', () => {
  // Helper function to create a valid Address instance
  const createValidAddress = () => new Address('123 Main St', 'Strasbourg', '12345', 'France');

  // Helper function to create a valid Price instance
  const createValidPrice = () => new Price(100000, '€');

  describe('Creation', () => {
    it('should create a property with valid parameters', () => {
      const propertyId = new PropertyId('uuid-1');
      const address = createValidAddress();
      const price = createValidPrice();
      const type = PropertyType.House;
      const description = 'A beautiful house';
      const photos = ['photo1.jpg', 'photo2.jpg'];

      const property = Property.create(propertyId, address, price, type, description, photos);

      expect(property.id).toBe(propertyId);
      expect(property.address).toBe(address);
      expect(property.price).toBe(price);
      expect(property.type).toBe(type);
      expect(property.description).toBe(description);
      expect(property.photos).toEqual(photos);
      expect(property.status).toBe(PropertyStatus.Available);
    });

    it('should throw an error if more than 5 photos are provided at creation', () => {
      const propertyId = new PropertyId('uuid-1');
      const address = createValidAddress();
      const price = createValidPrice();
      const type = PropertyType.House;
      const description = 'A beautiful house';
      const photos = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg'];

      expect(() => {
        Property.create(propertyId, address, price, type, description, photos);
      }).toThrow("A property cannot have more than 5 photos");
    });

  });

  describe('markAsSold', () => {
    it('should change the status to Sold', () => {
      const property = Property.create(
        new PropertyId('uuid-1'),
        createValidAddress(),
        createValidPrice(),
        PropertyType.Apartment,
        'A cozy apartment'
      );

      property.markAsSold();

      expect(property.status).toBe(PropertyStatus.Sold);
    });
  });

  describe('addPhoto', () => {
    it('should add a photo to the photos array', () => {
      const property = Property.create(
        new PropertyId('uuid-2'),
        createValidAddress(),
        createValidPrice(),
        PropertyType.Flat,
        'A modern flat',
        []
      );

      property.addPhoto('photo3.jpg');

      expect(property.photos).toContain('photo3.jpg');
      expect(property.photos.length).toBe(1);
    });

    it('should throw an error if adding more than 5 photos', () => {
      const property = Property.create(
        new PropertyId('uuid-3'),
        createValidAddress(),
        createValidPrice(),
        PropertyType.House,
        'A spacious house',
        ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg']
      );

      expect(() => {
        property.addPhoto('photo6.jpg');
      }).toThrow('Cannot add more than 5 photos to a property.');
    });
  });

  // Add more `describe` blocks to test other methods of the Property entity

  describe('Value Object Validation (in Property Entity Context)', () => {
    it('should throw an error if PropertyId is empty', () => {
      expect(() => new PropertyId('')).toThrow('PropertyId cannot be empty.');
    });

    it('should throw an error if Address is incomplete', () => {
      expect(() => new Address('', 'Anytown', '12345', 'USA')).toThrow('Address must have a street, city, postal code, and country.');
      // ... more tests for other incomplete address combinations
    });

    it('should throw an error if Price amount is negative', () => {
      expect(() => new Price(-100, 'USD')).toThrow('Price amount cannot be negative.');
    });

    it('should throw an error if Price doesnt have currency', () => {
      expect(() => new Price(-100, '')).toThrow('Price currency couldnt be empty.');
    });
  });
});