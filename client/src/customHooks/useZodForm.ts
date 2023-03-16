import { ZodSchema, TypeOf } from 'zod';
import { useForm, UseFormProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface UseZodFormProps<T extends ZodSchema<any>>
  extends UseFormProps<TypeOf<T>> {
  schema: T;
}

export const useZodForm = <T extends ZodSchema<any>>({
  schema,
  ...formConfig
}: UseZodFormProps<T>) => {
  return useForm({
    ...formConfig,
    resolver: zodResolver(schema),
  });
};
