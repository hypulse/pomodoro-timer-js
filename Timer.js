const defaultOptions = {
  pomodoroTime: 25 * 60,
  shortBreakTime: 5 * 60,
  longBreakTime: 15 * 60,
  longBreakInterval: 4,
  /**
   * @type {"pomodoro" | "shortBreak" | "longBreak"}
   */
  currentTab: "pomodoro",
  currentTimer: 25 * 60,
  cycle: 1,
  isRunning: false,
};

class Timer {
  constructor(
    id,
    html,
    css,
    /**
     * @type {typeof defaultOptions}
     */
    options = {}
  ) {
    this.initElement(id, html, css);

    const handler = {
      set: (target, prop, receiver) => {
        const prevValue = Reflect.get(target, prop, receiver);

        this.updateDisplay({
          property: prop,
          value: receiver,
          prevValue,
        });

        return Reflect.set(target, prop, receiver);
      },
    };

    /**
     * @type {typeof defaultOptions}
     */
    this._state = new Proxy({}, handler);

    this.timer = null;

    this.plugins = [];

    this.init(options);
  }

  initElement(id, html, css) {
    this.element = document.createElement("div");
    this.element.id = id;
    this.element.innerHTML = html;

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    this.timerDisplay = this.element.querySelector(".timer-display");
    this.timerCycle = this.element.querySelector(".timer-cycle");
    this.timerCycleCount = this.element.querySelector(".timer-cycle__count");
    this.timerTabs = this.element.querySelector(".timer-tabs");
    this.pomodoroTab = this.element.querySelector(".timer-tab--pomodoro");
    this.shortBreakTab = this.element.querySelector(".timer-tab--short-break");
    this.longBreakTab = this.element.querySelector(".timer-tab--long-break");
    this.timerControls = this.element.querySelector(".timer-controls");
    this.skipControl = this.element.querySelector(".timer-control--skip");
    this.startControl = this.element.querySelector(".timer-control--start");

    this.pomodoroTab?.addEventListener("click", () => {
      this.changeMode("pomodoro");
    });
    this.shortBreakTab?.addEventListener("click", () => {
      this.changeMode("shortBreak");
    });
    this.longBreakTab?.addEventListener("click", () => {
      this.changeMode("longBreak");
    });
    this.skipControl?.addEventListener("click", () => {
      this._state.currentTab === "pomodoro"
        ? this.endPomodoro()
        : this.endBreak();
    });
    this.startControl?.addEventListener("click", () => {
      this._state.isRunning ? this.pauseTimer() : this.startTimer();
    });
  }

  init(options) {
    Object.assign(this._state, defaultOptions, options);

    if (this._state.isRunning) {
      this.startTimer();
    }
  }

  updateDisplay({ property, value, prevValue }) {
    switch (property) {
      case "currentTab":
        this.pomodoroTab?.classList.toggle("active", value === "pomodoro");
        this.shortBreakTab?.classList.toggle("active", value === "shortBreak");
        this.longBreakTab?.classList.toggle("active", value === "longBreak");
        var cycle =
          value === "pomodoro" ? this._state.cycle : this._state.cycle - 1;
        if (this.timerCycleCount) {
          this.timerCycleCount.textContent = `#${cycle || 1}`;
        }
        break;
      case "currentTimer":
        var minutes = Math.floor(value / 60);
        var seconds = value % 60;
        this.timerDisplay.textContent = `${minutes}:${seconds
          .toString()
          .padStart(2, "0")}`;
        break;
      case "isRunning":
        if (this.startControl) {
          this.startControl.textContent = value ? "Pause" : "Start";
        }
        if (this.skipControl) {
          this.skipControl.disabled = !value;
        }
        break;
    }
  }

  startTimer() {
    this._state.isRunning = true;

    this.timer = setInterval(() => {
      this._state.currentTimer--;

      if (this._state.currentTimer <= 0) {
        this._state.isRunning = false;

        if (this._state.currentTab === "pomodoro") {
          this.endPomodoro();
        } else {
          this.endBreak();
        }
      }
    }, 1000);

    this.notifyPlugins("TIMER_START");
  }

  pauseTimer() {
    this._state.isRunning = false;

    clearInterval(this.timer);

    this.notifyPlugins("TIMER_PAUSE");
  }

  changeMode(mode) {
    this.pauseTimer();
    this._state.currentTab = mode;
    this._state.currentTimer = this._state[`${mode}Time`];

    this.notifyPlugins("TIMER_STOP");
  }

  endBreak() {
    this.changeMode("pomodoro");

    this.notifyPlugins("TIMER_END_BREAK");
  }

  endPomodoro() {
    const isLongBreak = this._state.cycle % this._state.longBreakInterval === 0;
    this._state.cycle++;
    isLongBreak ? this.changeMode("longBreak") : this.changeMode("shortBreak");

    this.notifyPlugins("TIMER_END_POMODORO");
  }

  registerPlugin(plugin) {
    this.plugins.push(plugin);
    plugin.activate();
  }

  unregisterPlugin(plugin) {
    const index = this.plugins.indexOf(plugin);
    if (index > -1) {
      this.plugins[index].deactivate();
      this.plugins.splice(index, 1);
    }
  }

  notifyPlugins(
    /**
     * @type {"TIMER_START" | "TIMER_PAUSE" | "TIMER_STOP" | "TIMER_END_POMODORO" | "TIMER_END_BREAK"}
     */
    eventName
  ) {
    this.plugins.forEach((plugin) => {
      plugin.onEvent(eventName);
    });
  }
}

export default Timer;
