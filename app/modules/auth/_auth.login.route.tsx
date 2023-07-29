import type { V2_MetaFunction } from '@remix-run/react';
import type { DataFunctionArgs } from '@remix-run/node';
import {
  Form,
  Link,
  useFormAction,
  useNavigation,
  useSubmit,
} from '@remix-run/react';
import { redirect } from '@remix-run/node';
import { FormProvider, useForm } from 'react-hook-form';

import { Button } from '~/components/button';
import { FormInput } from '~/components/forms/form-input';
import { requester } from '~/lib/requester';
import { handleActionError } from '~/lib/handle-action-error.server';
import { getSessionStorage } from '~/session.server';
import { saveToken } from './auth.server';
import { addToast } from '~/lib/toast.server';

export const meta: V2_MetaFunction = () => [{ title: 'Login' }];

export const action = async ({ request }: DataFunctionArgs) => {
  try {
    const body = new URLSearchParams(await request.text());
    const response = await requester.post('/api/v1/users/login', { body });
    const { token } = await response.json();

    const storage = await getSessionStorage(request);
    saveToken(storage.session, token);
    addToast(storage.session, {
      content: 'Autenticado com sucesso!',
      type: 'success',
    });

    return redirect('/', { headers: { 'Set-Cookie': await storage.commit() } });
  } catch (error) {
    return handleActionError({ error, request });
  }
};

export default function LoginRoute() {
  const submit = useSubmit();
  const loading = useFormAction() === useNavigation().formAction;

  const form = useForm();

  return (
    <FormProvider {...form}>
      <Form
        method="POST"
        className="flex-1 max-w-xs"
        onSubmit={form.handleSubmit((_, e) => submit(e?.target))}
      >
        <h2 className="font-semibold text-3xl text-center mb-8">Entrar</h2>

        <FormInput
          className="mb-2"
          label="E-mail"
          name="email"
          type="email"
          rules={{ required: 'E-mail é obrigatório' }}
        />
        <FormInput
          className="mb-6"
          label="Senha"
          name="password"
          type="password"
          rules={{ required: 'Senha é obrigatória' }}
        />
        <Button
          variant="primary"
          loading={loading}
          className="w-full h-10 mb-6"
        >
          Entrar
        </Button>

        <p className="text-gray-600 text-center">
          Novo por aqui?{' '}
          <Link className="underline" to="../register">
            Cadastre-se agora
          </Link>
        </p>
      </Form>
    </FormProvider>
  );
}