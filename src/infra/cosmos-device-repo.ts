import { CosmosClient, Container } from '@azure/cosmos';
import { DefaultAzureCredential } from '@azure/identity';
import type { TokenCredential } from '@azure/core-auth';
import { Device } from '../domain/device';
import { DeviceRepo } from '../domain/device-repo';

// Internal DTO type for Cosmos container documents
type CosmosDeviceDocument = {
  id: string;
  name: string;
  description: string;
  totalQuantity: number;
};

export type CosmosDeviceRepoOptions = {
  endpoint: string;
  databaseId: string;
  containerId: string;
  credential?: TokenCredential;
  cosmosClient?: CosmosClient;
  key?: string; // optional access-key auth
};

export class CosmosDeviceRepo implements DeviceRepo {
  private readonly container: Container;

  constructor(options: CosmosDeviceRepoOptions) {
    if (!options) {
      throw new Error('CosmosDeviceRepo requires options');
    }

    const { endpoint, databaseId, containerId, key } = options;

    if (!endpoint) {
      throw new Error('CosmosDeviceRepo requires an endpoint option');
    }
    if (!databaseId) {
      throw new Error('CosmosDeviceRepo requires a databaseId option');
    }
    if (!containerId) {
      throw new Error('CosmosDeviceRepo requires a containerId option');
    }

    const cosmosClient =
      options.cosmosClient ??
      new CosmosClient(
        key
          ? { endpoint, key }
          : {
              endpoint,
              aadCredentials:
                options.credential ?? new DefaultAzureCredential(),
            }
      );

    this.container = cosmosClient.database(databaseId).container(containerId);
  }

  async getById(id: string): Promise<Device | null> {
    try {
      const { resource } = await this.container
        .item(id)
        .read<CosmosDeviceDocument>();

      if (!resource) {
        return null;
      }

      return this.mapToDomain(resource);
    } catch (error) {
      if (this.isNotFound(error)) {
        return null;
      }
      throw this.wrapError('Unable to get device', error);
    }
  }

  async list(): Promise<Device[]> {
    try {
      const { resources } = await this.container.items
        .readAll<CosmosDeviceDocument>()
        .fetchAll();

      return (resources ?? []).map((doc) => this.mapToDomain(doc));
    } catch (error) {
      throw this.wrapError('Unable to list devices', error);
    }
  }

  async save(device: Device): Promise<Device> {
    const document = this.mapToDocument(device);

    try {
      const { resource } =
        await this.container.items.upsert<CosmosDeviceDocument>(document);

      if (!resource) {
        throw new Error('No resource returned from Cosmos DB upsert');
      }

      return this.mapToDomain(resource);
    } catch (error) {
      throw this.wrapError('Unable to save device', error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.container.item(id).delete();
    } catch (error) {
      if (this.isNotFound(error)) {
        return;
      }
      throw this.wrapError('Unable to delete device', error);
    }
  }

  // Mapping helpers
  private mapToDomain(document: CosmosDeviceDocument): Device {
    return {
      id: document.id,
      name: document.name,
      description: document.description,
      totalQuantity: document.totalQuantity,
    };
  }

  private mapToDocument(device: Device): CosmosDeviceDocument {
    return {
      id: device.id,
      name: device.name,
      description: device.description,
      totalQuantity: device.totalQuantity,
    };
  }

  private isNotFound(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
      return false;
    }
    const statusCode = (error as { statusCode?: number }).statusCode;
    const code = (error as { code?: number | string }).code;
    return (
      statusCode === 404 ||
      code === 404 ||
      code === 'NotFound' ||
      code === 'ResourceNotFound'
    );
  }

  private wrapError(message: string, error: unknown): Error {
    if (error instanceof Error) {
      return new Error(`${message}: ${error.message}`);
    }
    return new Error(`${message}: ${String(error)}`);
  }
}
