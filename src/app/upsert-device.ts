import {
  DeviceUpdatedNotifier,
  DeviceUpdatedDto,
} from './device-updated-notifier';
import { Device, createDevice } from '../domain/device';
import { DeviceRepo } from '../domain/device-repo';
import { Logger } from './logger';

export type UpsertDeviceDeps = {
  deviceRepo: DeviceRepo;
  deviceUpdatedNotifier: DeviceUpdatedNotifier;
  logger: Logger;
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

    deps.logger.info(`Upserting device with id: ${device.id}`);

    // Save (upsert) the device
    const savedDevice = await deviceRepo.save(device);

    deps.logger.info(`Device upserted with id: ${savedDevice.id}`);
    deps.logger.debug(
      `Upserted device details: ${JSON.stringify(savedDevice)}`
    );
    deps.logger.info(`Notifying device updated for id: ${savedDevice.id}`);

    // Notify about the device update
    const dto: DeviceUpdatedDto = {
      id: savedDevice.id,
      name: savedDevice.name,
      totalQuantity: savedDevice.totalQuantity,
      description: savedDevice.description,
    };

    await deps.deviceUpdatedNotifier.notifyDeviceUpdated(dto);

    deps.logger.info(
      `Device updated notification sent for id: ${savedDevice.id}`
    );

    return { success: true, data: savedDevice };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
