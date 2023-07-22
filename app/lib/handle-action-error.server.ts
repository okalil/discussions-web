import { json } from '@remix-run/node';
import { RequesterError } from './requester';
import { addToast } from '~/toasts/toast.server';

export async function handleActionError({
  error,
  request,
}: {
  error: unknown;
  request: Request;
}) {
  if (error instanceof RequesterError) {
    return json(error.data, {
      status: error.status,
      headers: {
        'Set-Cookie': await addToast(request, {
          type: 'error',
          content: error.message,
        }),
      },
    });
  }

  return json(error, {
    status: 500,
    headers: {
      'Set-Cookie': await addToast(request, {
        type: 'error',
        content:
          error instanceof Error ? error.message : 'Unexpected Server Error',
      }),
    },
  });
}
