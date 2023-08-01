import { Form, useFetcher } from '@remix-run/react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '~/components/button';
import { FormInput } from '~/components/forms/form-input';

interface Props {
  onRegisterClick?: () => void;
}

export function LoginView({ onRegisterClick }: Props) {
  const fetcher = useFetcher();
  const loading = fetcher.state !== 'idle';

  const form = useForm();

  return (
    <FormProvider {...form}>
      <Form
        replace
        method="POST"
        action="/login?modal"
        onSubmit={form.handleSubmit((_, e) => fetcher.submit(e?.target))}
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
          <button type="button" className="underline" onClick={onRegisterClick}>
            Cadastre-se agora
          </button>
        </p>
      </Form>
    </FormProvider>
  );
}
