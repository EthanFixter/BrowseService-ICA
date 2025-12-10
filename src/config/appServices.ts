import { ListDevicesDeps } from '../app/list-devices';
import { DeviceRepo } from '../domain/device-repo';
import { CosmosDeviceRepo } from '../infra/cosmos-device-repo';

const COSMOS_OPTIONS = {
  endpoint: 'https://browseservice-dev-efix08-cosmos.documents.azure.com:443/',
  databaseId: 'Devicecatalogue-db',
  containerId: 'devices',
  key: process.env.COSMOS_KEY,
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
