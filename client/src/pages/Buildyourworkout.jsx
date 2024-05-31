import React from "react";
import { useState } from "react";
const apiurl = "https://api-ninjas.com/api/exercises";

export default function buildyourowkworkout() {
  const [workout, setWorkout] = useState([]);

  async function Submission() {
    try {
      const options = await fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle}&difficulty=${difficulty}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        "X-Api-Key": "TAV8D89aex3FxVlNTvqVtA==DPoPSnNYBCrqU9ZY",
      });
      if (!response.ok) {
        throw new Error ("Network response not ok")
      };
      const exerciseList = await options.json();
      setWorkout(exerciseList);
    } catch (err) {
      res.status(500).send(err);
      console.log("Error message here", err);
    }
  }

  return(
     <div>workout builder let's see</div>
    )
}
