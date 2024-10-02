import React, { useState, useEffect } from "react";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import {
  Box,
  Typography,
  Button,
  MenuItem,
  Select,
  IconButton,
} from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import { doSignOut } from "../firebase/auth";
import { useAuth } from "../contexts/authContext";
import { toast } from "react-toastify";
import timezones from "../data/timezones.json";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { ClockIcon } from "@mui/x-date-pickers/icons";
import CreateEventModal from "./CreateEventModal";
import UpdateEventModal from "./UpdateEventModal";
import ViewEventModal from "./ViewEventModal";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function Home() {
  const [fetchFlag, setFetchFlag] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewType, setViewType] = useState("thisWeek");
  const [filteredEventsByDate, setFilteredEventsByDate] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filteredEventsByWeekOrMonth, setFilteredEventsByWeekOrMonth] =
    useState([]);
  const navigate = useNavigate();
  const { currentUser, userLoggedIn } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  function formatDateString(dateStr) {
    const date = new Date(dateStr);

    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const weekday = date.toLocaleString("default", { weekday: "short" });

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const gmtMatch = dateStr.match(/GMT([+-]\d{4})/);
    const gmtOffset = gmtMatch ? gmtMatch[1] : "+0000";

    const timezone = timezones.gmtToTimezoneMap[gmtOffset] || "Unknown";

    const formattedDateObj = {
      date: `${day} ${month} ${year}`,
      weekday: `${weekday}`,
      time: `${hours}:${minutes}`,
      zone: `${timezone}`,
    };

    return formattedDateObj;
  }

  const handleLogout = async () => {
    try {
      await doSignOut();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed!");
    }
  };

  const filterEventsByDate = async () => {
    try {
      const token = await currentUser?.getIdToken();
      const response = await fetch(`${apiUrl}/events/date/${selectedDate}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        console.error("Failed to fetch events for the selected date");
        setFilteredEventsByDate([]);
        return;
      }
      const events = await response.json();
      setFilteredEventsByDate(events);
    } catch (error) {
      console.error(error);
    }
  };

  const filterEventsByViewType = async (type) => {
    let endpoint;

    if (type === "thisWeek") {
      const date = new Date(selectedDate);
      const day = date.getDay();
      const diff = day === 0 ? 0 : -day;
      const startOfWeek = new Date(date.setDate(date.getDate() + diff))
        .toISOString()
        .split("T")[0];
      endpoint = `${apiUrl}/events/week/${startOfWeek}`;
    } else if (type === "thisMonth") {
      const month = selectedDate.getMonth();
      endpoint = `${apiUrl}/events/month/${month + 1}`;
    }
    try {
      const token = await currentUser?.getIdToken();
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        setFilteredEventsByWeekOrMonth([]);
        throw new Error("Failed to fetch events");
      }
      const events = await response.json();
      setFilteredEventsByWeekOrMonth(events);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteHandler = async (eventId) => {
    try {
      const token = await currentUser?.getIdToken();
      const response = await fetch(`${apiUrl}/events/${eventId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setFetchFlag(!fetchFlag);
        toast.success("Event deleted successfully!");
      } else {
        toast.error("Event deletion failed!");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  const handleUpdateButtonClick = (event) => {
    setUpdateModalOpen(true);
    setSelectedEvent(event);
  };

  const handleViewButtonClick = (event) => {
    setViewModalOpen(true);
    setSelectedEvent(event);
  };

  useEffect(() => {
    filterEventsByDate(selectedDate);
  }, [fetchFlag, selectedDate]);

  const handleViewTypeChange = (event) => {
    const type = event.target.value;
    setViewType(type);
  };

  useEffect(() => {
    filterEventsByViewType(viewType);
  }, [fetchFlag, selectedDate, viewType]);

  useEffect(()=>{
    if(!userLoggedIn){
      navigate('/login');
    }
  },[userLoggedIn])

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            bgcolor: "#f5f5f5",
            paddingY: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { md: "row", xs: "column" },
              justifyContent: "center",
              width: "90%",
              marginX: { xs: "auto", md: "none" },
              marginTop: { xs: 5, md: "none" },
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                width: { md: "50%", xs: "100%" },
              }}
            >
              <Typography variant="h4" gutterBottom>
                Calendar
              </Typography>
              <DateCalendar
                value={selectedDate}
                onChange={handleDateChange}
                sx={{
                  boxShadow: 3,
                  borderRadius: 2,
                  bgcolor: "#fff",
                  padding: { md: 2, xs: 0 },
                }}
              />
              <Typography variant="h8" sx={{ marginTop: 1 }}>
                User: {currentUser?.email}
              </Typography>
            </Box>

            <Box
              sx={{
                width: "100%",
                padding: 3,
                paddingLeft: 0,
              }}
            >
              <Typography variant="h6" gutterBottom>
                View Events:
              </Typography>
              <Select
                value={viewType}
                onChange={handleViewTypeChange}
                fullWidth
              >
                <MenuItem value="thisWeek">This Week</MenuItem>
                <MenuItem value="thisMonth">This Month</MenuItem>
              </Select>

              <Box
                sx={{
                  maxHeight:
                    filteredEventsByWeekOrMonth?.length > 3 ? "300px" : "auto",
                  overflowY:
                    filteredEventsByWeekOrMonth?.length > 3
                      ? "auto"
                      : "visible",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "1rem",
                }}
              >
                {filteredEventsByWeekOrMonth?.length > 0 ? (
                  filteredEventsByWeekOrMonth?.map((event, index) => {
                    const startOfEvent = formatDateString(
                      event.startDate.toString().trim()
                    );
                    const endOfEvent = formatDateString(
                      event.endDate.toString().trim()
                    );
                    const startTimeofEvent = formatDateString(
                      event.startDate.toString().trim()
                    );
                    const endTimeofEvent = formatDateString(
                      event.endDate.toString().trim()
                    );
                    const isLastItem =
                      index === filteredEventsByWeekOrMonth?.length - 1;
                    return (
                      <Box
                        key={event.id}
                        sx={{
                          padding: 2,
                          borderBottom: isLastItem ? "none" : "1px solid #ccc",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { md: "row", xs: "column" },
                            justifyContent: "space-between",
                            alignItems: { md: "center", xs: "flex-start" },
                          }}
                        >
                          <Typography
                            sx={{ fontSize: { md: "20px", xs: "17px" } }}
                          >
                            {event.title}
                          </Typography>
                          <Typography
                            sx={{ fontSize: { md: "15px", xs: "13px" } }}
                          >
                            {`${startTimeofEvent?.time} (${startTimeofEvent?.zone})
                             - ${endTimeofEvent?.time} (${endTimeofEvent?.zone})`}
                          </Typography>
                          <Typography
                            sx={{ fontSize: { md: "15px", xs: "13px" } }}
                          >
                            {`${startOfEvent?.date}, ${startOfEvent?.weekday}, ${startOfEvent?.time} (${startOfEvent?.zone})
                             - ${endOfEvent?.date}, ${endOfEvent?.weekday}, ${endOfEvent?.time} (${endOfEvent?.zone})`}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{ fontSize: { md: "17px", xs: "15px" } }}
                          >
                            {event.description}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              justifyContent: "flex-end",
                            }}
                          >
                            <IconButton
                              style={{ color: "black" }}
                              onClick={() => handleViewButtonClick(event)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton
                              style={{ color: "black" }}
                              onClick={() => deleteHandler(event.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                            <IconButton
                              style={{ color: "black" }}
                              onClick={() => handleUpdateButtonClick(event)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })
                ) : (
                  <Typography>No events available</Typography>
                )}
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              marginTop: { md: 7, xs: 2 },
              width: { md: "80%", xs: "90%" },
              marginX: "auto",
            }}
          >
            <Typography variant="h6">
              Events for {selectedDate.toDateString()}:
            </Typography>
            <Box
              sx={{
                maxHeight: filteredEventsByDate?.length > 3 ? "300px" : "auto",
                overflowY:
                  filteredEventsByDate?.length > 3 ? "auto" : "visible",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "1rem",
              }}
            >
              {filteredEventsByDate?.length > 0 ? (
                filteredEventsByDate?.map((event, index) => {
                  const startTimeofEvent = formatDateString(
                    event.startTime.toString().trim()
                  );
                  const endTimeofEvent = formatDateString(
                    event.endTime.toString().trim()
                  );
                  const isLastItem = index === filteredEventsByDate.length - 1;
                  return (
                    <Box
                      key={event.id}
                      sx={{
                        padding: 2,
                        borderBottom: isLastItem ? "none" : "1px solid #ccc",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { md: "row", xs: "column" },
                          justifyContent: "space-between",
                          alignItems: { md: "center", xs: "flex-start" },
                        }}
                      >
                        <Typography
                          sx={{ fontSize: { md: "20px", xs: "17px" } }}
                        >
                          {event.title}
                        </Typography>
                        {!event.isAllDay ? (
                          <Typography
                            sx={{ fontSize: { md: "15px", xs: "13px" } }}
                          >
                            {`${startTimeofEvent?.time}
                             - ${endTimeofEvent?.time}  (${endTimeofEvent?.zone})`}
                          </Typography>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              sx={{ fontSize: { md: "13px", xs: "11px" } }}
                            >
                              All Day
                            </Typography>
                            <ClockIcon />
                          </Box>
                        )}
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{ fontSize: { md: "17px", xs: "15px" } }}
                        >
                          {event.description}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "flex-end",
                          }}
                        >
                          <IconButton
                            style={{ color: "black" }}
                            onClick={() => handleViewButtonClick(event)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            style={{ color: "black" }}
                            onClick={() => deleteHandler(event.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <IconButton
                            style={{ color: "black" }}
                            onClick={() => handleUpdateButtonClick(event)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  );
                })
              ) : (
                <Typography>No events for the selected day</Typography>
              )}
            </Box>
            <Button
              sx={{
                width: "100%",
                extAlign: "center",
                color: "black",
                display: "flex",
                alignItems: "center",
                fontSize: "17px",
                gap: { md: 4, xs: 0 },
                border: 1,
              }}
              onClick={() => setModalOpen(true)}
            >
              <Typography>Add Events/Meetings</Typography>
              <AddIcon />
            </Button>
          </Box>
          {isModalOpen && (
            <CreateEventModal
              isOpen={isModalOpen}
              onClose={() => setModalOpen(false)}
              selectedDate={selectedDate}
              fetchFlag={fetchFlag}
              setFetchFlag={setFetchFlag}
            />
          )}
          {isUpdateModalOpen && (
            <UpdateEventModal
              isOpen={isUpdateModalOpen}
              onClose={() => setUpdateModalOpen(false)}
              eventData={selectedEvent}
              fetchFlag={fetchFlag}
              setFetchFlag={setFetchFlag}
            />
          )}
          {isViewModalOpen && (
            <ViewEventModal
              isOpen={isViewModalOpen}
              onClose={() => setViewModalOpen(false)}
              eventData={selectedEvent}
            />
          )}
        </Box>
      </LocalizationProvider>
    </>
  );
}
