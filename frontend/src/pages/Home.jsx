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
  const [eventData, setEventData] = useState(null);
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

  const filterEventsByDate = (date) => {
    const selectedDate = new Date(date);
    const selectedDateToString = selectedDate.toDateString();
    selectedDate.setHours(0, 0, 0, 0);
    return eventData?.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return (
        selectedDateToString === eventStart.toDateString() ||
        selectedDateToString === eventEnd.toDateString() ||
        (selectedDate >= eventStart && selectedDate <= eventEnd)
      );
    });
  };

  const filterEventsByViewType = (type) => {
    const now = new Date();

    if (type === "thisWeek") {
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));

      return eventData?.filter((event) => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
        return (
          (eventStart >= startOfWeek && eventStart <= endOfWeek) ||
          (eventEnd >= startOfWeek && eventEnd <= endOfWeek) ||
          (eventStart <= startOfWeek && eventEnd >= endOfWeek)
        );
      });
    } else if (type === "thisMonth") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      return eventData?.filter((event) => {
        const eventStart = new Date(event.startTime);
        const eventEnd = new Date(event.endTime);
        return (
          (eventStart >= startOfMonth && eventStart <= endOfMonth) ||
          (eventEnd >= startOfMonth && eventEnd <= endOfMonth) ||
          (eventStart <= startOfMonth && eventEnd >= endOfMonth)
        );
      });
    }
  };

  const deleteHandler = async (eventId) => {
    try {
      const token = await currentUser?.getIdToken(true);
      const response = await fetch(
        `${apiUrl}/events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

  const fetchAllEventsData = async () => {
    try {
      const token = await currentUser?.getIdToken(true);

      const response = await fetch(`${apiUrl}/events`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      setEventData(data);
    } catch (error) {
      toast.error("Error fetching events!");
    }
  };

  useEffect(() => {
    setFilteredEventsByDate(filterEventsByDate(selectedDate));
  }, [eventData, selectedDate]);

  useEffect(() => {
    fetchAllEventsData();
  }, [fetchFlag]);

  const handleViewTypeChange = (event) => {
    const type = event.target.value;
    setViewType(type);
  };

  useEffect(() => {
    const filtered = filterEventsByViewType(viewType);
    setFilteredEventsByWeekOrMonth(filtered);
  }, [eventData, viewType]);

   if(!userLoggedIn){
    navigate("/login")
  }
  
  // if (!eventData) {
  //   return (
  //     <Box
  //       sx={{
  //         height: "100vh",
  //         width: "100vw",
  //         display: "flex",
  //         flexDirection: "row",
  //         justifyContent: "center",
  //         alignItems: "center",
  //       }}
  //     >
  //       <Typography variant="h5">Loading...</Typography>
  //     </Box>
  //   );
  // }
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
                User: {currentUser.email}
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

              <Box sx={{ marginTop: 2 }}>
                {filteredEventsByWeekOrMonth?.length > 0 ? (
                  filteredEventsByWeekOrMonth?.map((event) => {
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
                    return (
                      <Box
                        key={event.id}
                        sx={{ padding: 2, borderBottom: "1px solid #ccc" }}
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
            {filteredEventsByDate?.length > 0 ? (
              filteredEventsByDate?.map((event) => {
                const startTimeofEvent = formatDateString(
                  event.startTime.toString().trim()
                );
                const endTimeofEvent = formatDateString(
                  event.endTime.toString().trim()
                );
                return (
                  <Box
                    key={event.id}
                    sx={{ padding: 2, borderBottom: "1px solid #ccc" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { md: "row", xs: "column" },
                        justifyContent: "space-between",
                        alignItems: { md: "center", xs: "flex-start" },
                      }}
                    >
                      <Typography sx={{ fontSize: { md: "20px", xs: "17px" } }}>
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
                      <Typography sx={{ fontSize: { md: "17px", xs: "15px" } }}>
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
