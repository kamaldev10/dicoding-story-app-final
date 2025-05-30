import { HomeView } from "./home-view.js";
import { HomePresenter } from "./home-presenter.js";
import { StoryApi } from "../../data/story-api.js";

const HomePage = {
  async render() {
    return `
      <section id="homepage" class="min-h-screen w-full bg-white">
        <!-- Header & tombol add story -->
        <div class="flex justify-between items-center mt-4 ">
          <h1 class="text-2xl font-bold sm:ms-2 sm:mt-2">Stories</h1>
          <button aria-labelledby="add-story-button" id="add-story" class="bg-gray-500 text-white px-4 py-2 rounded sm:me-4 sm:mt-3"><i class="fa-solid fa-plus"></i>Add Story</button>
        </div>

        <!-- Filter lokasi -->
        <div class="mb-4 sm:ms-2">
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="filter-location" />
            <label type="hidden" for="filter-location">filter location</label>
            <span>Hanya tampilkan cerita dengan lokasi</span>
          </label>
        </div>

        <!-- Pagination -->
        <div id="pagination" class="mt-6 flex justify-around">
          <button aria-labelledby="previous-button" id="prev-page" class="px-4 py-2 border-solid border-2 border-cyan-500 rounded">Previous</button>
          <button aria-labelledby="next-button" id="next-page" class="px-4 py-2 border-solid border-2 border-cyan-500 rounded">Next</button>
        </div>

        <!-- List cerita -->
        <div id="story-list" class="max-w-lg mx-auto gap-2 bg-gradient-to-r from-cyan-700 to-cyan-300 rounded-xl shadow-md overflow-hidden md:max-w-2xl px-8 py-5 my-5"></div>


        <!-- Loading dan error -->
        <div id="loading" class="mt-4 text-gray-500 hidden">Loading...</div>
        <div id="error-message" class="mt-2 text-red-600"></div>
      </section>
    `;
  },

  async afterRender() {
    const model = new StoryApi();
    const token = model.getToken();
    if (!token) {
      document.getElementById("homepage").innerHTML = ` 
       <div class="mb-6 mt-10 ">
        <i class="fas fa-solid fa-shield-alt text-8xl opacity-90" style="--fa-primary-color: gold;"></i>
      </div>
      <h1 class="text-3xl font-bold mb-4">Akses Terbatas</h1>
       <p class="text-red-500 text-lg leading-relaxed">
      Halaman homepage hanya dapat diakses setelah Anda melakukan login terlebih
      dahulu.
      </p>
      `;
      return;
    }

    const view = new HomeView();
    const presenter = new HomePresenter(view, token, model);

    view.prevPageBtn.addEventListener("click", () => presenter.prevPage());
    view.nextPageBtn.addEventListener("click", () => presenter.nextPage());

    document
      .getElementById("filter-location")
      .addEventListener("change", (e) => {
        presenter.setLocationFilter(e.target.checked);
      });

    const redirectToAddStory = () => {
      window.location.hash = "#/add-story";
    };

    // Changed: Now redirects to add story page instead of showing modal
    view.addStoryBtn.addEventListener("click", () => {
      redirectToAddStory();
    });

    presenter.loadStories();
  },
};

export default HomePage;
