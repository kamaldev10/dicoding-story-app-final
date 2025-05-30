// NavigationView.js
import Swal from 'sweetalert2';

const NavigationView = {
  init(container, drawer) {
    this.container = container;
    this.drawer = drawer;
  },

  render({ userName, onLogout }) {
    this.container.innerHTML = `
      <a href="#mainContent" id="skip-to-content-btn" class="skip-to-content">Skip to main content</a>
      <nav class="md:px-8 flex justify-between items-center">
        <span class="text-xl font-semibold">
          <i class="fas fa-book-open mr-2 text-blue-600"></i>
          Dicoding Story App
        </span>
        <div class="hidden md:flex gap-6 lg:gap-10 items-center"> 
          <a id="home-btn" class="hover:text-blue-600 flex items-center cursor-pointer">
            <i class="fas fa-home mr-1"></i>
            Home
          </a>
          <a id="saved-stories-btn" class="hover:text-blue-600 flex items-center cursor-pointer">
            <i class="fas fa-bookmark mr-1"></i>
            Saved
          </a>
          <a id="about-btn" class="hover:text-blue-600 flex items-center cursor-pointer">
            <i class="fas fa-info-circle mr-1"></i>
            About
          </a>
          <div class="flex items-center gap-3 lg:gap-5"> 
            <span class="text-gray-600 flex items-center">
              <i class="fas fa-user-circle mr-2 text-blue-500"></i>
              <span class="font-medium text-blue-600 ml-1">${userName}</span>
            </span>
            <button id="push-subscribe-btn-main" aria-label="Toggle Push Notification" class="text-black hover:text-white flex items-center px-3 py-2 rounded-lg transition md:bg-cyan-400">
              <i id="push-subscribe-icon-main" class="fa-solid fa-bell mr-1"></i>
              <span id="push-subscribe-text-main">Subscribe</span>
            </button>
            <button id="logout-btn" aria-label="Logout button" class="text-red-500 md:text-black hover:text-white flex items-center px-3 py-2 rounded-lg transition md:bg-rose-700">
              <i class="fas fa-sign-out-alt mr-1"></i>
              Logout
            </button>
          </div>
        </div>
        <button aria-label="mobile-menu-button" id="mobile-menu-btn" class="md:hidden p-2 rounded-lg hover:bg-cyan-700">
          <i class="fas fa-bars text-xl"></i>
        </button>
      </nav>
    `;

    if (this.drawer) {
      this.drawer.innerHTML = `
        <nav class="p-4 space-y-4">
          <div class="border-b pb-4 mb-4">
            <div class="flex items-center">
              <i class="fas fa-user-circle text-2xl text-blue-500 mr-2"></i>
              <span class="font-medium">${userName}</span>
            </div>
          </div>
          <a id="drawer-home-btn" class="text-gray-800 hover:text-blue-500 flex items-center py-2 cursor-pointer">
            <i class="fas fa-home mr-3 w-4"></i>
            Home
          </a>
          <a id="drawer-saved-stories-btn" class="text-gray-800 hover:text-blue-500 flex items-center py-2 cursor-pointer">
            <i class="fas fa-bookmark mr-3 w-4"></i>
            Saved Stories
          </a>
          <a id="drawer-about-btn" class="text-gray-800 hover:text-blue-500 flex items-center py-2 cursor-pointer">
            <i class="fas fa-info-circle mr-3 w-4"></i>
            About
          </a>
          <button id="push-subscribe-btn-drawer" aria-label="Toggle Push Notification in drawer" class="text-gray-800 hover:text-blue-500 flex items-center w-full">
            <i id="push-subscribe-icon-drawer" class="fa-solid fa-bell mr-3 w-4"></i>
            <span id="push-subscribe-text-drawer">Subscribe</span>
          </button>
          <button aria-label="Logout button in drawer" id="drawer-logout-btn" class="text-red-500 hover:text-red-600 flex items-center py-2 w-full">
            <i class="fas fa-sign-out-alt mr-3 w-4"></i>
            Logout
          </button>
        </nav>
      `;
    }
    this._bindEvents(onLogout);
  },

  _bindEvents(onLogout) {
    document.getElementById('home-btn')?.addEventListener('click', () => {
      window.location.hash = '#/';
    });
    document.getElementById('about-btn')?.addEventListener('click', () => {
      window.location.hash = '#/about';
    });
    // Event listener untuk tombol Saved Stories (Main Nav)
    document.getElementById('saved-stories-btn')?.addEventListener('click', () => {
      window.location.hash = '#/saved-stories';
    });

    document.getElementById('drawer-home-btn')?.addEventListener('click', () => {
      window.location.hash = '#/';
      this.drawer?.classList.add('-translate-x-full');
    });
    document.getElementById('drawer-about-btn')?.addEventListener('click', () => {
      window.location.hash = '#/about';
      this.drawer?.classList.add('-translate-x-full');
    });
    // Event listener untuk tombol Saved Stories (Drawer)
    document.getElementById('drawer-saved-stories-btn')?.addEventListener('click', () => {
      window.location.hash = '#/saved-stories';
      this.drawer?.classList.add('-translate-x-full');
    });

    document.getElementById('logout-btn')?.addEventListener('click', onLogout);
    document.getElementById('drawer-logout-btn')?.addEventListener('click', onLogout);

    document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
      this.drawer?.classList.toggle('-translate-x-full');
    });
  },

  // ... (sisa metode di NavigationView tetap sama) ...
  confirmLogout() {
    return Swal.fire({
      title: 'Are you sure to logout?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout!',
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#3085d6',
    }).then((result) => result.isConfirmed);
  },

  redirectToLogin() {
    window.location.hash = '#/login';
  },

  updatePushNotificationButton(buttonId, iconId, textId, isSubscribed) {
    const button = document.getElementById(buttonId);
    const iconElement = document.getElementById(iconId);
    const textElement = document.getElementById(textId);

    if (button && iconElement && textElement) {
      if (isSubscribed) {
        textElement.textContent = 'Unsubscribe';
        iconElement.classList.remove('fa-bell');
        iconElement.classList.add('fa-bell-slash');
      } else {
        textElement.textContent = 'Subscribe';
        iconElement.classList.remove('fa-bell-slash');
        iconElement.classList.add('fa-bell');
      }
    }
  },

  showLogoutSuccessAlert() {
    Swal.fire({
      icon: 'success',
      title: 'Logout Successful!',
      text: 'You have been logged out.',
      timer: 2000,
      showConfirmButton: false,
    });
  },

  showSubscriptionLoadingAlert() {
    Swal.fire({
      title: 'Subscribing...',
      text: 'Please wait while we set up notifications.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  },

  showSubscriptionSuccessAlert() {
    Swal.fire({
      icon: 'success',
      title: 'Subscribed!',
      text: 'You will now receive push notifications.',
    });
  },

  showSubscriptionErrorAlert(error) {
    Swal.fire({
      icon: 'error',
      title: 'Subscription Failed',
      text:
        error.message ||
        'Could not subscribe to push notifications. Please try again or check permissions.',
    });
  },

  showUnsubscriptionLoadingAlert() {
    Swal.fire({
      title: 'Unsubscribing...',
      text: 'Please wait while we remove notifications.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  },

  showUnsubscriptionSuccessAlert() {
    Swal.fire({
      icon: 'success',
      title: 'Unsubscribed!',
      text: 'You will no longer receive push notifications.',
    });
  },

  showUnsubscriptionErrorAlert(error) {
    Swal.fire({
      icon: 'error',
      title: 'Unsubscription Failed',
      text: error.message || 'Could not unsubscribe. Please try again.',
    });
  },
};

export default NavigationView;
