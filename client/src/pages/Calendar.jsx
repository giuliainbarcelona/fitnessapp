import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { formatDate } from "@fullcalendar/core";
import { useState, useEffect, useMemo } from "react";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [curYear, setCurYear] = useState(null);
  const [curMonth, setCurMonth] = useState(null);

  const monthEvents = useMemo(() => {
    return events.filter((event) => {
      return (
        new Date(event.start).getFullYear() === curYear &&
        new Date(event.start).getMonth() === curMonth
      );
    });
  }, [events, curMonth, curYear]);

  useEffect(() => {
    async function fetchWorkout() {
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
          console.log("Fetched workout:", data);

          const workoutEvents = [];
          for (const workout of data) {
            const exerciseResponse = await fetch(`/api/workouts/${workout.id}`);
            const exerciseData = await exerciseResponse.json();
            // Gives you back the exercise array - exercises with exercise nested loop
            // console.log("This is the exercise data:", exerciseData);

            const muscles = [];
            for (const workout of exerciseData) {
              for (const exercise of workout.exercises) {
                muscles.push(exercise.muscle);
              }
            }
            const firstMuscle = muscles[0]; // Accessing the first muscle in the array

            workoutEvents.push({
              id: workout.id,
              title: "Workout",
              start: new Date(new Date(workout.date).setHours(9, 0, 0, 0)), // Set time to 9 AM
              end: new Date(new Date(workout.date).setHours(9, 0, 0, 0)), // Set time to 9 AM
              muscle: firstMuscle,
            });
          }
          // Gives you back ALL the workoutsin the calendar
          console.log("This the workout events:", workoutEvents);
          setEvents(workoutEvents);
        } else {
          console.error("Failed to fetch workout event:", response.statusText);
        }
      } catch (err) {
        console.error("Error fetching workouts:", err);
      }
    }

    fetchWorkout();
  }, []);

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
    setEvents((prevEvents) =>
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
            events={events}
            eventDidMount={(info) => {
              return new bootstrap.Popover(info.el, {
                title: `Your ${info.event.extendedProps.muscle} workout`,
                placement: "auto",
                trigger: "hover",
                customClass: "popoverStyle",
                // content: `Muscle : ${info.event.extendedProps.muscle}`,
              });
            }}
            eventChange={handleEventChange}
            datesSet={handleMonthChange}
          />
        </div>
        <div className="col-md-3">
          <Sidebar events={monthEvents} />
        </div>
      </div>
    </div>
  );
}

function Sidebar({ events }) {
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
                <button className="delete-btn">❌</button>
                <br />
                <br />

                <button className="exercise-btn">🏋🏼‍♀️</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
