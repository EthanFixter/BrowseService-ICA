import { getDeviceRepo } from '../config/appServices';
import { testDevices } from './test-devcies';

async function main(): Promise<void> {
  const repo = getDeviceRepo();

  for (const device of testDevices) {
    await repo.save(device);
    console.log(`Seeded device ${device.id}`);
  }

  console.log('Completed seeding devices.');
}

main().catch((error) => {
  console.error('Failed to seed devices', error);
  process.exitCode = 1;
});
