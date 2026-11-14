import { initPublicPage } from "../../../main";
import { registerUser } from "../../../utils/auth";
import { getElement } from "../../../utils/dom";
import { navigate } from "../../../utils/navigate";
import { ROUTES } from "../../../utils/routes";
import "../../../styles/auth.css";

const form = getElement<HTMLFormElement>("form-registro");
const inputNombre = getElement<HTMLInputElement>("nombre");
const inputApellido = getElement<HTMLInputElement>("apellido");
const inputEmail = getElement<HTMLInputElement>("email");
const inputPassword = getElement<HTMLInputElement>("password");
const inputConfirm = getElement<HTMLInputElement>("confirm-password");
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

const session = initPublicPage();

if (
  !session &&
  form &&
  inputNombre &&
  inputApellido &&
  inputEmail &&
  inputPassword &&
  inputConfirm &&
  message
) {
  const nombreInput = inputNombre;
  const apellidoInput = inputApellido;
  const emailInput = inputEmail;
  const passwordInput = inputPassword;
  const confirmInput = inputConfirm;
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
      const result = await registerUser({
        nombre: nombreInput.value,
        apellido: apellidoInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        confirmPassword: confirmInput.value,
      });

      if (!result.ok) {
        setBusy(false);
        showMessage(result.error, "error");
        return;
      }

      showMessage("Cuenta creada con éxito. Redirigiendo al login…", "exito");
      window.setTimeout(() => {
        navigate(ROUTES.login);
      }, 1500);
    })();
  });
}
