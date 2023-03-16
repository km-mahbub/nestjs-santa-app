import { object, string } from 'zod';
import { useZodForm } from '../../customHooks/useZodForm';
import { Container } from '../ui/Container';
import { Form } from '../ui/Form';
import { Input } from '../ui/Input';
import { SubmitButton } from '../ui/SubmitButton';
import { TextArea } from '../ui/TextArea';

const requestSchema = object({
  text: string().min(1),
  input: string().min(1),
});

export function Request() {
  const form = useZodForm({
    schema: requestSchema,
  });

  return (
    <Container>
      <Form form={form} onSubmit={({ text }) => alert('create')}>
        <Input label="Who are you?" {...form.register('input')} />
        <TextArea
          label="What do you want for christmas?"
          {...form.register('text')}
        />
        <SubmitButton intent="secondary">Send</SubmitButton>
      </Form>
    </Container>
  );
}
