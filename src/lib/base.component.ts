export class BaseComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  protected setStyles(css: string): void {
    if (!this.shadowRoot) {
      return;
    }

    const style = document.createElement("style");
    style.innerHTML = css;
    this.shadowRoot.appendChild(style);
  }

  protected setTemplate(templateId: string): void {
    if (!this.shadowRoot) {
      return;
    }

    const template = BaseComponent.getTemplateContents(templateId);
    if (!template) {
      return;
    }

    this.shadowRoot.appendChild(template.cloneNode(true));
  }

  protected static getTemplateContents(
    templateId: string
  ): DocumentFragment | null {
    const templateEl = document.getElementById(
      templateId
    ) as HTMLTemplateElement | null;

    if (!templateEl) {
      return null;
    }

    return templateEl.content;
  }
}
