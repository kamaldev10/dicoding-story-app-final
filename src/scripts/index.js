import '../styles/styles.css';
import App from './pages/app';
import { registerServiceWorker } from './utils';

document.addEventListener('DOMContentLoaded', async () => {
  const mainContent = document.querySelector('#mainContent');
  const drawerButton = document.querySelector('#drawer-button');
  const navigationDrawer = document.querySelector('#navigation-drawer');
  const navigationContainer = document.querySelector('#navigation-container');

  const app = new App({
    content: mainContent,
    drawerButton: drawerButton,
    navigationDrawer: navigationDrawer,
    navigationContainer: navigationContainer,
  });

  await app.renderPage();

  await registerServiceWorker();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
    if (location.hash === '#mainContent') {
      const mainContent = document.getElementById('mainContent');
      const skipLink = document.getElementById('skip-to-content-btn');

      if (mainContent) {
        mainContent.focus();

        // Hapus fokus dari skip link agar tersembunyi kembali
        if (skipLink) {
          skipLink.blur();
        }
      }
    }
  });

  window.addEventListener('load', async () => {
    await app.renderPage();
  });
});
