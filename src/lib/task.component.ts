import { BaseComponent } from "./base.component";
import css from "./task.component.css?raw";
import feather from "feather-icons";

export class TaskComponent extends BaseComponent {
  constructor() {
    super();
    this.setTemplate("task-template");
    this.setStyles(css);
  }

  private _taskId = "";
  get taskId(): number {
    return Number(this._taskId);
  }

  connectedCallback(): void {
    this._taskId = this.dataset.taskId ?? "";
    this._taskName = this.textContent ?? "";
    this.initButton();
  }

  private initButton(): void {
    if (!this.shadowRoot) {
      return;
    }

    const button = this.shadowRoot.getElementById(
      "complete-task"
    ) as HTMLButtonElement | null;
    if (!button) {
      return;
    }

    button.innerHTML = feather.icons.check.toSvg({ "aria-hidden": "true" });
    button.ariaLabel = `Mark task '${this.taskName}' as completed`;

    button.addEventListener("click", () => {
      const completeEvent = new CustomEvent("taskComplete", {
        bubbles: true,
        composed: true,
        detail: { taskId: this.taskId },
      });
      this.dispatchEvent(completeEvent);
    });
  }

  private _taskName = "";
  get taskName(): string {
    return this._taskName;
  }
}
