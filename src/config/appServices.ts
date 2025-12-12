import { ListDevicesDeps } from '../app/list-devices';
import { DeviceRepo } from '../domain/device-repo';
import { CosmosDeviceRepo } from '../infra/cosmos-device-repo';

const COSMOS_OPTIONS = {
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY,
  databaseId: process.env.COSMOS_DATABASE,
  containerId: process.env.COSMOS_CONTAINER,
};

let cachedDeviceRepo: DeviceRepo | null = null;

/**
 * Lazy singleton accessor for CosmosDeviceRepo.
 * Ensures only one instance is created and reused.
 */
export const getDeviceRepo = (): DeviceRepo => {
  if (!cachedDeviceRepo) {
    cachedDeviceRepo = new CosmosDeviceRepo(COSMOS_OPTIONS);
  }
  return cachedDeviceRepo;
};

export const createListDevicesDeps = (): ListDevicesDeps => ({
  deviceRepo: getDeviceRepo(),
});
