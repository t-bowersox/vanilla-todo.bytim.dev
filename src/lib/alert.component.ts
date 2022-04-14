import feather from "feather-icons";
import css from "./alert.component.css?raw";
import { BaseComponent } from "./base.component";

export class AlertComponent extends BaseComponent {
  private readonly type: AlertType;
  private readonly heading: string;

  constructor() {
    super();

    this.type = <AlertType>this.dataset.type ?? "info";
    this.heading = this.dataset.heading ?? "Alert";

    this.setStyles(css);
    this.setTemplate("alert-template");
    this.setAlertClass();
    this.setHeadingText();
    this.initDismissButton();
  }

  private dismiss(): void {
    this.remove();
  }

  private setAlertClass(): void {
    if (!this.shadowRoot) {
      return;
    }

    const alertContainer = this.shadowRoot.querySelector(
      ".alert"
    ) as HTMLDivElement;
    alertContainer.classList.add(this.type);
  }

  private setHeadingText(): void {
    if (!this.shadowRoot) {
      return;
    }

    const heading = this.shadowRoot.querySelector(
      ".alert-heading"
    ) as HTMLDivElement | null;

    if (!heading) {
      return;
    }

    heading.innerText = this.heading;
  }

  private initDismissButton(): void {
    if (!this.shadowRoot) {
      return;
    }

    const button = this.shadowRoot.querySelector(
      ".alert-dismiss-btn"
    ) as HTMLButtonElement | null;

    if (!button) {
      return;
    }

    button.innerHTML = feather.icons.x.toSvg({ "aria-hidden": "true" });
    button.addEventListener("click", () => this.dismiss());
  }
}

type AlertType = "info" | "success" | "warning" | "danger";
