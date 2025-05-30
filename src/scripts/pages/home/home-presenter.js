// File: src/scripts/pages/home/home-presenter.js
import Database from '../../data/database.js'; // Pastikan path benar

export class HomePresenter {
  constructor(view, token, model) {
    this.view = view;
    this.token = token;
    this.model = model; // Ini adalah StoryApi
    this.currentPage = 1;
    this.filterLocation = false;
  }

  async loadStories() {
    try {
      this.view.showLoading();
      const apiResponse = await this.model.getAllStories({
        // Mengambil dari API
        token: this.token,
        page: this.currentPage,
        location: this.filterLocation ? 1 : 0,
        size: 10,
      });

      if (!apiResponse || !apiResponse.listStory) {
        // Jika ada error di API response atau struktur tidak sesuai
        this.view.showError('Failed to fetch stories or invalid data format.');
        this.view.hideLoading();
        return;
      }

      // Untuk setiap cerita dari API, cek apakah sudah ada di IndexedDB
      const storiesWithSaveStatus = await Promise.all(
        apiResponse.listStory.map(async (story) => {
          const existingStory = await Database.getStoryById(story.id);
          return {
            ...story,
            isSaved: !!existingStory, // true jika ada, false jika tidak
          };
        }),
      );

      this.view.showStories(storiesWithSaveStatus, this.#handleToggleSaveStory.bind(this));
      this.view.updatePagination(apiResponse.isLastPage, this.currentPage);
    } catch (err) {
      console.error('Error loading stories:', err);
      this.view.showError(err.message || 'Terjadi kesalahan saat mengambil data cerita.');
    } finally {
      this.view.hideLoading();
    }
  }

  nextPage() {
    this.currentPage++;
    this.loadStories();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadStories();
    }
  }

  setLocationFilter(checked) {
    this.filterLocation = checked;
    this.currentPage = 1;
    this.loadStories();
  }

  async #handleToggleSaveStory(story) {
    if (!story || !story.id) {
      console.error('Invalid story data provided to #handleToggleSaveStory');
      this.view.showActionNotification('Error', 'Data cerita tidak valid.', 'error'); // Gunakan showActionNotification
      return;
    }

    try {
      // Cek lagi status saat ini dari database untuk kepastian, atau percaya pada story.isSaved
      const currentlySavedStory = await Database.getStoryById(story.id);
      const isCurrentlySavedInDB = !!currentlySavedStory;

      if (isCurrentlySavedInDB) {
        // Jika ada di DB, berarti aksi berikutnya adalah unsave
        await Database.removeStory(story.id);
        this.view.showActionNotification(
          'Sukses!',
          `Cerita "${story.name}" berhasil dihapus dari simpanan.`,
          'success',
        );
      } else {
        // Jika tidak ada di DB, berarti aksi berikutnya adalah save
        // Data yang disimpan harus lengkap
        const storyToSave = {
          id: story.id,
          name: story.name,
          description: story.description,
          photoUrl: story.photoUrl,
          createdAt: story.createdAt, // Pastikan field ini ada di objek story dari API
          lat: story.lat, // Pastikan field ini ada
          lon: story.lon, // Pastikan field ini ada
        };
        await Database.putStory(storyToSave); // Menggunakan putStory
        this.view.showActionNotification(
          'Sukses!',
          `Cerita "${story.name}" berhasil disimpan.`,
          'success',
        );
      }
    } catch (error) {
      console.error('Error toggling save state for story:', error);
      // Cek jika error karena ConstraintError (saat mencoba add data yang sudah ada dengan putStory)
      if (error.name === 'ConstraintError' && !isCurrentlySavedInDB) {
        this.view.showActionNotification(
          'Info',
          `Cerita "${story.name}" sudah ada di simpanan.`,
          'info',
        );
      } else {
        this.view.showActionNotification(
          'Gagal',
          `Gagal mengubah status simpan cerita: ${error.message}`,
          'error',
        );
      }
    } finally {
      // Muat ulang cerita untuk memperbarui tampilan tombol save/unsave di seluruh daftar
      // Ini cara paling sederhana untuk memastikan UI konsisten.
      // Jika ingin lebih optimal, update state tombol spesifik secara manual.
      this.loadStories();
    }
  }
}
