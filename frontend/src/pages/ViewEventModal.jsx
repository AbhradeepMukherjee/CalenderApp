import React from "react";
import {
  Box,
  Modal,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const ViewEventModal = ({ isOpen, onClose, eventData }) => {
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
          p: 4,
          minWidth: 300,
          maxWidth: '90%', 
        }}
      >
        <IconButton sx={{ position: "absolute", top: 8, right: 8 }} onClick={onClose}>
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" gutterBottom>
          Event Details
        </Typography>
        <Box sx={{display: "flex", flexDirection: "column", gap: 1, marginTop: 1, alignItems: "center", justifyContent: "center"}}>
        <Typography variant="subtitle1"><strong>Title:</strong> {eventData.title}</Typography>
        
        <LocalizationProvider dateAdapter={AdapterDateFns} >
          <Typography variant="subtitle1" sx={{display: "flex", flexDirection: "row", gap: 1, marginTop: 1, alignItems: "center", justifyContent: "center", width: "100%"}}>
            <strong>Start Date:</strong> <DatePicker
              readOnly
              value={new Date(eventData.startDate)}
              input={(params) => <span {...params} />}
              sx={{width: "100%"}}
            />
          </Typography>

          <Typography variant="subtitle1" sx={{display: "flex", flexDirection: "row", gap: 1, marginTop: 1, alignItems: "center", justifyContent: "center", width: "100%"}}>
            <strong>End Date:</strong> {eventData.endDate ? (
              <DatePicker
                readOnly
                value={new Date(eventData.endDate)}
                input={(params) => <span {...params} />}
                sx={{width: "100%"}}
              />
            ) : "N/A"}
          </Typography>

          <Typography variant="subtitle1" sx={{display: "flex", flexDirection: "row", gap: 1, marginTop: 1, alignItems: "center", justifyContent: "center", width: "100%"}}>
            <strong>Start Time:</strong> {eventData.startTime ? (
              <TimePicker
                readOnly
                value={new Date(eventData.startTime)}
                input={(params) => <span {...params} />}
                sx={{width: "100%"}}
              />
            ) : "N/A"}
          </Typography>

          <Typography variant="subtitle1" sx={{display: "flex", flexDirection: "row", gap: 1, marginTop: 1, alignItems: "center", justifyContent: "center"}}>
            <strong>End Time:</strong> {eventData.endTime ? (
              <TimePicker
                readOnly
                value={new Date(eventData.endTime)}
                input={(params) => <span {...params} />}
                sx={{width: "100%"}}
              />
            ) : "N/A"}
          </Typography>
        </LocalizationProvider>

        <Typography variant="subtitle1"><strong>Description:</strong> {eventData.description}</Typography>
        <Typography variant="subtitle1"><strong>Is All Day:</strong> {eventData.isAllDay ? "Yes" : "No"}</Typography>
        <Typography variant="subtitle1"><strong>Recurrence:</strong> {eventData.recurrence ? "Yes" : "No"}</Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default ViewEventModal;
