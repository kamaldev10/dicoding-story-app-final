export class DetailView {
  constructor() {
    this.container = document.getElementById("story-detail");
    this.mapContainer = document.getElementById("map");
  }

  renderLoading() {
    if (this.container) {
      this.container.innerHTML = `
        <div class="p-6 text-center text-gray-600">Loading story...</div>
      `;
    }
  }

  renderStory(story) {
    if (!this.container) return;

    const date = new Date(story.createdAt).toLocaleString();

    this.container.innerHTML = `
     <button
      type="button"
      id="back-btn"
      class="ms-3 inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition"
      aria-label="Back"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>
      <img src="${story.photoUrl}" alt="Story image" class="w-full h-64 object-cover rounded-t-xl">
      <div class="p-6">
        <h1 class="text-2xl font-bold text-gray-800">${story.name}</h1>
        <p class="text-gray-700 mt-4 whitespace-pre-line">${story.description}</p>
        <p class="text-sm text-gray-500 mt-6">📅 ${date}</p>
      </div>
    `;
  }

  renderMap(lat, lon, description) {
    if (!this.mapContainer) return;

    // Bersihkan konten lama / instance peta sebelumnya
    this.mapContainer.innerHTML = "";
    this.mapContainer.classList.remove(
      "flex",
      "items-center",
      "justify-center"
    );
    this.mapContainer.style.height = "16rem"; // 64 = 16rem

    const map = L.map(this.mapContainer).setView([lat, lon], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    const marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup(`<b>Lokasi Cerita</b><br>${description}`).openPopup();
  }

  renderNoLocation() {
    if (!this.mapContainer) return;

    this.mapContainer.innerHTML = `
      <p class="text-center text-gray-400 italic py-8">Lokasi tidak tersedia.</p>
    `;
    this.mapContainer.style.height = "auto";
  }

  showError(message) {
    if (this.container) {
      this.container.innerHTML = `
        <p class="text-center text-red-600 p-6 font-semibold">${message}</p>
      `;
    }
  }
}
