import { object, string } from 'zod';
import { SubmitHandler } from 'react-hook-form';
import debounce from 'lodash/debounce';
import { useZodForm } from '../../customHooks/useZodForm';
import { Container } from '../ui/Container';
import { Form } from '../ui/Form';
import { Input } from '../ui/Input';
import { SubmitButton } from '../ui/SubmitButton';
import { TextArea } from '../ui/TextArea';
import {
  addChristmasRequest,
  checkUsername,
  formatFormErrors,
} from '../../utils/utils';
import { useEffect, useState } from 'react';
import { Banner } from '../ui/Banner';

export type FormValues = {
  username: string;
  requestText: string;
};

const requestSchema = object({
  username: string().min(1, { message: 'Username is required' }),
  requestText: string()
    .min(1, { message: 'Request Text is required' })
    .max(100, { message: 'Request Text must be less than 100 characters' }),
});

export function Request() {
  const [username, setUsername] = useState<string>('');
  const [userAdded, setUserAdded] = useState<boolean>(false);

  const [formErrors, setFormErrors] = useState<string[]>([]);

  const form = useZodForm({
    schema: requestSchema,
  });

  const {
    formState: { errors },
    setError,
  } = form;

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await addChristmasRequest(data);
      if (response?.statusCode === 1) {
        const { errors } = response;
        let formError: string[] = formatFormErrors(errors);
        setFormErrors(formError);
      } else if (response?.statusCode === 2) {
        setError('username', { message: response.message });
      } else if (response?.statusCode === 3) {
        setFormErrors([response.message]);
      } else if (response?.statusCode === 211) {
        setFormErrors([]);
        form.clearErrors();
        form.reset();
        setUserAdded(true);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const debouncedOnChange = debounce(async (value) => {
    const { statusCode, message } = await checkUsername(value);

    if (statusCode === 2) {
      setError('username', { message: message });
    } else {
      form.clearErrors('username');
    }

    setUserAdded(false);
    setFormErrors([]);
  }, 500);

  useEffect(() => {
    if (username.length > 0) {
      debouncedOnChange(username);
    } else {
      form.clearErrors('username');
    }

    return () => {
      debouncedOnChange.cancel();
    };
  }, [username]);

  const handleUsernameChange = async (event: any) => {
    const { value } = event.target;
    setUsername(value);
  };

  const handleTextChange = (_: any) => {
    setUserAdded(false);
    setFormErrors([]);
  };

  return (
    <Container>
      <Form form={form} onSubmit={onSubmit}>
        {userAdded && (
          <Banner
            intent="primary"
            text="Your request has been listed! Let's see if you were good this year!"
          />
        )}
        {formErrors?.map((error, index) => (
          <Banner key={index} intent="danger" text={error} />
        ))}
        <Input
          label="Who are you?"
          placeholder="charlie.brown"
          {...form.register('username')}
          isError={errors.username ? true : false}
          onChange={handleUsernameChange}
        />
        <TextArea
          label="What do you want for christmas?"
          placeholder="Gifts, toys, money, etc."
          {...form.register('requestText')}
          isError={errors.requestText ? true : false}
        />
        <SubmitButton intent="secondary">Send</SubmitButton>
      </Form>
    </Container>
  );
}
