import React, { useEffect, useState } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  FormControl,
  FormLabel,
  Switch,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/authContext";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const UpdateEventModal = ({
  isOpen,
  onClose,
  eventData,
  fetchFlag,
  setFetchFlag,
}) => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState(eventData.title);
  const [startDate, setStartDate] = useState(new Date(eventData.startDate));
  const [endDate, setEndDate] = useState(
    eventData.endDate ? new Date(eventData.endDate) : null
  );
  const [startTime, setStartTime] = useState(
    eventData.startTime ? new Date(eventData.startTime) : null
  );
  const [endTime, setEndTime] = useState(
    eventData.endTime ? new Date(eventData.endTime) : null
  );
  const [description, setDescription] = useState(eventData.description);
  const [isAllDay, setIsAllDay] = useState(eventData.isAllDay);
  const [recurrence, setRecurrence] = useState(eventData.recurrence);
  const [isRecurrenceVisible, setIsRecurrenceVisible] = useState(true);

  useEffect(() => {
    if (
      startDate &&
      endDate &&
      startDate.toDateString() === endDate.toDateString()
    ) {
      setIsRecurrenceVisible(false);
    } else {
      setIsRecurrenceVisible(true);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (isAllDay) {
      setEndDate(adjustDateOnly(startDate));
      setIsRecurrenceVisible(false);
    } else {
      setEndDate(null);
      setIsRecurrenceVisible(true);
    }
  }, [isAllDay, startDate]);

  const adjustDateOnly = (newDate) => {
    const newDateObj = new Date(newDate);
    return new Date(
      newDateObj.getFullYear(),
      newDateObj.getMonth(),
      newDateObj.getDate(),
      23,
      59
    );
  };

  const handleSubmit = async () => {
    const updatedEvent = {
      title,
      startDate: startDate.toISOString(),
      endDate: endDate ? endDate.toISOString() : null,
      startTime: startTime ? startTime.toISOString() : null,
      endTime: endTime ? endTime.toISOString() : null,
      description,
      isAllDay,
      recurrence,
    };

    try {
      const firebaseUid = await currentUser?.getIdToken();
      const response = await fetch(
        `${apiUrl}/events/${eventData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${firebaseUid}`,
          },
          body: JSON.stringify(updatedEvent),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const updatedEventResponse = await response.json();
      toast.success("Event updated!");
      setFetchFlag(!fetchFlag);
    } catch (error) {
      console.error("Error updating event: ", error);
      toast.error("Event update failed!");
    }

    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: { xs: 2, sm: 4 },
          width: { xs: "90%", sm: "75%", md: "50%", lg: "40%" }, 
          maxWidth: "600px", 
        }}
      >
        <IconButton
          sx={{ position: "absolute", top: 8, right: 8 }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" gutterBottom>
          Update Event
        </Typography>

        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />

        <Box sx={{ marginTop: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              input={(params) => <TextField {...params} fullWidth />}
              margin="normal"
            />

            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              input={(params) => <TextField {...params} fullWidth />}
              margin="normal"
            />
          </LocalizationProvider>
        </Box>

        <Box sx={{ marginTop: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={(newValue) => setStartTime(newValue)}
              input={(params) => <TextField {...params} fullWidth />}
              margin="normal"
            />

            <TimePicker
              label="End Time"
              value={endTime}
              onChange={(newValue) => setEndTime(newValue)}
              input={(params) => <TextField {...params} fullWidth />}
              margin="normal"
            />
          </LocalizationProvider>
        </Box>

        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <FormControl>
            <FormLabel>Is All Day?</FormLabel>
            <RadioGroup
              row
              value={isAllDay}
              onChange={(e) => setIsAllDay(e.target.value === "true")}
            >
              <FormControlLabel value={true} control={<Radio />} label="Yes" />
              <FormControlLabel value={false} control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          {isRecurrenceVisible ? (
            <FormControlLabel
              control={
                <Switch
                  checked={recurrence}
                  onChange={(e) => setRecurrence(e.target.checked)}
                />
              }
              label="Recurrence"
            />
          ) : (
            <Box />
          )}

          <Button
            variant="contained"
            color="primary"
            sx={{ width: { xs: "100%", sm: "30%" }, mt: { xs: 2, sm: 0 } }} 
            onClick={handleSubmit}
          >
            Update
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateEventModal;
