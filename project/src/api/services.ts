import client from './client';
import * as dummy from '../data/dummy';

const safe = async <T>(fn: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await fn();
  } catch {
    return fallback;
  }
};

export const dashboardApi = {
  get: () => safe(async () => (await client.get('/dashboard/')).data, dummy.dummyDashboard),
  attritionTrend: () => safe(async () => (await client.get('/attrition-trend/')).data, dummy.dummyAttritionTrend),
  absenteeism: () => safe(async () => (await client.get('/absenteeism/')).data, dummy.dummyAbsenteeism),
};

export const employeesApi = {
  list: () => safe(async () => (await client.get('/employees/')).data, dummy.dummyEmployees),
  create: (data: unknown) => client.post('/employees/', data),
  update: (id: number, data: unknown) => client.put(`/employees/${id}/`, data),
  remove: (id: number) => client.delete(`/employees/${id}/`),
  toggle: (id: number) => client.patch(`/employees/${id}/toggle/`),
};

export const levelsApi = {
  list: () => safe(async () => (await client.get('/levels/')).data, dummy.dummyLevels),
  create: (data: unknown) => client.post('/levels/', data),
  update: (id: number, data: unknown) => client.put(`/levels/${id}/`, data),
  remove: (id: number) => client.delete(`/levels/${id}/`),
};

export const stationsApi = {
  list: () => safe(async () => (await client.get('/stations/')).data, dummy.dummyStations),
  create: (data: unknown) => client.post('/stations/', data),
  update: (id: number, data: unknown) => client.put(`/stations/${id}/`, data),
  remove: (id: number) => client.delete(`/stations/${id}/`),
};

export const attendanceApi = {
  list: (date?: string) => safe(async () => (await client.get('/attendance/', { params: { date } })).data, dummy.dummyAttendance),
  mark: (data: unknown) => client.post('/attendance/', data),
  bulk: (data: unknown) => client.post('/attendance/bulk/', data),
};

export const manpowerApi = {
  list: () => safe(async () => (await client.get('/manpower-requirement/')).data, dummy.dummyManpowerReq),
  create: (data: unknown) => client.post('/manpower-requirement/', data),
  update: (id: number, data: unknown) => client.put(`/manpower-requirement/${id}/`, data),
  remove: (id: number) => client.delete(`/manpower-requirement/${id}/`),
};

export const bufferApi = {
  list: () => safe(async () => (await client.get('/buffer-manpower/')).data, dummy.dummyBuffer),
  create: (data: unknown) => client.post('/buffer-manpower/', data),
  update: (id: number, data: unknown) => client.put(`/buffer-manpower/${id}/`, data),
  remove: (id: number) => client.delete(`/buffer-manpower/${id}/`),
};

export const attritionApi = {
  list: () => safe(async () => (await client.get('/attrition/')).data, dummy.dummyAttrition),
  create: (data: unknown) => client.post('/attrition/', data),
};

export const skillMatrixApi = {
  list: () => safe(async () => (await client.get('/skill-matrix/')).data, dummy.dummySkillMatrix),
  create: (data: unknown) => client.post('/skill-matrix/', data),
  update: (id: number, data: unknown) => client.put(`/skill-matrix/${id}/`, data),
  remove: (id: number) => client.delete(`/skill-matrix/${id}/`),
};

export const trainingApi = {
  list: () => safe(async () => (await client.get('/training/')).data, dummy.dummyTraining),
  create: (data: unknown) => client.post('/training/', data),
  update: (id: number, data: unknown) => client.put(`/training/${id}/`, data),
  remove: (id: number) => client.delete(`/training/${id}/`),
};

export const actionPlanApi = {
  list: () => safe(async () => (await client.get('/action-plans/')).data, dummy.dummyActionPlans),
  create: (data: unknown) => client.post('/action-plans/', data),
  update: (id: number, data: unknown) => client.put(`/action-plans/${id}/`, data),
  remove: (id: number) => client.delete(`/action-plans/${id}/`),
};
