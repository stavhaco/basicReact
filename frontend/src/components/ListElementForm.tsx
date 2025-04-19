import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Typography,
  Grid 
} from '@mui/material';
import { ListElement, ListElementFormData } from '../types';
import { createElement } from '../api';

interface ListElementFormProps {
  onElementAdded: (element: ListElement) => void;
}

const ListElementForm: React.FC<ListElementFormProps> = ({ onElementAdded }) => {
  const [formData, setFormData] = useState<ListElementFormData>({
    first_name: '',
    last_name: '',
    country: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form with data:', formData);
    setLoading(true);
    setError(null);

    try {
      console.log('Calling createElement API...');
      const newElement = await createElement(formData);
      console.log('API Response:', newElement);
      onElementAdded(newElement);
      setFormData({
        first_name: '',
        last_name: '',
        country: ''
      });
    } catch (err) {
      console.error('Error in form submission:', err);
      setError('Failed to add element');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Add New Element
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              fullWidth
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              fullWidth
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              fullWidth
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>
        </Grid>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ 
            mt: 2,
            py: 1.5,
            px: 4,
            fontSize: '1.1rem',
            backgroundColor: '#ff9800',
            '&:hover': {
              backgroundColor: '#f57c00',
            },
          }}
        >
          {loading ? 'Adding...' : 'Add Element'}
        </Button>
      </Box>
    </Paper>
  );
};

export default ListElementForm; 