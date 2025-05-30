// NavigationPresenter.js
import {
  isCurrentPushSubscriptionAvailable,
  subscribe,
  unsubscribe,
} from '../../utils/notification-helper';
import NavigationModel from './navigation-model';

export class NavigationPresenter {
  #view;
  #model;

  constructor(model = new NavigationModel()) {
    this.#model = model;
  }

  async init(view, { container, drawer }) {
    this.#view = view;
    this.#view.init(container, drawer);

    const userName = this.#model.getUserName();

    this.#view.render({
      userName,
      onLogout: this.#handleLogout.bind(this),
    });

    await this.#setupPushNotification();
  }

  async #handleLogout() {
    const confirmed = await this.#view.confirmLogout();
    if (confirmed) {
      this.#model.clearUserData();
      this.#view.redirectToLogin();
      this.#view.showLogoutSuccessAlert();
    }
  }

  // Di NavigationPresenter.js (konsep)
  async #handleSubscribe() {
    try {
      this.#view.showSubscriptionLoadingAlert();
      await subscribe(); // Panggil versi baru dari helper
      console.log(subscribe());
      this.#view.showSubscriptionSuccessAlert();
    } catch (error) {
      console.error('Presenter #handleSubscribe error:', error.message);
      if (error.message === 'PERMISSION_NOT_GRANTED') {
        this.#view.showPermissionDeniedAlert(); // Metode baru di View
      } else if (error.message === 'ALREADY_SUBSCRIBED') {
        this.#view.showAlreadySubscribedAlert(); // Metode baru di View
      } else {
        this.#view.showSubscriptionErrorAlert(error); // Menggunakan yang sudah ada
      }
    } finally {
      await this.#setupPushNotification();
    }
  }

  async #handleUnsubscribe() {
    try {
      this.#view.showUnsubscriptionLoadingAlert();
      await unsubscribe();
      this.#view.showUnsubscriptionSuccessAlert();
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      this.#view.showUnsubscriptionErrorAlert(error);
    } finally {
      await this.#setupPushNotification();
    }
  }

  async #setupPushNotification() {
    const isSubscribed = await isCurrentPushSubscriptionAvailable();

    const buttonsToUpdate = [
      {
        btn: 'push-subscribe-btn-main',
        icon: 'push-subscribe-icon-main',
        text: 'push-subscribe-text-main',
      },
      {
        btn: 'push-subscribe-btn-drawer',
        icon: 'push-subscribe-icon-drawer',
        text: 'push-subscribe-text-drawer',
      },
    ];

    buttonsToUpdate.forEach((ids) => {
      const buttonElement = document.getElementById(ids.btn);
      if (buttonElement) {
        const newButton = buttonElement.cloneNode(true); // Re-clone untuk event listener baru
        buttonElement.parentNode.replaceChild(newButton, buttonElement);

        this.#view.updatePushNotificationButton(ids.btn, ids.icon, ids.text, isSubscribed);

        if (isSubscribed) {
          newButton.addEventListener('click', () => this.#handleUnsubscribe());
        } else {
          newButton.addEventListener('click', () => this.#handleSubscribe());
        }
      }
    });
  }
}
