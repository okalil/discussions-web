import type { DataFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { handleActionError } from '~/lib/handle-action-error.server';
import { getSessionManager } from '~/session.server';

export const action = async ({ request }: DataFunctionArgs) => {
  try {
    const session = await getSessionManager(request);
    return redirect('/', {
      headers: { 'Set-Cookie': await session.destroy() },
    });
  } catch (error) {
    return handleActionError({ error, request });
  }
};
