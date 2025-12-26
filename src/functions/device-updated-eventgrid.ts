import { app, EventGridEvent, InvocationContext } from '@azure/functions';

type DeviceData = {
  id: string;
  name: string;
  totalQuantity: number;
  description: string;
};

type DeviceUpdatedCloudEvent = {
  specversion: string;
  type: string;
  source: string;
  subject: string;
  id: string;
  time: string;
  datacontenttype: string;
  data: DeviceData;
};

export async function deviceUpdatedEventGrid(
  event: EventGridEvent,
  context: InvocationContext
): Promise<void> {
  context.log(
    'Event Grid function processed device event:',
    JSON.stringify(event, null, 2)
  );

  // Cast the incoming event to your strongly typed CloudEvent
  const cloudEvent = event as unknown as DeviceUpdatedCloudEvent;

  // TODO: Pass this to a device event handler use-case if needed
}

app.eventGrid('deviceUpdatedEventGrid', {
  handler: deviceUpdatedEventGrid,
});
