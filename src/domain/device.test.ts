import { describe, it, expect } from 'vitest';
import { createDevice, DeviceError } from './device';

describe('createDevice', () => {
  describe('valid device creation', () => {
    it('creates a device with valid parameters', () => {
      // Arrange
      const params = {
        id: 'dev-123',
        name: 'Test Device',
        totalQuantity: 10,
        description: 'A great test device',
      };

      // Act
      const device = createDevice(params);

      // Assert
      expect(device).toEqual(params);
    });

    // TODO: Additional valid creation tests can be added here
  });

  describe('id validation', () => {
    it('throws DeviceError when id is only whitespace', () => {
      // Arrange
      const params = {
        id: 'dev-1234',
        name: 'Test Device',
        totalQuantity: 5,
        description: 'A test device',
      };

      // Act
      const act = () => createDevice(params);

      // Assert
      expect(act).toThrow(DeviceError);
    });

    // TODO: Additional validation tests can be added here
  });
});
