// File: home-view.js

export class HomeView {
  constructor() {
    this.storyList = document.getElementById('story-list');
    this.loading = document.getElementById('loading');
    this.errorMessage = document.getElementById('error-message');
    this.prevPageBtn = document.getElementById('prev-page');
    this.nextPageBtn = document.getElementById('next-page');
    this.addStoryBtn = document.getElementById('add-story');
  }

  showLoading() {
    this.loading.classList.remove('hidden');
  }

  hideLoading() {
    this.loading.classList.add('hidden');
  }

  showError(msg) {
    this.errorMessage.textContent = msg;
  }

  // Modifikasi: Parameter kedua sekarang onToggleSaveStoryCallback
  // dan stories sekarang diharapkan memiliki properti `isSaved`
  showStories(stories, onToggleSaveStoryCallback) {
    this.storyList.innerHTML = '';

    if (!stories || !stories.length) {
      this.storyList.innerHTML = `<p class="text-gray-600">Tidak ada cerita.</p>`;
      return;
    }

    stories.forEach((story) => {
      const cardWrapper = document.createElement('div');
      cardWrapper.className = 'relative mb-3';

      const card = document.createElement('div');
      card.className =
        'border rounded md:flex bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden'; // Tambahkan overflow-hidden
      card.innerHTML = `
        <div class="md:shrink-0">
          <img src="${story.photoUrl}" alt="${story.name}" class="h-48 w-full object-cover md:h-full md:w-48">
        </div>
        <div class="p-8 flex-grow flex flex-col justify-between"> 
          <div>
            <h1 class="capitalize tracking-wide text-lg text-black font-semibold">${story.name}</h1>
            <p class="mt-2 text-gray-700 text-sm break-words">${story.description.substring(0, 150)}${story.description.length > 150 ? '...' : ''}</p>
            ${
              story.lat && story.lon
                ? `<p class="text-xs text-gray-500 mt-2">\ud83d\udccd ${story.lat.toFixed(
                    2,
                  )}, ${story.lon.toFixed(2)}</p>`
                : ''
            }
          </div>
        </div>
      `;

      card.addEventListener('click', (event) => {
        if (event.target.closest('.toggle-save-story-btn')) {
          return;
        }
        window.location.hash = `/stories/${story.id}`;
      });

      const toggleSaveButton = document.createElement('button');
      toggleSaveButton.className =
        'toggle-save-story-btn font-bold py-2 px-4 rounded text-sm mt-4 self-start'; // self-start agar tidak full width
      toggleSaveButton.setAttribute(
        'aria-label',
        `${story.isSaved ? 'Unsave' : 'Save'} story ${story.name}`,
      );

      if (story.isSaved) {
        toggleSaveButton.innerHTML = '<i class="fas fa-bookmark mr-2"></i>Unsave Story'; // Atau fa-trash-alt
        toggleSaveButton.classList.add('bg-red-500', 'hover:bg-red-700', 'text-white');
      } else {
        toggleSaveButton.innerHTML = '<i class="far fa-bookmark mr-2"></i>Save Story'; // Gunakan far untuk outline
        toggleSaveButton.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white');
      }

      toggleSaveButton.addEventListener('click', (event) => {
        event.stopPropagation();
        if (onToggleSaveStoryCallback) {
          onToggleSaveStoryCallback(story); // Kirim seluruh objek story (yang sudah ada flag isSaved)
        }
      });

      const cardContent = card.querySelector('.p-8');
      if (cardContent) {
        cardContent.appendChild(toggleSaveButton);
      }

      cardWrapper.appendChild(card);
      this.storyList.appendChild(cardWrapper);
    });
  }

  updatePagination(isLastPage, currentPage) {
    this.prevPageBtn.disabled = currentPage === 1;
    this.nextPageBtn.disabled = isLastPage;
  }

  // Ubah nama menjadi lebih generik
  showActionNotification(title, text, icon = 'success') {
    // Implementasi menggunakan alert standar, bisa diganti Swal
    alert(`${title}\n${text}`);
    // Contoh jika pakai Swal:
    // if (typeof Swal !== 'undefined') {
    //   Swal.fire({ title, text, icon, timer: 2000, showConfirmButton: false });
    // } else {
    //   alert(`${title}\n${text}`);
    // }
  }
}
