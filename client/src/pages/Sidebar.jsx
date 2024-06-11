import React from "react";
import { formatDate } from "@fullcalendar/core";
import { Link } from "react-router-dom";

function Sidebar({ events, onDelete }) {
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
          onDelete();
        } else {
          console.error("Failed to delete workout:", response.statusText);
        }
      })
      .catch((err) => {
        console.error("Error deleting workout:", err);
      });
  }

  return (
    <div className="sidebar-container">
      <br />
      <h3 className="text-center">Summary for Current Month</h3>
      <br />

      <div className="d-flex justify-content-center flex-wrap">
        {events.map((event) => (
          <div key={event.id} className="col-md-3 mb-3">
            <div className="card" style={{ width: "18rem" }}>
              <div className="card-header">Your saved workout</div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  When:{" "}
                  {formatDate(event.start, { month: "long", day: "numeric" })}
                </li>
                <li className="list-group-item">What: {event.muscle}</li>
                <li className="list-group-item">
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(event.id)}
                  >
                    ❌{event.id}
                  </button>
                  <button className="exercise-btn">
                    <Link to={`/Exercises/${event.exerciseId}`}>🏋🏼‍♀️</Link>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
