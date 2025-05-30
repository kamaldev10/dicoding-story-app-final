// src/scripts/pages/saved-stories/saved-stories-view.js
import Swal from 'sweetalert2';

export class SavedStoriesView {
  constructor() {
    // Inisialisasi sebagai null, akan diisi oleh initializeDOMReferences
    this.storyListContainer = null;
    this.loadingElement = null;
    this.errorMessageElement = null;
    this.pageSectionElement = null; // Untuk section utama halaman
  }

  // Metode baru untuk mengambil referensi elemen DOM
  initializeDOMReferences() {
    console.log('SavedStoriesView: initializeDOMReferences() called'); // DEBUG
    this.pageSectionElement = document.getElementById('saved-stories-section'); // Ambil section utama
    this.storyListContainer = document.getElementById('saved-story-list');
    this.loadingElement = document.getElementById('saved-loading');
    this.errorMessageElement = document.getElementById('saved-error-message');

    // Verifikasi apakah elemen penting ditemukan
    if (!this.storyListContainer) console.error('SavedStoriesView: storyListContainer not found!');
    if (!this.loadingElement) console.error('SavedStoriesView: loadingElement not found!');
    if (!this.errorMessageElement)
      console.error('SavedStoriesView: errorMessageElement not found!');
  }

  showLoading() {
    if (this.loadingElement) {
      this.loadingElement.classList.remove('hidden');
      console.log('SavedStoriesView: showLoading()'); // DEBUG
    } else {
      console.warn('SavedStoriesView: loadingElement is null in showLoading()');
    }
  }

  hideLoading() {
    if (this.loadingElement) {
      this.loadingElement.classList.add('hidden');
      console.log('SavedStoriesView: hideLoading()'); // DEBUG
    } else {
      console.warn('SavedStoriesView: loadingElement is null in hideLoading()');
    }
  }

  showError(message) {
    if (this.errorMessageElement) {
      this.errorMessageElement.textContent = message;
      this.errorMessageElement.classList.remove('hidden');
      console.log('SavedStoriesView: showError() -', message); // DEBUG
    } else {
      console.warn('SavedStoriesView: errorMessageElement is null in showError()');
    }
    // Biasanya, jika error, kita ingin mengosongkan daftar cerita
    if (this.storyListContainer) {
      this.storyListContainer.innerHTML = `<p class="text-center text-gray-500 col-span-full">${message}</p>`;
    }
  }

  hideError() {
    if (this.errorMessageElement) {
      this.errorMessageElement.textContent = '';
      this.errorMessageElement.classList.add('hidden');
      console.log('SavedStoriesView: hideError()'); // DEBUG
    }
  }

  renderStories(stories, onUnsaveCallback) {
    // Pastikan referensi DOM sudah diinisialisasi jika belum (misalnya jika metode ini dipanggil terpisah)
    // Namun, idealnya initializeDOMReferences sudah dipanggil sebelumnya.
    if (!this.storyListContainer) {
      console.error(
        'SavedStoriesView: storyListContainer is null in renderStories(). Call initializeDOMReferences() first.',
      );
      this.initializeDOMReferences(); // Coba inisialisasi lagi sebagai fallback
      if (!this.storyListContainer) return; // Jika masih null, keluar
    }
    console.log('SavedStoriesView: renderStories() called with stories:', stories); // DEBUG

    this.hideError(); // Sembunyikan pesan error lama jika ada
    this.storyListContainer.innerHTML = ''; // Bersihkan dulu

    if (!stories || stories.length === 0) {
      this.storyListContainer.innerHTML =
        '<p class="text-center text-gray-500 col-span-full">No stories saved yet.</p>';
      return;
    }

    stories.forEach((story) => {
      const storyCard = document.createElement('div');
      storyCard.className =
        'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out flex flex-col'; // Tambahkan flex flex-col
      storyCard.innerHTML = `
        <img src="${story.photoUrl}" alt="${story.name}" class="w-full h-48 object-cover">
        <div class="p-4 flex flex-col flex-grow"> 
          <h3 class="text-lg font-semibold mb-1 capitalize">${story.name}</h3>
          <p class="text-gray-600 text-sm mb-3 break-words flex-grow">${story.description.substring(0, 100)}${story.description.length > 100 ? '...' : ''}</p> 
          <button data-id="${story.id}" class="unsave-button bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-2 px-3 rounded w-full mt-auto"> 
            <i class="fas fa-trash-alt mr-2"></i>Unsave Story
          </button>
        </div>
      `;

      const unsaveButton = storyCard.querySelector('.unsave-button');
      if (unsaveButton) {
        unsaveButton.addEventListener('click', (event) => {
          event.stopPropagation(); // Hentikan event bubbling agar tidak memicu klik pada card
          if (onUnsaveCallback) {
            onUnsaveCallback(story.id);
          }
        });
      }

      storyCard.addEventListener('click', (event) => {
        // Pastikan klik bukan pada tombol sebelum navigasi
        if (!event.target.closest('.unsave-button')) {
          window.location.hash = `#/stories/${story.id}`;
        }
      });

      this.storyListContainer.appendChild(storyCard);
    });
  }

  showActionNotification(title, text, icon = 'success') {
    Swal.fire({ title, text, icon, timer: 2000, showConfirmButton: false });
  }

  removeStoryFromDOM(storyId) {
    if (!this.storyListContainer) return;
    const button = this.storyListContainer.querySelector(`.unsave-button[data-id="${storyId}"]`);
    if (button) {
      const cardToRemove = button.closest('.bg-white.rounded-lg'); // Cari parent card
      if (cardToRemove) {
        cardToRemove.remove();
        console.log(`SavedStoriesView: Removed story card with id ${storyId} from DOM`); // DEBUG
      }
    }
    if (this.storyListContainer.childElementCount === 0) {
      this.renderStories([], null);
    }
  }
}
