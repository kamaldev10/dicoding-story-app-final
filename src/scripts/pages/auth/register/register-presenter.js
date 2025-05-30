import AuthApi from "../../../data/auth-api";

export default class RegisterPresenter {
  constructor(view) {
    this.view = view;
    this.model = new AuthApi();
  }

  validateField(field, value) {
    switch (field) {
      case "name":
        if (!value || value.trim().length < 2) {
          this.view.showError("name", "Nama minimal 2 karakter");
          return false;
        }
        break;
      case "email":
        if (!value) {
          this.view.showError("email", "Email wajib diisi");
          return false;
        } else if (!/^\S+@\S+\.\S+$/.test(value)) {
          this.view.showError("email", "Format email tidak valid");
          return false;
        }
        break;
      case "password":
        if (!value) {
          this.view.showError("password", "Password wajib diisi");
          return false;
        } else if (value.length < 8) {
          this.view.showError("password", "Password minimal 8 karakter");
          return false;
        }
        break;
    }
    return true;
  }

  validate({ name, email, password }) {
    let isValid = true;
    this.view.clearErrors();

    // Validate each field individually
    if (!this.validateField("name", name)) isValid = false;
    if (!this.validateField("email", email)) isValid = false;
    if (!this.validateField("password", password)) isValid = false;

    return isValid;
  }

  async register(formData) {
    const { name, email, password } = formData;

    if (!this.validate({ name, email, password })) return;

    this.view.setLoadingState(true);

    try {
      const result = await this.model.register({ name, email, password });

      if (result.error) {
        throw new Error(result.message || "Registrasi gagal.");
      }

      this.view.showSuccess();
      this.view.resetForm();
      this.view.redirectToLogin();
    } catch (err) {
      console.log(err.message);
      this.view.showRegisterError();
    } finally {
      this.view.setLoadingState(false);
    }
  }
}
