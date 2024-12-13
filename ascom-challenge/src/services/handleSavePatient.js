
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mobile.digistat.it/CandidateApi',
  auth: {
    username: 'test',
    password: 'TestMePlease!'
  }
});

export const handleSavePatient = async (updatedPatient) => {
  try {

    const patientData = {
      familyName: updatedPatient.familyName,
      givenName: updatedPatient.givenName,
      sex: updatedPatient.sex
    };

    const response = await api.post('/Patient/Update', patientData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
