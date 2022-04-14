export class DisclaimerService {
  private static setHideDisclaimerToggle(): void {
    const disclaimer = document.getElementById("disclaimer");
    if (!disclaimer) {
      return;
    }

    const dismissBtn =
      disclaimer.shadowRoot?.querySelector(".alert-dismiss-btn");
    if (!dismissBtn) {
      return;
    }

    dismissBtn.addEventListener("click", () => {
      window.localStorage.setItem("hideDisclaimer", "true");
    });
  }

  public static showDisclaimer(): void {
    const disclaimer = document.getElementById("disclaimer");
    if (!disclaimer) {
      return;
    }

    if (window.localStorage.getItem("hideDisclaimer") === "true") {
      disclaimer.remove();
      return;
    }

    disclaimer.classList.remove("hidden");
    this.setHideDisclaimerToggle();
  }
}
