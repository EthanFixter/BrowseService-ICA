import {
  DeviceUpdatedNotifier,
  DeviceUpdatedDto,
} from '../app/device-updated-notifier';

export class DummyDeviceUpdatedNotifier implements DeviceUpdatedNotifier {
  async notifyDeviceUpdated(device: DeviceUpdatedDto): Promise<void> {
    // Dummy implementation: just log the event
    console.log('Device updated event:', device);
  }
}
