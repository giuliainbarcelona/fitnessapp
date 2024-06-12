import React from "react";

export default function Homepage() {
  const paragraphs = [
    {
      title: "Personalized Workouts 🏋🏽‍♀️",
      content:
        "Never feel lost in the gym again. With our app, workouts are personalized to your goals. Select muscle group, difficulty, and exercise type for a custom workout, progressing at your own pace confidently.",
    },
    {
      title: "Convenient Scheduling 🗓️",
      content:
        "No excuses for missed workouts. Exercise on-the-go or schedule ahead. Choose a workout that fits your schedule and commit to your fitness journey. Our calendar feature helps you stay on track and prioritize health amidst a busy life.",
    },
    {
      title: "Motivation at Your Fingertips 💯",
      content:
        "Stay motivated with a dynamic progress bar. Watch your progress unfold as you complete exercises and celebrate achievements along the way. Every step of your fitness journey is worth celebrating with our app.",
    },
    {
      title: "Share Your Success 👯‍♀️",
      content:
        "Fitness is more fun with friends. Share workouts and achievements with your friends. Whether celebrating a personal record or spreading the joy of fitness, our app makes it simple to inspire and support others on their path to better health.",
    },
  ];

  const waitingForCard = {
    title: "Join our community now! 💪🏽",
    buttons: true,
  };

  return (
    <div className="container">
      <h1 className="page-title-less">
        <img src="/icon.svg" alt="Logo" style={{ height: "40px" }} /> Char &
        Giulia Fitness App{" "}
        <img src="/icon.svg" alt="Logo" style={{ height: "40px" }} />
      </h1>
      <br />
      <h3>Why you should choose us 😉</h3>
      <br />
      <div className="row row-cols-2">
        {paragraphs.map((paragraph, index) => (
          <div className="col mb-4" key={index}>
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">{paragraph.title}</h5>
                <p className="card-text">{paragraph.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row justify-content-center mt-4">
        <div className="col-md-6">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">{waitingForCard.title}</h5>
              <p className="card-text">{waitingForCard.content}</p>
              {waitingForCard.buttons && (
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => (window.location.href = "/login")}
                  >
                    Login
                  </button>
                  <span> or </span>
                  <button
                    className="btn btn-primary"
                    onClick={() => (window.location.href = "/register")}
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
