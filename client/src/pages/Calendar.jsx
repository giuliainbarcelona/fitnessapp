import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { formatDate } from "@fullcalendar/core";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";

export default function Calendar() {
  const [workouts, setWorkouts] = useState([]); // Stores all workouts data
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
          console.log("Fetched all workouts:", data);
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
  useEffect(() => {
    async function fetchWorkoutDetails() {
      if (workouts.length === 0) return; // Skip if no workouts

      const workoutEvents = [];
      for (const workout of workouts) {
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
      console.log("All workout events set:", workoutEvents); // muscle is still undefined.
    }

    fetchWorkoutDetails();
  }, [workouts]);

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
      console.log("This is my updatedEvent", updatedEvent);
      if (response.ok) {
        console.log("Event updated successfully");
      } else {
        console.error("Failed to update event:", response.statusText);
      }
    } catch (err) {
      console.error("Error updating event:", err);
    }
  };

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
      <div className="row">
        <div className="col-md-9">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={"dayGridMonth"}
            editable={true}
            headerToolbar={{
              start: "prev,next,today",
              center: "title",
              end: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            height={"80vh"}
            events={calendarEvents}
            eventDidMount={(info) => {
              console.log("Event did mount:", info.event.extendedProps);
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
        <div className="col-md-3">
          <Sidebar events={monthEvents} setCalendarEvents={setCalendarEvents} />
        </div>
      </div>
    </div>
  );
}

function Sidebar({ events, setCalendarEvents }) {
  function handleDelete(eventId) {
    fetch(`/api/workouts/${eventId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Workout deleted successfully!");
          setCalendarEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== eventId)
          );
        } else {
          console.error("Failed to delete workout:", response.statusText);
        }
      })
      .catch((err) => {
        console.error("Error deleting workout:", err);
      });
  }

  return (
    <div className="sidebar">
      <br />
      <h3>Summary for Current Month</h3>
      <div className="row">
        {events.map((event) => (
          <div key={event.id} className="col-sm-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  {formatDate(event.start, { month: "short", day: "numeric" })}
                </h5>
                <p className="card-text">{event.muscle}</p>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(event.id)}
                >
                  ❌
                </button>
                <br />
                <br />
                <button className="exercise-btn">
                  <Link to={`/Exercises/${event.exerciseId}`}>🏋🏼‍♀️</Link>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
