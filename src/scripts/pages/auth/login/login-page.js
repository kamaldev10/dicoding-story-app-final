// Fixed LoginPage.js with Realtime Validation
import { LoginPresenter } from "./login-presenter";

const LoginPage = {
  async render() {
    return `
      <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
        <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h1 class="text-2xl font-bold text-center mb-6">Login</h1>
          <form id="loginForm" class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium">Email</label>
              <input 
                id="email" 
                type="email" 
                class="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300" 
                autocomplete="email"
              />
              <p class="text-sm text-red-600 mt-1 hidden" id="error-email"></p>
            </div>
            <div>
            <label for="password" class="block text-sm font-medium">Password</label>
            <div class="relative">
                <input 
                  id="password" 
                  type="password" 
                  class="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-300" 
                  autocomplete="current-password"
                />
                <button 
                  type="button" 
                  id="togglePassword" 
                  class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                  aria-label="Toggle password visibility"
                >
                  <svg id="eyeIcon" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg id="eyeSlashIcon" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
                <p class="text-sm text-red-600 mt-1 hidden" id="error-password"></p>
              </div>
            </div>
            <button aria-labelledby="login-button" type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Login</button>
            <p class="text-sm text-center mt-2">Belum punya akun? <a href="#/register" class="text-blue-600">Daftar</a></p>
            <p id="login-error" class="text-center text-red-600 mt-2 hidden"></p>
          </form>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const presenter = new LoginPresenter(this);
    const form = document.querySelector("#loginForm");
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");

    const togglePasswordBtn = document.querySelector("#togglePassword");
    const eyeIcon = document.querySelector("#eyeIcon");
    const eyeSlashIcon = document.querySelector("#eyeSlashIcon");

    // Fixed toggle password functionality
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
      passwordInput.focus();
    });

    // Realtime validation for email field
    emailInput.addEventListener("input", () => {
      this.clearErrors("email");
      const email = emailInput.value.trim();

      if (email === "") {
        // Don't show error when user starts typing
        return;
      }

      // Validate email format after user has typed something
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        this.showError("email", "Format email tidak valid");
      }
    });

    // Realtime validation for password field
    passwordInput.addEventListener("input", () => {
      this.clearErrors("password");
      const password = passwordInput.value;

      if (password === "") {
        // Don't show error when user starts typing
        return;
      }

      // Validate password length after user has typed something
      if (password.length < 8) {
        this.showError("password", "Password minimal 8 karakter");
      }
    });

    // Additional blur events to check for empty fields
    emailInput.addEventListener("blur", () => {
      const email = emailInput.value.trim();
      if (!email) {
        this.showError("email", "Email wajib diisi");
      }
    });

    passwordInput.addEventListener("blur", () => {
      const password = passwordInput.value;
      if (!password) {
        this.showError("password", "Password wajib diisi");
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      presenter.login(emailInput.value, passwordInput.value);
    });
  },

  clearErrors() {
    document.querySelector("#error-email").classList.add("hidden");
    document.querySelector("#error-password").classList.add("hidden");
    document.querySelector("#login-error").classList.add("hidden");
  },

  showError(field, message) {
    const errorEl = document.querySelector(`#error-${field}`);
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
  },

  setLoadingState(isLoading) {
    const btn = document.querySelector("#loginForm button[type='submit']");
    btn.disabled = isLoading;
    btn.textContent = isLoading ? "Loading..." : "Login";
  },

  showLoginError(message) {
    const errEl = document.querySelector("#login-error");
    errEl.textContent = message;
    errEl.classList.remove("hidden");
  },

  redirectToHome() {
    window.location.hash = "#/";
  },
};

export default LoginPage;
