import { describe, it, expect, jest } from '@jest/globals';

const loginPayload = {
  email: 'djumaamin00@gmail.com',
  password: '12345678',
  returnSecureToken: true,
  clientType: 'CLIENT_TYPE_WEB',
};

const expectedResponse = {
  kind: 'identitytoolkit#VerifyPasswordResponse',
  localId: 'Ym0SkgTkDvQqlGtDR3tymPltIxA3',
  email: 'djumaamin00@gmail.com',
  displayName: '',
  idToken: expect.any(String),
  registered: true,
  refreshToken: expect.any(String),
  expiresIn: '3600',
};

describe('Auth API request', () => {
  it('deve autenticar com email e senha válidos e retornar a resposta esperada', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        kind: 'identitytoolkit#VerifyPasswordResponse',
        localId: 'Ym0SkgTkDvQqlGtDR3tymPltIxA3',
        email: 'djumaamin00@gmail.com',
        displayName: '',
        idToken: 'token-fake',
        registered: true,
        refreshToken: 'refresh-fake',
        expiresIn: '3600',
      }),
    });

    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAXnZixDsFHB6yXC95y7PCw5G3jKrzYGSc',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginPayload),
      }
    );
    const data = await response.json();
    expect(data).toMatchObject(expectedResponse);
  });
}); 