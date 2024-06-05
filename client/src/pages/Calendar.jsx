import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";

export default function Calendar() {
  const [events, setEvents] = useState([]);
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
            console.log(exerciseData);

            workoutEvents.push({
              id: workout.id,
              title: `Workout ${workout.id}`,
              start: workout.date,
              end: workout.date,
              muscle: exerciseData[0].muscle,
            });
          }
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

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "prev,next,today",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        eventDidMount={(info) => {
          console.log(info);
          return new bootstrap.Popover(info.el, {
            title: info.event.title,
            placement: "auto",
            trigger: "hover",
            customClass: "popoverStyle",
            content: `Muscle: ${info.event.extendedProps.muscle}`,
            html: true,
            isDraggable: true,
            isDragging: true,
          });
        }}
      />
    </div>
  );
}
