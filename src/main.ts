import { AlertComponent } from "./lib/alert.component";
import { DisclaimerService } from "./lib/disclaimer.service";
import "./style.css";

function bootstrap(): void {
  customElements.define("app-alert", AlertComponent);
  DisclaimerService.showDisclaimer();
}

window.addEventListener("load", () => {
  bootstrap();
});
