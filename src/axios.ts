import axios, { AxiosInstance } from 'axios';

const apiUrl = 'https://reqres.in/api/users';

export const api: AxiosInstance = axios.create({
  baseURL: apiUrl,
});
