import type { StudentGroup, StudentGroupActivity } from '../models/studentGroup';
import type { UserSearchResult } from '../models/user';
import { SESSION_STORAGE_KEY } from './authService';

const API_URL = 'http://localhost:3000/groups';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || '{}').token || ''}`,
});

class StudentGroupsService {
  async getGroups(): Promise<StudentGroup[]> {
    const response = await fetch(API_URL, { headers: authHeaders() });
    if (!response.ok) throw new Error('No se pudieron cargar los grupos');
    return response.json();
  }

  async getGroup(groupId: string): Promise<StudentGroup> {
    const response = await fetch(`${API_URL}/${encodeURIComponent(groupId)}`, { headers: authHeaders() });
    if (!response.ok) throw new Error('No se pudo cargar el grupo');
    return response.json();
  }

  async getMembers(groupId: string): Promise<UserSearchResult[]> {
    const response = await fetch(`${API_URL}/${encodeURIComponent(groupId)}/members`, { headers: authHeaders() });
    if (!response.ok) throw new Error('No se pudieron cargar los miembros');
    return response.json();
  }

  async getActivities(groupId: string): Promise<StudentGroupActivity[]> {
    const response = await fetch(`${API_URL}/${encodeURIComponent(groupId)}/activities`, { headers: authHeaders() });
    if (!response.ok) throw new Error('No se pudo cargar la actividad del grupo');
    return response.json();
  }

  async createGroup(name: string, memberIds: string[]): Promise<StudentGroup> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ name, memberIds }),
    });
    if (!response.ok) throw new Error(await response.text() || 'No se pudo crear el grupo');
    return response.json();
  }

  async updateGroup(groupId: string, name: string, memberIds: string[]): Promise<StudentGroup> {
    const response = await fetch(`${API_URL}/${encodeURIComponent(groupId)}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ name, memberIds }),
    });
    if (!response.ok) throw new Error(await response.text() || 'No se pudo guardar el grupo');
    return response.json();
  }
}

export const studentGroupsService = new StudentGroupsService();
