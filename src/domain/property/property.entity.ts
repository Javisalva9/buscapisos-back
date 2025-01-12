export class PropertyId {
  constructor(public readonly value: string) {
    if (!value) {
      throw new Error("PropertyId cannot be empty.");
    }
    // You could add more validation here, e.g., check for a valid UUID format
  }
}

export class Address {
  constructor(
    public readonly street: string,
    public readonly city: string,
    public readonly postalCode: string,
    public readonly country: string
  ) {
    if (!street || !city || !postalCode || !country) {
      throw new Error("Address must have a street, city, postal code, and country.");
    }
    // Add more validation as needed, e.g., postal code format
  }
}

export class Price {
  constructor(public readonly amount: number, public readonly currency: string) {
    if (amount < 0) {
      throw new Error("Price amount cannot be negative.");
    }
    if (!currency) {
      throw new Error("Price currency is required.");
    }
    // Validate currency format, perhaps use an enum for supported currencies
  }
}

export enum PropertyType {
  Flat = "Flat",
  House = "House",
  Apartment = "Apartment",
}

export enum PropertyStatus {
  Available = "Available",
  Sold = "Sold",
  UnderOffer = "UnderOffer"
}

export class Property {
  private _photos: string[]; // Example of using a private field for internal state
  private _status: PropertyStatus;

  private constructor(
    public readonly id: PropertyId,
    public readonly address: Address,
    public readonly price: Price,
    public readonly type: PropertyType,
    public readonly description: string,
    photos: string[] = [],
  ) {
    this._photos = photos;
    this._status = PropertyStatus.Available;
  }

  // Factory method to create a new Property instance
  static create(
    id: PropertyId,
    address: Address,
    price: Price,
    type: PropertyType,
    description: string,
    photos: string[] = []
  ): Property {

      if(photos.length > 5) {
          throw new Error("A property cannot have more than 5 photos");
      }

      return new Property(id, address, price, type, description, photos);
  }

  markAsSold(): void {
    this._status = PropertyStatus.Sold;
  }

  addPhoto(photoUrl: string): void {
    if (this._photos.length >= 5) {
      throw new Error("Cannot add more than 5 photos to a property.");
    }
    this._photos.push(photoUrl);
  }

  get photos(): string[] {
    return [...this._photos]; // Return a copy to prevent external modification
  }

  get status(): PropertyStatus {
      return this._status;
  }

}