import { AlertComponent } from "./lib/alert.component";
import { DisclaimerService } from "./lib/disclaimer.service";
import "./style.css";

export function bootstrap(): void {
  customElements.define("app-alert", AlertComponent);
  DisclaimerService.showDisclaimer();
}
