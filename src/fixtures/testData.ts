export type CheckoutUser = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  postalCode: string;
};

// Factory over constants: keeps tests readable and gives one place to tweak.
export const userFactory = (overrides: Partial<CheckoutUser> = {}): CheckoutUser => ({
  username: 'standard_user',
  password: 'secret_sauce',
  firstName: 'Alek',
  lastName: 'Singer',
  postalCode: '78640',
  ...overrides,
});

export const productFactory = () => ['Sauce Labs Backpack', 'Sauce Labs Bolt T-Shirt'];
