import AuthApi from "../../../data/auth-api";
import toastr from "toastr";

export class LoginPresenter {
  constructor(view) {
    this.view = view;
    this.model = new AuthApi();
  }

  validate(email, password) {
    let isValid = true;
    this.view.clearErrors();

    if (!email) {
      this.view.showError("email", "Email wajib diisi");
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      this.view.showError("email", "Format email tidak valid");
      isValid = false;
    }

    if (!password) {
      this.view.showError("password", "Password wajib diisi");
      isValid = false;
    } else if (password.length < 6) {
      this.view.showError("password", "Password minimal 6 karakter");
      isValid = false;
    }

    return isValid;
  }

  async login(email, password) {
    if (!this.validate(email, password)) return;

    this.view.setLoadingState(true);

    try {
      const result = await this.model.login({ email, password });

      if (result.error) {
        throw new Error(result.message || "Login gagal.");
      }

      this.view.redirectToHome();
      toastr.success("login berhasil");
    } catch (error) {
      this.view.showLoginError(error.message);
      toastr.warning("Login gagal");
    } finally {
      this.view.setLoadingState(false);
    }
  }
}
