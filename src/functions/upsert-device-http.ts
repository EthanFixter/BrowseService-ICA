import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { upsertDevice } from '../app/upsert-device';
import { makeUpsertDeviceDeps } from '../config/appServices';

// CORS helper
const getCorsHeaders = () => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
});

const upsertDeviceHandler = async (
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> => {
  try {
    // Preflight CORS
    if (request.method === 'OPTIONS') {
      return {
        status: 204,
        headers: getCorsHeaders(),
      };
    }

    const body = (await request.json()) as any;

    // Validate body
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

    // Validate required fields
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

    // Build dependencies
    const deps = makeUpsertDeviceDeps(context);
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
        ...result.data, // id, name, totalQuantity, description
      },
    };
  } catch (error) {
    context.error('Unexpected error in upsertDeviceHttp:', error);
    return {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(),
      },
      jsonBody: {
        success: false,
        message: 'Internal server error',
        error: (error as Error).message,
      },
    };
  }
};

// Register function
app.http('upsertDeviceHttp', {
  methods: ['PUT', 'POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'devices/upsert',
  handler: upsertDeviceHandler,
});
