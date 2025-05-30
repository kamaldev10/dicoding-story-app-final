import RegisterPresenter from "./register-presenter";

const RegisterPage = {
  async render() {
    return `
      <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-teal-500">
        <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h1 class="text-2xl font-bold text-center mb-6">Daftar</h1>
          <form id="registerForm" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium">Nama</label>
              <input id="name" type="text" class="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-green-300" />
              <p class="text-sm text-red-600 mt-1 hidden" id="error-name"></p>
            </div>
            <div>
              <label for="email" class="block text-sm font-medium">Email</label>
              <input id="email" type="email" class="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-green-300" unique />
              <p class="text-sm text-red-600 mt-1 hidden" id="error-email"></p>
            </div>
            <div>
              <label for="password" class="block text-sm font-medium">Password</label>
              <div class="relative">
                <input id="password" type="password" class="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-green-300" />
                <button aria-labelledby="visibility-button" type="button" id="togglePassword" class="absolute inset-y-0  right-0  flex items-center px-3 text-gray-600">
                  <svg id="eyeIcon" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg id="eyeSlashIcon" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <p class="text-sm text-red-600 mt-1 hidden" id="error-password"></p>
            </div>
            <button type="submit" id="submit-btn" class="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700">Daftar</button>
            <p class="text-sm text-center mt-2">Sudah punya akun? <a href="#/login" class="text-green-600">Login</a></p>
          
          </form>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const presenter = new RegisterPresenter(this);
    const form = document.querySelector("#registerForm");
    const nameInput = document.querySelector("#name");
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");

    // Add real-time validation for each input field
    nameInput.addEventListener("input", () => {
      this.clearError("name");
      presenter.validateField("name", nameInput.value);
    });

    emailInput.addEventListener("input", () => {
      this.clearError("email");
      presenter.validateField("email", emailInput.value);
    });

    passwordInput.addEventListener("input", () => {
      this.clearError("password");
      presenter.validateField("password", passwordInput.value);
    });

    // Focus out validation
    nameInput.addEventListener("blur", () => {
      presenter.validateField("name", nameInput.value);
    });

    emailInput.addEventListener("blur", () => {
      presenter.validateField("email", emailInput.value);
    });

    passwordInput.addEventListener("blur", () => {
      presenter.validateField("password", passwordInput.value);
    });

    // Toggle password visibility
    const togglePasswordBtn = document.querySelector("#togglePassword");
    const eyeIcon = document.querySelector("#eyeIcon");
    const eyeSlashIcon = document.querySelector("#eyeSlashIcon");

    togglePasswordBtn.addEventListener("click", () => {
      // Toggle password visibility
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.classList.add("hidden");
        eyeSlashIcon.classList.remove("hidden");
      } else {
        passwordInput.type = "password";
        eyeIcon.classList.remove("hidden");
        eyeSlashIcon.classList.add("hidden");
      }
      // Focus back on password input
      passwordInput.focus();
    });

    // Form submission
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = {
        name: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
      };

      presenter.register(formData);
    });
  },

  clearError(field) {
    const errorEl = document.querySelector(`#error-${field}`);
    errorEl.classList.add("hidden");
  },

  clearErrors() {
    ["name", "email", "password"].forEach((field) => {
      this.clearError(field);
    });
  },

  showError(field, message) {
    const errorEl = document.querySelector(`#error-${field}`);
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
  },

  setLoadingState(isLoading) {
    const submitBtn = document.getElementById("submit-btn");
    if (submitBtn) {
      submitBtn.disabled = isLoading;
      submitBtn.textContent = isLoading ? "Loading..." : "Daftar";
    }
  },

  showRegisterError(message) {
    this._showMessage("Registrasi gagal!", "failed");
  },

  showSuccess(message) {
    this._showMessage("Registrasi berhasil!", "success");
  },

  resetForm() {
    document.querySelector("#registerForm").reset();
    this.clearErrors();
  },

  redirectToLogin() {
    setTimeout(() => {
      window.location.hash = "/login";
    }, 1500);
  },

  _showMessage(message, type) {
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
      type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
    }`;

    notification.innerHTML = `
      <div class="flex items-center">
        <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"} mr-2"></i>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 1000);
  },
};

export default RegisterPage;
