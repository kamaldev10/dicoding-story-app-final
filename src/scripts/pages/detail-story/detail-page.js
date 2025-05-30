import { DetailPresenter } from "./detail-presenter.js";
import { DetailView } from "./detail-view.js";

const DetailPage = {
  async render(urlSegments) {
    const storyId = urlSegments.id || null;

    if (!storyId) {
      return `<p class="text-center text-red-600 py-8 font-semibold">Invalid story URL</p>`;
    }

    this._storyId = storyId;

    return `
      <section class="max-w-3xl mx-auto p-6">
        <div id="story-detail" class="bg-white rounded-xl shadow-md overflow-hidden mb-6"></div>
        <div id="map" class="w-full h-64 rounded-xl shadow-md bg-gray-50 flex items-center justify-center">
          <p class="text-gray-400 italic">Loading map...</p>
        </div>
      </section>
    `;
  },

  async afterRender(urlSegments) {
    const storyId = urlSegments.id || null;
    if (!storyId) return;

    this.view = new DetailView();
    this.presenter = new DetailPresenter(this.view);

    await this.presenter.loadStory(storyId);

    document.getElementById("back-btn").addEventListener("click", () => {
      window.location.hash = "/";
    });
  },
};

export default DetailPage;
