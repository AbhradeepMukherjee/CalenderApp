import React, { useState } from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { Box, Typography, Button } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import { doSignOut } from '../firebase/auth';
import { useAuth } from '../contexts/authContext';
import { toast, ToastContainer } from 'react-toastify';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  const {userLoggedIn} = useAuth();
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleLogout = async () => {
    try {
      await doSignOut();
      toast.success('Logged out successfully!')
      navigate('/login'); 
    } catch (error) {
      console.error("Logout failed", error);
      toast.error('Logout failed!')
    }
  };

  return (
    <>
    {!userLoggedIn && <Navigate to={"/"} replace={true} />}
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: '#f5f5f5',
          padding: 3,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
          }}
        >
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        <Typography variant="h4" gutterBottom>
          Calendar
        </Typography>
        <DateCalendar
          value={selectedDate}
          onChange={handleDateChange}
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: '#fff',
            padding: {md: 2, xs: 0},
          }}
        />
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Selected Date: {selectedDate.toDateString()}
        </Typography>
      </Box>
    </LocalizationProvider>
    </>
  );
}
