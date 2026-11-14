import { initPublicPage } from "../../../main";
import { loginUser } from "../../../utils/auth";
import { getElement } from "../../../utils/dom";
import { navigate } from "../../../utils/navigate";
import { homeForRole } from "../../../utils/routes";
import "../../../styles/auth.css";

const form = getElement<HTMLFormElement>("form-login");
const inputEmail = getElement<HTMLInputElement>("email");
const inputPassword = getElement<HTMLInputElement>("password");
const message = getElement<HTMLParagraphElement>("form-message");
const submitButton =
  form?.querySelector<HTMLButtonElement>('button[type="submit"]') ?? null;

const showMessage = (text: string, variant: "error" | "exito"): void => {
  if (!message) {
    return;
  }
  message.textContent = text;
  message.className = `mensaje mensaje--${variant}`;
  message.hidden = false;
};

// Si ya hay una sesión válida, redirige según su rol.
const session = initPublicPage();

if (!session && form && inputEmail && inputPassword && message) {
  const emailInput = inputEmail;
  const passwordInput = inputPassword;
  const messageElement = message;

  const setBusy = (busy: boolean): void => {
    if (submitButton) {
      submitButton.disabled = busy;
    }
  };

  form.addEventListener("submit", (event: SubmitEvent) => {
    event.preventDefault();
    messageElement.hidden = true;
    setBusy(true);

    void (async () => {
      const result = await loginUser(emailInput.value, passwordInput.value);
      setBusy(false);

      if (!result.ok) {
        showMessage(result.error, "error");
        return;
      }

      showMessage("Sesión iniciada. Redirigiendo…", "exito");
      // El rol proviene de la cuenta almacenada, nunca del formulario.
      navigate(homeForRole(result.data.role));
    })();
  });
}
