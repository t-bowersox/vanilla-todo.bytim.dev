import feather from "feather-icons";

export class AlertComponent extends HTMLElement {
  private readonly type: AlertType;
  private readonly heading: string;

  constructor() {
    super();

    this.type = <AlertType>this.dataset.type ?? "info";
    this.heading = this.dataset.heading ?? "Alert";

    this.attachShadow({ mode: "open" });
    this.setStyles();
    this.setTemplate();
    this.setAlertClass();
    this.setHeadingText();
    this.initDismissButton();
  }

  private dismiss(): void {
    this.remove();
  }

  private setStyles(): void {
    if (!this.shadowRoot) {
      return;
    }

    const styles = document.createElement("link");
    styles.rel = "stylesheet";
    styles.href = "./src/lib/alert.component.css";
    this.shadowRoot.appendChild(styles);
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

  private setTemplate(): void {
    if (!this.shadowRoot) {
      return;
    }

    const template = AlertComponent.getTemplateContents();
    if (!template) {
      return;
    }

    this.shadowRoot.appendChild(template.cloneNode(true));
  }

  private static getTemplateContents(): DocumentFragment | null {
    const templateEl = document.getElementById(
      "alert-template"
    ) as HTMLTemplateElement | null;

    if (!templateEl) {
      return null;
    }

    return templateEl.content;
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
