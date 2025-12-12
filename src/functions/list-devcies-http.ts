import { app, HttpRequest, HttpResponseInit } from '@azure/functions';
import { listDevices } from '../app/list-devices';
import { createListDevicesDeps } from '../config/appServices';

const listDevicesHandler = async (
  _request: HttpRequest
): Promise<HttpResponseInit> => {
  try {
    // Read Cosmos DB environment variables with fallback names
    const COSMOS_ENDPOINT = process.env.COSMOS_ENDPOINT;
    const COSMOS_KEY = process.env.COSMOS_KEY;
    const COSMOS_DATABASE =
      process.env.COSMOS_DATABASE || process.env.DATABASE_NAME;
    const COSMOS_CONTAINER =
      process.env.COSMOS_CONTAINER || process.env.CONTAINER_NAME;

    // Check for missing required settings
    const missing: string[] = [];
    if (!COSMOS_ENDPOINT) missing.push('COSMOS_ENDPOINT');
    if (!COSMOS_KEY) missing.push('COSMOS_KEY');
    if (!COSMOS_DATABASE) missing.push('COSMOS_DATABASE / DATABASE_NAME');
    if (!COSMOS_CONTAINER) missing.push('COSMOS_CONTAINER / CONTAINER_NAME');

    if (missing.length > 0) {
      const msg = `Missing required Cosmos DB configuration: ${missing.join(
        ', '
      )}`;
      console.error(msg);
      return {
        status: 500,
        jsonBody: { success: false, message: msg },
      };
    }

    // Log variables (without printing the key)
    console.log('COSMOS_ENDPOINT:', COSMOS_ENDPOINT);
    console.log('COSMOS_KEY:', COSMOS_KEY ? 'present' : 'missing');
    console.log('COSMOS_DATABASE:', COSMOS_DATABASE);
    console.log('COSMOS_CONTAINER:', COSMOS_CONTAINER);

    // Create dependencies and call listDevices
    const deps = createListDevicesDeps();
    const result = await listDevices(deps);

    if (!result.success) {
      return {
        status: 500,
        jsonBody: {
          success: false,
          message: 'Failed to list devices',
          error: result.error,
        },
      };
    }

    const devices = result.data ?? [];
    return {
      status: 200,
      jsonBody: devices.map((device) => ({ ...device })),
    };
  } catch (err) {
    console.error('Unexpected error in listDevicesHttp:', err);
    return {
      status: 500,
      jsonBody: {
        success: false,
        message: 'Unexpected error',
        error: (err as Error).message,
      },
    };
  }
};

// Register the function
app.http('listDevicesHttp', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'devices',
  handler: listDevicesHandler,
});
