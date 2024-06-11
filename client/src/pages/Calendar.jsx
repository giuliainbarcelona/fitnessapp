import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect, useMemo } from "react";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import Sidebar from "../pages/Sidebar";

export default function Calendar({ userWorkouts }) {
  // const [userWorkouts, setUserWorkouts] = useState([]);
  const [sentWorkouts, setSentWorkouts] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]); // Stores formatted event data
  const [curYear, setCurYear] = useState(null); // Year for filtering events
  const [curMonth, setCurMonth] = useState(null); // Month for filtering events

  const monthEvents = useMemo(() => {
    return calendarEvents.filter((event) => {
      return (
        new Date(event.start).getFullYear() === curYear &&
        new Date(event.start).getMonth() === curMonth
      );
    });
  }, [calendarEvents, curMonth, curYear]);
  // console.log("These is my events", calendarEvents);


  // Fetches all workouts data from the backend on component mount.
  useEffect(() => {
    async function fetchAllWorkouts() {
      try {
        const response = await fetch("/api/workouts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        if (response.ok) {
          const data = await response.json();
          // console.log("Fetched all workouts:", data);
          setWorkouts(data);
        } else {
          console.error("Failed to fetch workouts:", response.statusText);
        }
      } catch (err) {
        console.error("Error fetching workouts:", err);
      }
    }

    fetchAllWorkouts();
  }, []);


  // Fetch workout details by ID
  // Fetches detailed workout data when the workouts state updates.
  useEffect(() => {
    async function fetchWorkoutDetails() {
      if (userWorkouts.length === 0) return; // Skip if no workouts

      const workoutEvents = [];
      for (const workout of userWorkouts) {
        try {
          const response = await fetch(`/api/workouts/${workout.id}`);
          if (response.ok) {
            const exerciseData = await response.json();
            const firstMuscle = exerciseData[0].exercises[0].muscle;
            const exerciseId = exerciseData[0].exercises[0].exercise_id; // This is my exercise id that I need

            workoutEvents.push({
              id: workout.id,
              title: "Workout",
              start: new Date(new Date(workout.date).setHours(9, 0, 0, 0)),
              end: new Date(new Date(workout.date).setHours(9, 0, 0, 0)),
              muscle: firstMuscle,
              exerciseId: exerciseId, // Add exerciseId to the event object
            });
          } else {
            console.error(
              "Failed to fetch workout details:",
              response.statusText
            );
          }
        } catch (err) {
          console.error("Error fetching workout details:", err);
        }
      }
      setCalendarEvents(workoutEvents);
      // console.log("All workout events set:", workoutEvents); // muscle is still undefined.
    }

    fetchWorkoutDetails();
  }, [userWorkouts]);

  // Filter events for the current month.
  // Gives you back an array of the events that are planned for the month!
  const handleMonthChange = (viewInfo) => {
    setCurYear(viewInfo.view.currentStart.getFullYear());
    setCurMonth(viewInfo.view.currentStart.getMonth());
  };

  const updateEvent = async (updatedEvent) => {
    const formattedDate = new Date(updatedEvent.start)
      .toISOString()
      .split("T")[0];
    try {
      const response = await fetch(`/api/workouts/${updatedEvent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ date: formattedDate }),
      });
      // Gives you back an array with the event
      // console.log("This is my updatedEvent", updatedEvent);
      if (response.ok) {
        // console.log("Event updated successfully");
      } else {
        console.error("Failed to update event:", response.statusText);
      }
    } catch (err) {
      console.error("Error updating event:", err);
    }
  };

  // Handles the event change (drag and drop) and updates the state and serve
  const handleEventChange = (changeInfo) => {
    const start = new Date(changeInfo.event.start);
    start.setHours(9, 0, 0, 0);

    const end = changeInfo.event.end ? new Date(changeInfo.event.end) : null;
    if (end) {
      end.setHours(9, 0, 0, 0);
    }

    const updatedEvent = {
      ...changeInfo.event.extendedProps,
      id: changeInfo.event.id,
      title: changeInfo.event.title,
      start: start.toISOString(),
    };
    updateEvent(updatedEvent);
    setCalendarEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  return (
    <div className="container-fluid">
      <br />
      <br />
      <div className="row justify-content-center">
        <div className="col-md-10">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={"dayGridMonth"}
            editable={true}
            headerToolbar={{
              start: "prev,next,today",
              center: "title",
              end: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            height={"70vh"}
            events={calendarEvents}
            eventDidMount={(info) => {
              // console.log("Event did mount:", info.event.extendedProps);
              return new bootstrap.Popover(info.el, {
                title: `Your ${info.event.extendedProps.muscle} workout`, // Access extendedProps for muscle, need to work here!!
                placement: "auto",
                trigger: "hover",
                customClass: "popoverStyle",
              });
            }}
            eventChange={handleEventChange}
            datesSet={handleMonthChange}
          />
        </div>

        <div className="row justify-content-center">
          <div className="col-md-10 mt-4">
            <Sidebar
              events={monthEvents}
              setCalendarEvents={setCalendarEvents}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
