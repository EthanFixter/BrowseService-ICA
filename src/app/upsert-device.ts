import { Device, createDevice, CreateDeviceParams } from '../domain/device';
import { DeviceRepo } from '../domain/device-repo';

export type UpsertDeviceDeps = {
  deviceRepo: DeviceRepo;
};

export type UpsertDeviceCommand = {
  id: string;
  name: string;
  totalQuantity: number;
  description: string;
};

export type UpsertDeviceResult = {
  success: boolean;
  data?: Device;
  error?: string;
};

/**
 * Create a use-case for upserting a device.
 * This will create a new device or update an existing one.
 * Usage:
 *   const result = await upsertDevice({ deviceRepo }, deviceData);
 */
export async function upsertDevice(
  deps: UpsertDeviceDeps,
  command: UpsertDeviceCommand
): Promise<UpsertDeviceResult> {
  const { deviceRepo } = deps;

  try {
    // Validate and create the device entity
    const device = createDevice({
      ...command,
    });

    // Save (upsert) the device
    const savedDevice = await deviceRepo.save(device);

    return { success: true, data: savedDevice };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
