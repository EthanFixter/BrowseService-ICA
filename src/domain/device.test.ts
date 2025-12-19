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

    // ✅ Additional valid creation test
    it('creates a device when totalQuantity is zero', () => {
      // Arrange
      const params = {
        id: 'dev-000',
        name: 'Zero Quantity Device',
        totalQuantity: 0,
        description: 'Device with zero quantity',
      };

      // Act
      const device = createDevice(params);

      // Assert
      expect(device).toEqual(params);
    });
  });

  describe('id validation', () => {
    it('throws DeviceError when id is only whitespace', () => {
      // Arrange
      const params = {
        id: '',
        name: 'Test Device',
        totalQuantity: 5,
        description: 'A test device',
      };

      // Act
      const act = () => createDevice(params);

      // Assert
      expect(act).toThrow(DeviceError);
    });

    // ✅ Additional validation test
    it('throws DeviceError when totalQuantity is negative', () => {
      // Arrange
      const params = {
        id: 'dev-neg',
        name: 'Invalid Device',
        totalQuantity: -5,
        description: 'Negative quantity should not be allowed',
      };

      // Act
      const act = () => createDevice(params);

      // Assert
      expect(act).toThrow(DeviceError);
    });
  });
});
