import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SESSION_STORAGE_KEY } from './authService';
import { studentGroupsService } from './studentGroupsService';

describe('StudentGroupsService', () => {
  beforeEach(() => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ token: 'valid-session-token' }));
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue([]),
    }));
  });

  afterEach(() => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    vi.unstubAllGlobals();
  });

  it('sends the logged-in session as a Bearer token', async () => {
    await studentGroupsService.getGroups();

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/groups',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer valid-session-token',
        }),
      }),
    );
  });
});
