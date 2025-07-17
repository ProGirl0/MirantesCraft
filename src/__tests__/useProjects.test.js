import { renderHook } from '@testing-library/react';
import { useProjects } from '../hooks/useProjects';
import * as firestore from 'firebase/firestore';
import { describe, it, expect, jest } from '@jest/globals';

jest.mock('firebase/firestore');
jest.mock('../hooks/useCurrentUser', () => ({
  useCurrentUser: () => ({ uid: 'user1', email: 'user@email.com' }),
}));

describe('useProjects', () => {
  it('filtra projetos por owner ou membro', async () => {
    const mockProjects = [
      { id: '1', ownerId: 'user1', members: ['user@email.com'] },
      { id: '2', ownerId: 'user2', members: ['other@email.com'] },
    ];
    firestore.onSnapshot.mockImplementation((col, cb) => {
      cb({ docs: mockProjects.map(p => ({ id: p.id, data: () => p })) });
      return () => {};
    });
    firestore.getDocs.mockResolvedValue({ docs: [] });

    const { result, waitForNextUpdate } = renderHook(() => useProjects());
    await waitForNextUpdate();

    expect(result.current.projects).toHaveLength(1);
    expect(result.current.projects[0].id).toBe('1');
  });
}); 