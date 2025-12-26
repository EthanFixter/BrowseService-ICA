import { ListDevicesDeps } from '../app/list-devices';
import { UpsertDeviceDeps } from '../app/upsert-device';
import { DeviceRepo } from '../domain/device-repo';
import type { Device } from '../domain/device';
import { CosmosDeviceRepo } from '../infra/cosmos-device-repo';
import { FakeDeviceRepo } from '../infra/fake-device-repo';
import { DummyDeviceUpdatedNotifier } from '../infra/dummy-device-updated-notifier';
import { HttpDeviceUpdatedNotifier } from '../infra/http-device-updated-notifier';
import { DeviceUpdatedNotifier } from '../app/device-updated-notifier';
import { Logger } from '../app/logger';

/**
 * Cosmos configuration
 */
const COSMOS_OPTIONS = {
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY,
  databaseId: process.env.COSMOS_DATABASE,
  containerId: process.env.COSMOS_CONTAINER,
};

/**
 * Device Updated Notifier
 */
let cachedDeviceUpdatedNotifier: DeviceUpdatedNotifier | null = null;

export const getDeviceUpdatedNotifier = (): DeviceUpdatedNotifier => {
  if (!cachedDeviceUpdatedNotifier) {
    const baseUrl = process.env.DEVICE_UPDATED_BASE_URL;

    if (baseUrl && baseUrl.trim() !== '') {
      cachedDeviceUpdatedNotifier = new HttpDeviceUpdatedNotifier({
        baseUrl,
        fetch: (globalThis as any).fetch,
      });
    } else {
      cachedDeviceUpdatedNotifier = new DummyDeviceUpdatedNotifier();
    }
  }
  return cachedDeviceUpdatedNotifier;
};

/**
 * Device Repo (Cosmos first, Fake fallback)
 */
let cachedDeviceRepo: DeviceRepo | null = null;

export const getDeviceRepo = (): DeviceRepo => {
  if (!cachedDeviceRepo) {
    const cosmosConfigured =
      COSMOS_OPTIONS.endpoint &&
      COSMOS_OPTIONS.key &&
      COSMOS_OPTIONS.databaseId &&
      COSMOS_OPTIONS.containerId;

    if (cosmosConfigured) {
      cachedDeviceRepo = new CosmosDeviceRepo(COSMOS_OPTIONS);
    } else {
      const initialDevices: Device[] = [
        {
          id: 'd-001',
          name: 'Seeded Device A',
          totalQuantity: 10,
          description: 'A seeded example device for local testing.',
        },
        {
          id: 'd-002',
          name: 'Seeded Device B',
          totalQuantity: 25,
          description: 'Another seeded device to get you started.',
        },
      ];

      cachedDeviceRepo = new FakeDeviceRepo(initialDevices);
    }
  }

  return cachedDeviceRepo;
};

/**
 * Dependency factories (now matching product file)
 */
export const makeListDevicesDeps = (): ListDevicesDeps => ({
  deviceRepo: getDeviceRepo(),
});

export const makeUpsertDeviceDeps = (logger: Logger): UpsertDeviceDeps => ({
  deviceRepo: getDeviceRepo(),
  deviceUpdatedNotifier: getDeviceUpdatedNotifier(),
  logger,
});
