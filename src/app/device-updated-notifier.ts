// DTO for device update notification event
export type DeviceUpdatedDto = {
  id: string;
  name: string;
  totalQuantity: number;
  description: string;
};

export interface DeviceUpdatedNotifier {
  notifyDeviceUpdated(device: DeviceUpdatedDto): Promise<void>;
}
