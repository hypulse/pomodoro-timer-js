import TimerPlugin from "./TimerPlugin.js";

class TaskManager extends TimerPlugin {
  constructor(
    /**
     * @type {typeof {
     * id: number;
     * name: string;
     * cycle: number;
     * completed: boolean;
     * }[]}
     */
    tasks = [],
    timer
  ) {
    super(timer);
    this.tasks = tasks;
  }

  addTask(task) {
    this.tasks.push(task);
  }

  removeTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  addCycle(id) {
    this.tasks = this.tasks.map((task) => {
      if (task.id === id) {
        task.cycle++;
      }
      return task;
    });
  }

  completeTask(id) {
    this.tasks = this.tasks.map((task) => {
      if (task.id === id) {
        task.completed = true;
      }
      return task;
    });
  }

  uncompleteTask(id) {
    this.tasks = this.tasks.map((task) => {
      if (task.id === id) {
        task.completed = false;
      }
      return task;
    });
  }
}

export default TaskManager;
