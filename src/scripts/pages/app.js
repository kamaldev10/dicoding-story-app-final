import { footerPresenter } from '../components/footer/footer-presenter';
import { NavigationPresenter } from '../components/navigation/navigation-presenter';
import NavigationView from '../components/navigation/navigation-view';
import routes from '../routes/routes';
import { getActiveRoute, parseActivePathname } from '../routes/url-parser';
import { CameraUtils } from '../utils/camera-utils';
import 'toastr/build/toastr.min.css';
import notFoundView from './not-found/not-found-view'; // Impor notFoundView Anda

class App {
  #content;
  #navigationDrawer;
  #navigationContainer;
  #navigationPresenter;

  constructor({ navigationDrawer, content, navigationContainer }) {
    this.#content = content;
    this.#navigationDrawer = navigationDrawer;
    this.#navigationContainer = navigationContainer;

    this.#navigationPresenter = new NavigationPresenter();
  }

  async renderPage() {
    CameraUtils.stopCamera();

    const url = getActiveRoute();

    const page = routes[url] || notFoundView;
    // --------------------------

    const urlSegments = parseActivePathname();
    if (window.location.pathname === '/' && window.location.hash === '') {
      window.history.replaceState(null, '', '#/');
    }

    const isAuthPage = url === '#/login' || url === '#/register';

    if (!isAuthPage) {
      this.#navigationPresenter.init(NavigationView, {
        container: this.#navigationContainer,
        drawer: this.#navigationDrawer,
      });

      this.#navigationContainer.style.display = 'block';
      this.#navigationDrawer.style.display = 'block';

      await footerPresenter.init();
    } else {
      this.#navigationContainer.innerHTML = '';
      this.#navigationContainer.style.display = 'none';
      this.#navigationDrawer.style.display = 'none';

      footerPresenter.clear();
    }

    try {
      const renderAndAttach = async () => {
        if (typeof page.render !== 'function') {
          console.error('Selected page or notFoundView does not have a render method.', page);
          this.#content.innerHTML = `<div class="text-center text-red-600 py-8">Error: Page cannot be rendered.</div>`;
          return;
        }
        this.#content.innerHTML = await page.render(urlSegments);

        if (typeof page.afterRender === 'function') {
          await page.afterRender(urlSegments);
        }
      };

      if (document.startViewTransition) {
        document.startViewTransition(renderAndAttach);
      } else {
        await renderAndAttach();
      }
    } catch (error) {
      console.error('Render page error:', error, 'for page:', page);
      this.#content.innerHTML = `<div class="text-center text-red-600 py-8">Oops! Failed to load the page content.</div>`;
    }
  }
}

export default App;
