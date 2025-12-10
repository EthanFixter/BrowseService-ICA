import { Device } from '../domain/device';
import { DeviceRepo } from '../domain/device-repo';

export type ListDevicesDeps = {
  deviceRepo: DeviceRepo;
};

export type ListDevicesResult = {
  success: boolean;
  data?: Device[];
  error?: string;
};

/**
 * Create a use-case for listing devices.
 * Usage:
 *   const result = await listDevices({ deviceRepo });
 */
export async function listDevices(
  deps: ListDevicesDeps
): Promise<ListDevicesResult> {
  const { deviceRepo } = deps;

  try {
    const devices = await deviceRepo.list();
    return { success: true, data: devices };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
