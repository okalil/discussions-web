import { json } from '@remix-run/node';
import { RequesterError } from './requester';
import { addToast } from '~/lib/toast.server';
import { getSessionStorage } from '~/session.server';

export async function handleActionError({
  error,
  request,
}: {
  error: unknown;
  request: Request;
}) {
  const storage = await getSessionStorage(request);

  if (error instanceof RequesterError) {
    addToast(storage.session, {
      type: 'error',
      content: error.message,
    });
    return json(error.data, {
      status: error.status,
      headers: {
        'Set-Cookie': await storage.commit(),
      },
    });
  }

  addToast(storage.session, {
    type: 'error',
    content: error instanceof Error ? error.message : 'Unexpected Server Error',
  });

  return json(error, {
    status: 500,
    headers: {
      'Set-Cookie': await storage.commit(),
    },
  });
}
