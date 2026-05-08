import type { FormConfig } from '../services/form.model';

/** Simulates a remote API call with a 300 ms network delay. */
export async function fetchFormConfig(): Promise<FormConfig> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        formNameTitle: 'Reactive Form',
        formAttributes: [
          {
            key: 'userFirstName',
            title: 'First Name',
            type: 'input',
            maxLen: 20,
            optional: false,
          },
          {
            key: 'userLastName',
            title: 'Last Name',
            type: 'input',
            maxLen: 20,
            optional: false,
          },
          {
            key: 'gender',
            title: 'Gender',
            type: 'switch',
            options: ['male', 'female'],
            optional: false,
          },
        ],
      });
    }, 300);
  });
}
