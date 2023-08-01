import { redirect, type DataFunctionArgs } from '@remix-run/node';
import {
  Form,
  useFormAction,
  useNavigation,
  useSubmit,
  type V2_MetaFunction,
} from '@remix-run/react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button } from '~/components/button';
import { FormInput } from '~/components/forms/form-input';
import { handleActionError } from '~/lib/handle-action-error.server';
import { requester } from '~/lib/requester';
import { getSessionManager } from '~/session.server';

export const meta: V2_MetaFunction = () => [{ title: 'Nova discussão' }];

export const action = async ({ request }: DataFunctionArgs) => {
  try {
    const session = await getSessionManager(request);
    const token = session.get('token');
    const body = new URLSearchParams(await request.text());
    const response = await requester.post(`/api/v1/discussions`, {
      body,
      headers: { Authorization: `Bearer ${token}` },
    });
    const { discussion } = await response.json();
    return redirect(`/d/${discussion.id}`);
  } catch (error) {
    return handleActionError({ error, request });
  }
};

export default function NewDiscussionRoute() {
  const form = useForm();
  const submit = useSubmit();
  const loading = useFormAction() === useNavigation().formAction;

  return (
    <main className="max-w-4xl mx-auto px-3 py-3">
      <h1 className="text-xl font-semibold mb-2">Inicie uma nova discussão</h1>

      <FormProvider {...form}>
        <Form
          method="POST"
          onSubmit={form.handleSubmit((_, e) => submit(e?.target))}
        >
          <FormInput
            label="Título da discussão"
            name="title"
            className="mb-2"
            rules={{ required: 'Preencha este campo' }}
          />
          <FormInput
            label="Descrição"
            name="description"
            rules={{ required: 'Preencha este campo' }}
            className="mb-3"
          />
          <Button className="ml-auto" variant="primary" loading={loading}>
            Iniciar discussão
          </Button>
        </Form>
      </FormProvider>
    </main>
  );
}
