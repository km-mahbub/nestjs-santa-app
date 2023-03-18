import { FormValues } from '../components/Request';

const API_URL = window.location.origin.toString() + '/api';

export const addChristmasRequest = async (data: FormValues) => {
  const response = await fetch(`${API_URL}/christmas-request`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const checkUsername = async (username: string) => {
  const response = await fetch(`${API_URL}/check-username/${username}`, {
    method: 'GET',
    mode: 'cors',
    cache: 'default',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json();
};

export const formatFormErrors = (errors: any[]): string[] => {
  let errMessages: string[] = [];

  errors?.forEach((error: any) => {
    const { constraints } = error;

    for (const key in constraints) {
      errMessages.push(constraints[key]);
    }
  });

  return errMessages;
};
