import type { DataFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { destroySession } from './auth.server';
import { handleActionError } from '~/lib/handle-action-error.server';

export const action = async ({ request }: DataFunctionArgs) => {
  try {
    const cookie = await destroySession(request);
    return redirect('/login', { headers: { 'Set-Cookie': cookie } });
  } catch (error) {
    return handleActionError({ error, request });
  }
};
