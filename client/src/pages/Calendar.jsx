import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useMemo } from "react";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import Sidebar from "../pages/Sidebar";

export default function Calendar({ userWorkouts, onDelete }) {
  const [curYear, setCurYear] = useState(null);
  const [curMonth, setCurMonth] = useState(null);

  const calendarEvents = useMemo(() => {
    if (!userWorkouts) return [];
    return userWorkouts.map((workout) => {
      const start = new Date(workout.date);
      start.setHours(9, 0, 0, 0); // Set start time to 9 AM
      const muscleName =
        workout.exercises.length > 0 ? workout.exercises[0].muscle : "Null";
      const exerciseId =
        workout.exercises.length > 0
          ? workout.exercises[0].exercise_id
          : "Null";
      return {
        id: workout.id,
        title: "Workout",
        start: start,
        end: new Date(start),
        muscle: muscleName,
        exerciseId: exerciseId,
      };
    });
  }, [userWorkouts]);

  const monthEvents = useMemo(() => {
    return calendarEvents.filter(
      (event) =>
        new Date(event.start).getFullYear() === curYear &&
        new Date(event.start).getMonth() === curMonth
    );
  }, [calendarEvents, curYear, curMonth]);

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
      if (!response.ok) {
        console.error("Failed to update event:", response.statusText);
      }
    } catch (err) {
      console.error("Error updating event:", err);
    }
  };

  const handleEventChange = (changeInfo) => {
    const start = new Date(changeInfo.event.start);
    start.setHours(9, 0, 0, 0); // Ensure the start time is 9 AM
    const updatedEvent = {
      ...changeInfo.event.extendedProps,
      id: changeInfo.event.id,
      title: changeInfo.event.title,
      start: start.toISOString(),
    };
    updateEvent(updatedEvent);
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            editable
            headerToolbar={{
              start: "prev,next,today",
              center: "title",
              end: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            height="70vh"
            events={calendarEvents}
            eventDidMount={(info) => {
              new bootstrap.Popover(info.el, {
                title: `Your ${info.event.extendedProps.muscle} workout`,
                placement: "auto",
                trigger: "hover",
                customClass: "popoverStyle",
              });
            }}
            eventChange={handleEventChange}
            datesSet={handleMonthChange}
          />
        </div>
        <div className="col-md-10 mt-4">
          <Sidebar events={monthEvents} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
}
