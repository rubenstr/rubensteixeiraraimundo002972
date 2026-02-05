import { Credentials } from './credentials';

describe('Login', () => {
  it('deve criar credenciais válidas', () => {
    const credentials: Credentials = {
      email: 'teste@email.com',
      password: '123456'
    };

    expect(credentials.email).toBeTruthy();
  });
});
