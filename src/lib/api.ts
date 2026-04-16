import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
});

export interface TaskResponse {
  task_id: string;
  status: string;
}

export interface TaskResult {
  status: string;
  result_url?: string;
}

export const generateImage = (data: FormData) =>
  api.post<TaskResponse>('/generate/image', data);

export const editImage = (data: FormData) =>
  api.post<TaskResponse>('/edit/image', data);

export const generateVideo = (data: FormData) =>
  api.post<TaskResponse>('/generate/video', data);

export const animateBody = (data: FormData) =>
  api.post<TaskResponse>('/animate/body', data);

export const syncLip = (data: FormData) =>
  api.post<TaskResponse>('/sync/lip', data);

export const generateVoice = (data: FormData) =>
  api.post<TaskResponse>('/generate/voice', data);

export const generateStudio = (data: FormData) =>
  api.post<TaskResponse>('/generate/studio', data);

export const pollTask = (taskId: string) =>
  api.get<TaskResult>(`/task/${taskId}`);

export const getResultUrl = (path: string) =>
  `${API_BASE}${path}`;

export default api;
