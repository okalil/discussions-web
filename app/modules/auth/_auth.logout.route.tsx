import type { DataFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { handleActionError } from '~/lib/handle-action-error.server';
import { getSessionStorage } from '~/session.server';

export const action = async ({ request }: DataFunctionArgs) => {
  try {
    const storage = await getSessionStorage(request);
    return redirect(request.headers.get('referer') ?? '/', {
      headers: { 'Set-Cookie': await storage.destroy() },
    });
  } catch (error) {
    return handleActionError({ error, request });
  }
};
