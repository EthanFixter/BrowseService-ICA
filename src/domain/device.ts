export type Device = {
  id: string;
  name: string;
  totalQuantity: number;
  description: string;
};

export type CreateDeviceParams = {
  id: string;
  name: string;
  totalQuantity: number;
  description: string;
};

export class ProductError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'ProductError';
  }
}

const validateDevice = (params: CreateDeviceParams): void => {
  if (!params.id || typeof params.id !== 'string' || params.id.trim() === '') {
    throw new ProductError('id', 'Device id must be a non-empty string.');
  }
  if (
    !params.name ||
    typeof params.name !== 'string' ||
    params.name.trim() === ''
  ) {
    throw new ProductError('name', 'Product name must be a non-empty string.');
  }
  if (
    typeof params.totalQuantity !== 'number' ||
    params.totalQuantity < 0 ||
    !Number.isInteger(params.totalQuantity)
  ) {
    throw new ProductError(
      'pricePence',
      'Product pricePence must be a non-negative integer.'
    );
  }
  if (
    !params.description ||
    typeof params.description !== 'string' ||
    params.description.trim() === ''
  ) {
    throw new ProductError(
      'description',
      'Product description must be a non-empty string.'
    );
  }
};

export const createProduct = (params: CreateDeviceParams): Device => {
  validateDevice(params);

  return {
    id: params.id,
    name: params.name,
    totalQuantity: params.totalQuantity,
    description: params.description,
  };
};
