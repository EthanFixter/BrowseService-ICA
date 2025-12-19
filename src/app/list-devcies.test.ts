import { describe, it, expect } from 'vitest';
import { listDevices } from './list-devices';
import { FakeDeviceRepo } from '../infra/fake-device-repo';
import { Device } from '../domain/device';
import { DeviceRepo } from '../domain/device-repo';

describe('listDevices', () => {
  it('returns an empty array when no devices exist', async () => {
    // Arrange
    const deviceRepo = new FakeDeviceRepo();

    // Act
    const result = await listDevices({ deviceRepo });

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toEqual([]);
  });

  it('returns all devices from the repository', async () => {
    // Arrange
    const devices: Device[] = [
      {
        id: 'dev-1',
        name: 'Device 1',
        totalQuantity: 10,
        description: 'First device',
      },
      {
        id: 'dev-2',
        name: 'Device 2',
        totalQuantity: 20,
        description: 'Second device',
      },
    ];

    const deviceRepo = new FakeDeviceRepo(devices);

    // Act
    const result = await listDevices({ deviceRepo });

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(result.data).toEqual(devices);
  });

  describe('error scenarios', () => {
    it('returns an error when the repository throws', async () => {
      // Arrange
      const deviceRepo: DeviceRepo = {
        list: () => {
          throw new Error('Repo failure');
        },
        getById: async () => null,
        save: async (device) => device,
        delete: async () => {},
      };

      // Act
      const result = await listDevices({ deviceRepo });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Repo failure');
    });
  });
});
