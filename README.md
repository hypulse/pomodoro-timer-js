# Pomodoro Timer Component

A prototype for a class-based Pomodoro timer widget built with vanilla JavaScript. This is a personal example to explore better widget structure.

## Deisgn Considerations

- **Dynamic State Updates**: Utilizes JavaScript Proxy for state management, allowing for reactive updates to the user interface as the timer state changes.
- **Modular Design**: Encapsulated in a class, making it easy to instantiate multiple timer instances on a single page with independent configurations.
- **Event-Driven Interactions**: The component employs an event-driven architecture for handling user interactions, decoupling the UI logic from the application logic. This approach simplifies the addition of new features and maintenance, as the core functionality is not tightly coupled with event handling.

## Usage

```javascript
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
```

## To Do

- [ ] Apply scoped CSS styles to each instance
- [ ] Add plugin support
- [ ] Define a Widget class
