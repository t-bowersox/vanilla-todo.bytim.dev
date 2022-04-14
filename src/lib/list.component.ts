import { BaseComponent } from "./base.component";
import { IndexedDBService } from "./indexeddb.service";
import css from "./list.component.css?raw";
import { TaskComponent } from "./task.component";
import { TaskInterface } from "./task.interface";
import { TasksService } from "./tasks.service";
import feather from "feather-icons";

export class ListComponent extends BaseComponent {
  private noTasksMsg =
    "Your task list is empty! Use the form above to add a new task to your list.";

  constructor() {
    super();
    this.setStyles(css);
    this.setTemplate("list-template");
    this.setTasksList();
    this.loadTasks();
    this.initForm();
    this.initAddButton();
    this.initCompleteListener();
  }

  private displayNoTasksMsg(text: string | null): void {
    if (!this.shadowRoot) {
      return;
    }

    const msg = this.shadowRoot.getElementById(
      "no-task-msg"
    ) as HTMLDivElement | null;

    if (!msg) {
      return;
    }

    msg.textContent = text;
  }

  private tasksService?: TasksService;
  private initTasksService(): void {
    const dbService = new IndexedDBService("todoList", 1, [
      {
        name: "todos",
        options: { keyPath: "id", autoIncrement: true },
        indexes: [{ name: "name", keyPath: "name" }],
      },
    ]);

    this.tasksService = new TasksService(dbService, "todos");
  }

  private initForm(): void {
    if (!this.shadowRoot) {
      return;
    }

    const form = this.shadowRoot.getElementById(
      "add-task-form"
    ) as HTMLFormElement | null;

    if (!form) {
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!this.tasksService) {
        return;
      }

      const taskInput = form.elements.namedItem(
        "task-name"
      ) as HTMLInputElement | null;

      if (!taskInput) {
        return;
      }

      const newTask: TaskInterface = {
        name: taskInput.value,
      };

      const taskId = await this.tasksService.addTask(newTask);

      if (!taskId) {
        return;
      }

      if (!this._tasks.length) {
        this.displayNoTasksMsg(null);
      }

      newTask.id = taskId;
      this._tasks.push(newTask);
      this.addTaskToList(newTask);
      taskInput.value = "";
    });
  }

  private initAddButton(): void {
    if (!this.shadowRoot) {
      return;
    }

    const button = this.shadowRoot.querySelector(
      ".task-add-btn"
    ) as HTMLButtonElement | null;

    if (!button) {
      return;
    }

    button.innerHTML = feather.icons.plus.toSvg({
      "aria-hidden": "true",
      "stroke-width": "3",
    });
  }

  private initCompleteListener(): void {
    this.addEventListener("taskComplete", async (event) => {
      const customEvent = event as CustomEvent<{ taskId: number }>;
      const taskId = customEvent.detail.taskId;
      if (!taskId) {
        return;
      }

      if (!this.tasksService) {
        return;
      }

      const deleted = await this.tasksService.deleteTask(taskId);
      if (!deleted) {
        return;
      }

      const taskIndex = this._tasks.findIndex((task) => task.id === taskId);
      this._tasks.splice(taskIndex, 1);
      this.deleteTaskFromList(taskId);

      if (!this._tasks.length) {
        this.displayNoTasksMsg(this.noTasksMsg);
      }
    });
  }

  private deleteTaskFromList(taskId: number): void {
    if (!this.shadowRoot) {
      return;
    }

    const tasks = this.shadowRoot.querySelectorAll<TaskComponent>("app-task");
    const tasksArray = Array.from(tasks);
    const taskToRemove = tasksArray.find(
      (task) => task.dataset.taskId == taskId.toString()
    );
    if (!taskToRemove) {
      return;
    }
    taskToRemove.remove();
  }

  private _tasks: TaskInterface[] = [];
  private async loadTasks(): Promise<void> {
    this.initTasksService();
    if (!this.tasksService) {
      return;
    }
    this._tasks = await this.tasksService.getAllTasks();
    this.renderTasks();
    if (!this._tasks.length) {
      this.displayNoTasksMsg(this.noTasksMsg);
    }
  }

  private tasksList: HTMLUListElement | null = null;
  private setTasksList(): void {
    if (!this.shadowRoot) {
      return;
    }

    this.tasksList = this.shadowRoot.getElementById(
      "list-tasks"
    ) as HTMLUListElement | null;
  }

  private renderTasks(): void {
    if (!this.tasksList) {
      return;
    }

    this._tasks.forEach((task) => this.addTaskToList(task));
  }

  private addTaskToList(task: TaskInterface): void {
    if (!this.tasksList) {
      return;
    }

    const item = document.createElement("app-task");
    item.innerText = task.name;
    item.dataset.taskId = `${task.id}`;
    this.tasksList.appendChild(item);
  }
}
