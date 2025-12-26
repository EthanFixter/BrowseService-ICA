import {
  DeviceUpdatedNotifier,
  DeviceUpdatedDto,
} from '../app/device-updated-notifier';

/**
 * Dummy implementation of DeviceUpdatedNotifier for tests and local dev.
 * Simply logs events to the console instead of publishing to a real message queue.
 */
export class DummyDeviceUpdatedNotifier implements DeviceUpdatedNotifier {
  private events: DeviceUpdatedDto[] = [];

  async notifyDeviceUpdated(event: DeviceUpdatedDto): Promise<void> {
    console.log('📢 Device Updated Event:', {
      id: event.id,
      name: event.name,
      totalQuantity: event.totalQuantity,
      description: event.description,
    });

    // Store the event for testing purposes
    this.events.push({ ...event });
  }

  /**
   * Helper method to retrieve published events (useful for testing).
   */
  getPublishedEvents(): DeviceUpdatedDto[] {
    return [...this.events];
  }

  /**
   * Helper method to clear published events (useful for testing).
   */
  clearEvents(): void {
    this.events = [];
  }
}
