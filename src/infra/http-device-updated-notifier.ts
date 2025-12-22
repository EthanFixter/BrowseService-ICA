import type {
  DeviceUpdatedNotifier,
  DeviceUpdatedDto,
} from '../app/device-updated-notifier';

export type HttpDeviceUpdatedNotifierOptions = {
  baseUrl: string;
  fetch: typeof fetch;
};

export class HttpDeviceUpdatedNotifier implements DeviceUpdatedNotifier {
  private baseUrl: string;
  private fetchFn: typeof fetch;

  constructor(options: HttpDeviceUpdatedNotifierOptions) {
    this.baseUrl = options.baseUrl;
    this.fetchFn = options.fetch;
  }

  async notifyDeviceUpdated(device: DeviceUpdatedDto): Promise<void> {
    await this.fetchFn(`${this.baseUrl}/integration/events/device-updated`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(device),
    });
  }
}
