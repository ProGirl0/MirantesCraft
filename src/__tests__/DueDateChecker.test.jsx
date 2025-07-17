import { render } from '@testing-library/react';
import DueDateChecker from '../components/notifications/DueDateChecker';
import * as firestore from 'firebase/firestore';

jest.mock('firebase/firestore');
jest.mock('../../hooks/useCurrentUser', () => ({
  useCurrentUser: () => ({ uid: 'user1', email: 'user@email.com' }),
}));

test('não cria notificação duplicada de due date', async () => {
  firestore.getDocs.mockResolvedValueOnce({ empty: false }); // Já existe notificação
  // Renderize o componente e verifique que notifyTaskDueDate NÃO é chamado
  // (Você pode mockar notifyTaskDueDate e verificar que não foi chamado)
}); 