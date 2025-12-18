import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { upsertDevice } from '../app/upsert-device';
import { createUpsertDeviceDeps } from '../config/appServices';

// ✅ CORS headers helper
const getCorsHeaders = () => ({
  'Access-Control-Allow-Origin': '*', // or restrict to http://localhost:5173 if you prefer
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
});

const testing workflow fails= ;


const upsertDeviceHandler = async (
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> => {
  try {
    // Handle preflight CORS request
    if (request.method === 'OPTIONS') {
      return {
        status: 204,
        headers: getCorsHeaders(),
      };
    }

    const body = (await request.json()) as any;

    // Validate required fields
    if (!body || typeof body !== 'object') {
      return {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(),
        },
        jsonBody: {
          success: false,
          message: 'Request body is required',
        },
      };
    }

    const { id, name, totalQuantity, description } = body;

    if (!id || !name || totalQuantity === undefined || !description) {
      return {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(),
        },
        jsonBody: {
          success: false,
          message:
            'Missing required fields: id, name, totalQuantity, description',
        },
      };
    }

    // Create dependencies and call upsertDevice
    const deps = createUpsertDeviceDeps();
    const result = await upsertDevice(deps, {
      id,
      name,
      totalQuantity,
      description,
    });

    if (!result.success) {
      return {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(),
        },
        jsonBody: {
          success: false,
          message: 'Failed to upsert device',
          error: result.error,
        },
      };
    }

    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(),
      },
      jsonBody: {
        ...result.data, // only id, name, totalQuantity, description
      },
    };
  } catch (err) {
    context.error('Unexpected error in upsertDeviceHttp:', err);
    return {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(),
      },
      jsonBody: {
        success: false,
        message: 'Unexpected error',
        error: (err as Error).message,
      },
    };
  }
};

// Register the function
app.http('upsertDeviceHttp', {
  methods: ['PUT', 'POST'], // ✅ include OPTIONS for preflight
  authLevel: 'anonymous',
  route: 'devices/upsert',
  handler: upsertDeviceHandler,
});
