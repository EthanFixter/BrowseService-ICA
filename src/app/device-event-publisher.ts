// device-updated-notifier.ts

/**
 * DTO for when a device is updated.
 * Matches the naming conventions used across your device layer.
 */
export type DeviceUpdatedDto = {
  id: string;
  name: string;
  totalQuantity: number;
  description: string;
};

/**
 * Application-layer notifier interface for device update events.
 * Implementations handle the actual publishing mechanics
 * (message queue, event bus, external service, etc.).
 */
export interface DeviceUpdatedNotifier {
  /**
   * Notify that a device has been updated.
   */
  notifyDeviceUpdated(event: DeviceUpdatedDto): Promise<void>;
}
