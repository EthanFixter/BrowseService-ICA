import {
  DeviceUpdatedNotifier,
  DeviceUpdatedDto,
} from '../app/device-updated-notifier';
import { EventGridPublisherClient, AzureKeyCredential } from '@azure/eventgrid';
import { randomUUID } from 'crypto';

export type EventGridOptions = {
  endpoint: string;
  key: string;
};

/**
 * Azure Event Grid implementation of DeviceUpdatedNotifier.
 * Publishes device update events to an Event Grid topic.
 */
export class EventGridDeviceUpdatedNotifier implements DeviceUpdatedNotifier {
  private client: EventGridPublisherClient<'CloudEvent'>;

  constructor(options: EventGridOptions) {
    if (!options.endpoint || options.endpoint.trim() === '') {
      throw new Error(
        'EventGridDeviceUpdatedNotifier requires a non-empty endpoint'
      );
    }
    if (!options.key || options.key.trim() === '') {
      throw new Error(
        'EventGridDeviceUpdatedNotifier requires a non-empty key'
      );
    }

    this.client = new EventGridPublisherClient(
      options.endpoint,
      'CloudEvent',
      new AzureKeyCredential(options.key)
    );
  }

  async notifyDeviceUpdated(event: DeviceUpdatedDto): Promise<void> {
    const cloudEvent = {
      id: randomUUID(),
      type: 'inventory.device.updated',
      source: '/inventory/devices',
      subject: `devices/${event.id}`,
      time: new Date(),
      specversion: '1.0',
      datacontenttype: 'application/json',
      data: {
        id: event.id,
        name: event.name,
        totalQuantity: event.totalQuantity,
        description: event.description,
      },
    };

    await this.client.send([cloudEvent]);
  }
}
