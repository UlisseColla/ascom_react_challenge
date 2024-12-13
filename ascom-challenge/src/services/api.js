import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mobile.digistat.it/CandidateApi',
  auth: {
    username: 'test',
    password: 'TestMePlease!'
  }
});

export const getPatients = () => api.get('/Patient/GetList');
export const postPatients = (updatedPatient) => api.post('/Patient/Update', updatedPatient);

