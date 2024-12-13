import React, { 
  useState, 
  useEffect 
} from 'react';
import { 
  DataGrid, 
  GridToolbar 
} from '@mui/x-data-grid';
import ErrorIcon from '@mui/icons-material/Error';
import { format } from 'date-fns';
import PatientDialogEditable from './PatientDialogEditable';
import { handleSavePatient } from '../services/handleSavePatient';
import { getPatients } from '../services/api';

const PatientGrid = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  const handleRowClick = (patient) => {
    setSelectedPatient(patient);
    setIsDetailDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDetailDialogOpen(false);
    setSelectedPatient(null);
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await getPatients();
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [refreshTrigger]);

  const onSavePatient = async (updatedPatient) => {
    try {
      setLoading(true);
      await handleSavePatient(updatedPatient);
      setRefreshTrigger(prev => prev + 1);
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'familyName', headerName: 'Family Name', width: 130 },
    { field: 'givenName', headerName: 'Given Name', width: 130 },
    { field: 'sex', headerName: 'Sex', width: 90 },
    { 
      field: 'birthDate',
      headerName: 'Birth Date',
      width: 130,
      renderCell: (params) => {
        const [date] = params.row.birthDate.split('T');
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
      }
     },
    { 
      field: 'paramCount', 
      headerName: 'Parameters', 
      width: 100,
      renderCell: (params) => params.row.parameters.length
    },
    {
      field: 'hasAlarm',
      headerName: 'Alarm',
      width: 100,
      renderCell: (params) => {
        const hasAlarm = params.row.parameters.some(param => param.alarm);
        return hasAlarm ? <ErrorIcon color="error" /> : null;
      }
    }
  ];

// Map the original API data to add a uniqueId to each patient and to remove duplicates, in case of call to the API to fetch the patients
/* const uniquePatients = patients.map((patient, index, array) => {

  const isDuplicate = array.some((p, earlierIndex) => 
    earlierIndex < index &&
    p.id === patient.id );
  
  const uniqueId = isDuplicate ? index + 1000 : patient.id;
  return { ...patient, uniqueId };
})
.filter((patient, index, array) => {

  const isDuplicate = array.some((p, earlierIndex) => 
      earlierIndex < index &&
      p.familyName === patient.familyName &&
      p.givenName === patient.givenName &&
      p.sex === patient.sex &&
      p.birthDate === patient.birthDate
  );
  
  return !isDuplicate;
}); */

/* If using uniquePatients, then instead of 'patients' use 'uniquePatients', and 'row.id' becomes 'row.uniqueId' */
  return (
    <div style={{ height: 600, width: '100%' }}>
    {patients.length > 0 && (
      <DataGrid
        rows={patients}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.id}
        onRowClick={(params) => handleRowClick(params.row)}
      />
    )}

    <PatientDialogEditable
      open={isDetailDialogOpen}
      onClose={handleCloseDialog}
      patient={selectedPatient}
      onSave={onSavePatient}
    />
    </div>
  );
};

export default PatientGrid;
