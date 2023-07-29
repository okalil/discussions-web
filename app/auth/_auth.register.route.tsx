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
import { addToast } from '~/toasts/toast.server';
import { saveToken } from './auth.server';

export const meta: V2_MetaFunction = () => [{ title: 'Criar conta' }];

export const action = async ({ request }: DataFunctionArgs) => {
  try {
    const body = new URLSearchParams(await request.text());
    const response = await requester.post('/api/v1/users', { body });
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

export default function RegisterRoute() {
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
        <h2 className="font-semibold text-3xl text-center mb-8">Criar conta</h2>
        <FormInput
          className="mb-2"
          label="Nome"
          name="name"
          type="text"
          rules={{
            required: 'Nome é obrigatório',
          }}
        />
        <FormInput
          className="mb-2"
          label="E-mail"
          name="email"
          type="email"
          rules={{
            required: 'E-mail é obrigatório',
            // pattern: {
            //   value: /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/gi,
            //   message: 'Insira um e-mail válido',
            // },
          }}
        />
        <FormInput
          className="mb-2"
          label="Senha"
          name="password"
          type="password"
          rules={{ required: 'Senha é obrigatório' }}
        />
        <FormInput
          className="mb-6"
          label="Confirmar senha"
          name="password_confirmation"
          type="password"
          rules={{
            required: 'Confirmar senha é obrigatório',
            validate(value, values) {
              console.log(value, values);
              return (
                values?.password === value ||
                'Confirmação de senha deve ser igual à senha'
              );
            },
          }}
        />
        <Button
          variant="primary"
          className="w-full h-10 mb-6"
          loading={loading}
        >
          Criar
        </Button>

        <p className="text-gray-600 text-center">
          Já tem uma conta?{' '}
          <Link to="../login" className="underline">
            Entrar agora
          </Link>
        </p>
      </Form>
    </FormProvider>
  );
}
