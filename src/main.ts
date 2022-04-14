import { AlertComponent } from "./lib/alert.component";
import { DisclaimerService } from "./lib/disclaimer.service";
import { ListComponent } from "./lib/list.component";
import { TaskComponent } from "./lib/task.component";
import "./style.css";

function bootstrap(): void {
  customElements.define("app-alert", AlertComponent);
  customElements.define("app-list", ListComponent);
  customElements.define("app-task", TaskComponent);
  DisclaimerService.showDisclaimer();
}

window.addEventListener("load", () => {
  bootstrap();
});
