import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Box
} from '@mui/material';
import { ListElement } from '../types';

interface ListElementTableProps {
  elements: ListElement[];
  loading: boolean;
  error: string | null;
}

const ListElementTable: React.FC<ListElementTableProps> = ({
  elements,
  loading,
  error
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" p={4}>
        {error}
      </Typography>
    );
  }

  if (elements.length === 0) {
    return (
      <Typography align="center" p={4}>
        No elements found. Add your first element above.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} elevation={3}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>Created At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {elements.map((element) => (
            <TableRow key={element.id}>
              <TableCell>{element.first_name}</TableCell>
              <TableCell>{element.last_name}</TableCell>
              <TableCell>{element.country}</TableCell>
              <TableCell>{formatDate(element.created_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListElementTable; 