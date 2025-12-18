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

export class DeviceError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'DeviceError';
  }
}

const validateDevice = (params: CreateDeviceParams): void => {
  if (!params.id || typeof params.id !== 'string' || params.id.trim() === '') {
    throw new DeviceError('id', 'Device id must be a non-empty string.');
  }
  if (
    !params.name ||
    typeof params.name !== 'string' ||
    params.name.trim() === ''
  ) {
    throw new DeviceError('name', 'Device name must be a non-empty string.');
  }
  if (
    typeof params.totalQuantity !== 'number' ||
    params.totalQuantity < 0 ||
    !Number.isInteger(params.totalQuantity)
  ) {
    throw new DeviceError(
      'totalQuantity',
      'Device totalQuantity must be a non-negative integer.'
    );
  }
  if (
    !params.description ||
    typeof params.description !== 'string' ||
    params.description.trim() === ''
  ) {
    throw new DeviceError(
      'description',
      'Device description must be a non-empty string.'
    );
  }
};

export const createDevice = (params: CreateDeviceParams): Device => {
  validateDevice(params);

  return {
    id: params.id,
    name: params.name,
    totalQuantity: params.totalQuantity,
    description: params.description,
  };
};
