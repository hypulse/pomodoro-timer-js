class TimerPlugin {
  constructor(
    /**
     * @type {import("./Timer.js").default}
     */
    timer
  ) {
    this.timer = timer;
  }

  activate() {}

  deactivate() {}

  onEvent(eventName) {}
}

export default TimerPlugin;
