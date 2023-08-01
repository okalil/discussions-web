import { redirect, type DataFunctionArgs } from '@remix-run/node';
import { z } from 'zod';

import { getSessionManager } from '~/session.server';
import { requester } from '~/lib/requester';
import { FormProvider, useForm } from 'react-hook-form';
import {
  Form,
  useFormAction,
  useLoaderData,
  useNavigation,
  useSubmit,
} from '@remix-run/react';
import { FormInput } from '~/components/forms/form-input';
import { Button } from '~/components/button';
import { FormAvatar } from '~/components/forms/form-avatar';
import { handleActionError } from '~/lib/handle-action-error.server';
import { addToast } from '~/lib/toast.server';

export const action = async ({ request }: DataFunctionArgs) => {
  try {
    const session = await getSessionManager(request);
    const token = session.get('token');

    const body = await request.formData();
    await requester.put('/api/v1/profile', { body, token });
    addToast(session, { type: 'success', content: 'Salvo!' });

    return redirect(request.url, {
      headers: { 'Set-Cookie': await session.commit() },
    });
  } catch (error) {
    return handleActionError({ error, request });
  }
};

export const loader = async ({ request }: DataFunctionArgs) => {
  const session = await getSessionManager(request);
  const token = session.get('token');

  if (!token) throw new Response('Not Found', { status: 404 });

  return getProfile(token);

  async function getProfile(token: string) {
    const schema = z.object({
      user: z.object({
        name: z.string(),
        picture: z.object({ url: z.string() }).nullish(),
      }),
    });
    const response = await requester.get('/api/v1/profile', { token });
    return schema.parse(await response.json());
  }
};

export default function ProfileRoute() {
  const { user } = useLoaderData<typeof loader>();
  const form = useForm({ defaultValues: user });
  const submit = useSubmit();
  const loading = useFormAction() === useNavigation().formAction;

  return (
    <main className="max-w-4xl mx-auto px-3 py-3">
      <h1 className="text-xl font-semibold mb-2">Perfil</h1>

      <FormProvider {...form}>
        <Form
          replace
          method="POST"
          encType="multipart/form-data"
          onSubmit={form.handleSubmit((_, e) => submit(e?.target))}
        >
          <FormAvatar
            accept="image/*"
            size={64}
            src={user.picture?.url}
            alt={user.name}
            name="picture"
            className="grid place-items-center mb-4"
          />
          <FormInput
            label="Nome"
            name="name"
            rules={{ required: 'Preencha este campo' }}
            className="mb-6"
          />
          <Button
            className="h-10 w-32 ml-auto"
            variant="primary"
            loading={loading}
          >
            Salvar
          </Button>
        </Form>
      </FormProvider>
    </main>
  );
}
