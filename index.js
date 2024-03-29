import TaskManager from "./TaskManager.js";
import Timer from "./Timer.js";

const html = `
<div class="timer-display"></div>
<div class="timer-cycle"><span class="timer-cycle__count"></span></div>
<div class="timer-tabs">
  <button type="button" class="timer-tab timer-tab--pomodoro">Pomodoro</button>
  <button type="button" class="timer-tab timer-tab--short-break">Short Break</button>
  <button type="button" class="timer-tab timer-tab--long-break">Long Break</button>
</div>
<div class="timer-controls">
  <button type="button" class="timer-control timer-control--skip" disabled>Skip</button>
  <button type="button" class="timer-control timer-control--start">Start</button>
</div>
`;

const css = `
.timer-tab.active {
  font-weight: bold;
}
`;

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  const timer = new Timer("timer", html, css);
  const taskManager = new TaskManager([], timer);
  timer.registerPlugin(taskManager);
  app.appendChild(timer.element);

  const timer2 = new Timer(
    "timer2",
    `<div class="timer-display"></div><button type="button" class="timer-control timer-control--start">Start</button>`,
    null,
    {
      isRunning: true,
    }
  );
  app.appendChild(timer2.element);
});
