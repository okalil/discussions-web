import { useFetcher } from '@remix-run/react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '~/components/button';
import { FormInput } from '~/components/forms/form-input';

interface Props {
  onLoginClick: () => void;
}

export function RegisterView({ onLoginClick }: Props) {
  const fetcher = useFetcher();
  const loading = fetcher.state !== 'idle';

  const form = useForm();

  return (
    <FormProvider {...form}>
      <fetcher.Form
        action="/register?modal"
        method="POST"
        onSubmit={form.handleSubmit((_, e) => fetcher.submit(e?.target))}
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
          <button type="button" className="underline" onClick={onLoginClick}>
            Entrar agora
          </button>
        </p>
      </fetcher.Form>
    </FormProvider>
  );
}
