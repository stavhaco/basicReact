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
      try {
        const data = await fetchElements();
        setElements(data);
      } catch (err) {
        setError('Failed to load elements');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadElements();
  }, []);

  const handleNewElement = (element: ListElement) => {
    setElements(prevElements => [element, ...prevElements]);
  };

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