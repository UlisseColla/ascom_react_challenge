import React, { 
  useState,
  useEffect 
} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { format } from 'date-fns';
import { handleSavePatient } from '../services/handleSavePatient';

const PatientDialogEditable = ({ open, onClose, patient, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState(null);

  useEffect(() => {
    if (patient) {
      setEditedPatient({
        ...patient,
        familyName: patient.familyName,
        givenName: patient.givenName,
        sex: patient.sex
      });
    }
  }, [patient]);

  if (!patient || !editedPatient) return null;

  const handleChange = (field) => (event) => {
    setEditedPatient({
      ...editedPatient,
      [field]: event.target.value
    });
  };

  const handleSave = async () => {
    try {
      await onSave(editedPatient);
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error('Error saving patient:', error);
    }
  };

  const handleCancel = () => {
    setEditedPatient({
      ...patient,
      familyName: patient.familyName,
      givenName: patient.givenName,
      sex: patient.sex
    });
    setIsEditing(false);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Patient Details
        {!isEditing && (
          <Button 
            onClick={() => setIsEditing(true)}
            sx={{ float: 'right' }}
          >
            Edit
          </Button>
        )}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} className="mb-4">
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Family Name
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                value={editedPatient.familyName}
                onChange={handleChange('familyName')}
                size="small"
                margin="dense"
              />
            ) : (
              <Typography variant="body1">
                {patient.familyName}
              </Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Given Name
            </Typography>
            {isEditing ? (
              <TextField
                fullWidth
                value={editedPatient.givenName}
                onChange={handleChange('givenName')}
                size="small"
                margin="dense"
              />
            ) : (
              <Typography variant="body1">
                {patient.givenName}
              </Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Sex
            </Typography>
            {isEditing ? (
              <FormControl fullWidth size="small" margin="dense">
                <Select
                  value={editedPatient.sex}
                  onChange={handleChange('sex')}
                >
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                  <MenuItem value="O">Other</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <Typography variant="body1">
                {patient.sex}
              </Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Birth Date
            </Typography>
            <Typography variant="body1">
              {format(new Date(patient.birthDate), 'PP')}
            </Typography>
          </Grid>
        </Grid>

        <Typography variant="h6" className="mb-2">
          Parameters
        </Typography>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Value</TableCell>
                <TableCell align="center">Alarm</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patient.parameters.map((param) => (
                <TableRow key={param.id}>
                  <TableCell>{param.name}</TableCell>
                  <TableCell>{param.value}</TableCell>
                  <TableCell align="center">
                    {param.alarm ? (
                      <span className="text-red-500">⚠️</span>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      {isEditing && (
        <DialogActions>
          <Button onClick={handleCancel} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default PatientDialogEditable;
