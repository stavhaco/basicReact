import React, { useEffect, useState } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import ListElementForm from './components/ListElementForm';
import ListElementTable from './components/ListElementTable';
import { ListElement } from './types';
import { fetchElements } from './api';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [elements, setElements] = useState<ListElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadElements = async () => {
      console.log('Starting to load elements...');
      try {
        const data = await fetchElements();
        console.log('Received data from API:', data);
        console.log('Data type:', typeof data);
        console.log('Is Array?', Array.isArray(data));
        setElements(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error in loadElements:', err);
        setError('Failed to load elements');
      } finally {
        setLoading(false);
      }
    };

    loadElements();
  }, []);

  const handleNewElement = (element: ListElement) => {
    setElements(prevElements => [element, ...prevElements]);
  };

  console.log('Current elements state:', elements);
  console.log('Current loading state:', loading);
  console.log('Current error state:', error);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ListElementForm onElementAdded={handleNewElement} />
        <ListElementTable 
          elements={elements} 
          loading={loading} 
          error={error} 
        />
      </Container>
    </ThemeProvider>
  );
}

export default App; 