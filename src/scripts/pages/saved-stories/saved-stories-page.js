// src/scripts/pages/saved-stories/saved-stories-page.js
import { SavedStoriesView } from './saved-stories-view.js';
import { SavedStoriesPresenter } from './saved-stories-presenter.js';

const SavedStoriesPage = {
  async render() {
    console.log('SavedStoriesPage: render() called'); // DEBUG
    return `
      <section id="saved-stories-section" class="container mx-auto px-4 py-8 min-h-screen">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold text-gray-800">My Saved Stories</h2>
          <button id="back-to-home-btn" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-150">
            <i class="fas fa-home mr-2"></i>Back to Home
          </button>
        </div>
        <div id="saved-loading" class="text-center py-4 hidden">
          <p class="text-gray-500">Loading saved stories...</p>
        </div>
        <div id="saved-error-message" class="text-center py-4 text-red-500 hidden"></div>
        <div id="saved-story-list" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          </div>
      </section>
    `;
  },

  async afterRender() {
    console.log('SavedStoriesPage: afterRender() called'); // DEBUG

    // Event listener untuk tombol "Back to Home"
    const backToHomeBtn = document.getElementById('back-to-home-btn');
    if (backToHomeBtn) {
      backToHomeBtn.addEventListener('click', () => {
        window.location.hash = '#/'; // Arahkan ke homepage
      });
    } else {
      console.error('SavedStoriesPage: Back to Home button not found.');
    }

    const view = new SavedStoriesView();
    // Inisialisasi referensi DOM di view SETELAH HTML utama halaman ini dirender ke DOM aplikasi.
    // Kita akan memanggil metode khusus di view untuk ini.
    view.initializeDOMReferences();

    const presenter = new SavedStoriesPresenter(view);
    try {
      await presenter.loadSavedStories();
      console.log('SavedStoriesPage: loadSavedStories() finished.'); // DEBUG
    } catch (error) {
      console.error('SavedStoriesPage: Error during presenter.loadSavedStories()', error); // DEBUG
      view.showError('An unexpected error occurred while loading stories.');
    }
  },
};

export default SavedStoriesPage;
