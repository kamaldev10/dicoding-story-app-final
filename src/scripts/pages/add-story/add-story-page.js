// File: add-story-page.js

import { AddStoryView } from './add-story-view.js';
import { AddStoryPresenter } from './add-story-presenter.js';
import { CameraUtils } from '../../utils/camera-utils.js';
import { StoryApi } from '../../data/story-api.js';

const AddStoryPage = {
  async render() {
    return `
      <section id="add-story-page" class="min-h-screen w-full bg-white p-4">
        <div class="max-w-lg mx-auto">
          <!-- Header -->
          <div class="flex items-center mb-6">
            <button aria-labelledby="back button" id="back-button" class="mr-4 text-cyan-600">
              <i class="fa-solid fa-arrow-left text-xl"></i>
            </button>
            <h1 class="text-2xl font-bold">Tambah Cerita Baru</h1>
          </div>

          <!-- Form -->
          <form id="add-story-form" class="space-y-6">
            <div>
              <label for="text-area" class="block font-medium mb-1">Deskripsi</label>
              <textarea 
                id="text-area" 
                name="description" 
                required 
                class="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                rows="3"
                placeholder="Ceritakan kisah Anda..."
              ></textarea>
            </div>
            
            <div>
              <label class="block font-medium mb-2">Foto</label>
              <video id="camera-stream" class="w-full rounded-md border mb-2" autoplay></video>
              <img id="photo-preview" class="w-full rounded-md border mb-2 hidden" alt="Preview hasil foto" />
              <div class="flex gap-2">
                <button aria-labelledby="capture button" type="button" id="capture-btn" class="bg-green-600 text-white px-4 py-2 rounded-md">
                  <i class="fa-solid fa-camera mr-1"></i> Ambil Foto
                </button>
                <button aria-labelledby="recapture button" type="button" id="recapture-btn" class="bg-yellow-500 text-white px-4 py-2 rounded-md hidden">
                  <i class="fa-solid fa-rotate mr-1"></i> Ulangi
                </button>
              </div>
              <canvas id="photo-canvas" class="hidden"></canvas>
              <div class="mt-3">
                <input type="file" name="photo" id="photo-input" accept="image/*" required class="w-full" />
                <label for="photo-input" type="hidden">input photo</label>
                <p class="text-sm text-gray-500 mt-1">Atau pilih file manual (maksimal 1MB)</p>
              </div>
            </div>

            <div>
              <label for="map" class="block font-medium mb-1">Lokasi (opsional)</label>
              <div id="map" class="h-64 rounded-md border mb-2"></div>
              <input type="hidden" id="lat" name="lat" />
              <label type="hidden" for="lat" class="hidden">input latitude</label>
              <input type="hidden" id="lon" name="lon" />
              <label type="hidden" for="lon" class="hidden">input longitude</label>
              <p class="text-sm text-gray-500">Klik peta untuk memilih lokasi</p>
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button aria-labelledby="send story button" type="submit" class="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-md">
                <i class="fa-solid fa-paper-plane mr-1"></i> Kirim Cerita
              </button>
            </div>
          </form>

          <!-- Loading & Error messages -->
          <div id="loading" class="mt-4 text-gray-500 hidden">
            <i class="fa-solid fa-circle-notch fa-spin mr-2"></i> Mengirim cerita...
          </div>
          <div id="error-message" class="mt-4 text-red-600"></div>
        </div>
      </section>
    `;
  },

  async afterRender() {
    const model = new StoryApi();
    const token = model.getToken();
    if (!token) {
      document.getElementById('add-story-page').innerHTML = `
        <div class="flex flex-col items-center justify-center h-screen">
          <div class="mb-6">
            <i class="fas fa-solid fa-shield-alt text-8xl opacity-90" style="--fa-primary-color: gold;"></i>
          </div>
          <h1 class="text-3xl font-bold mb-4">Akses Terbatas</h1>
          <p class="text-red-500 text-lg leading-relaxed">
            Halaman tambah cerita hanya dapat diakses setelah Anda melakukan login terlebih dahulu.
          </p>
        </div>
      `;
      return;
    }

    const view = new AddStoryView();
    const presenter = new AddStoryPresenter(view, model, token);

    view.focusTextArea();
    await presenter.initCamera(view.video);
    presenter.initMap({ latInput: view.latInput, lonInput: view.lonInput });

    view.backButton.addEventListener('click', () => {
      CameraUtils.stopCamera();
      window.location.hash = '/';
    });

    view.captureBtn.addEventListener('click', () => {
      CameraUtils.capturePhoto({
        videoEl: view.video,
        canvasEl: view.canvas,
        previewImgEl: view.previewImg,
        photoInputEl: view.photoInput,
        captureBtn: view.captureBtn,
        recaptureBtn: view.recaptureBtn,
      });
      presenter.stopCamera();
    });

    view.recaptureBtn.addEventListener('click', () => {
      CameraUtils.resetCapture({
        videoEl: view.video,
        previewImgEl: view.previewImg,
        photoInputEl: view.photoInput,
        captureBtn: view.captureBtn,
        recaptureBtn: view.recaptureBtn,
      });
    });

    view.form.addEventListener('submit', (e) => {
      e.preventDefault();
      view.errorMessage.textContent = '';

      const description = view.form.description.value.trim();
      const photo = view.photoInput.files[0];
      const lat = view.latInput.value ? parseFloat(view.latInput.value) : null;
      const lon = view.lonInput.value ? parseFloat(view.lonInput.value) : null;

      if (!description) {
        view.showError('Deskripsi tidak boleh kosong.');
        return;
      }

      if (!photo) {
        view.showError('Foto harus diisi.');
        return;
      }

      if (photo && photo.size > 1024 * 1024) {
        view.showError('Ukuran gambar maksimal 1MB.');
        return;
      }

      presenter.submitNewStory({ description, photo, lat, lon });
      window.location.hash = '/';
    });
  },
};

export default AddStoryPage;
