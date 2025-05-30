import { StoryApi } from "../../data/story-api";

export class DetailPresenter {
  constructor(view, model = new StoryApi()) {
    this.view = view;
    this.model = model;
  }

  async loadStory(id) {
    try {
      const token = this.model.getToken();
      if (!token) {
        this.view.showError("Token tidak ditemukan. Silakan login.");
        return;
      }

      this.view.renderLoading();

      const result = await this.model.getStoryById({ id, token });

      if (result.error) {
        throw new Error(result.message);
      }

      this.view.renderStory(result.story);

      if (result.story.lat && result.story.lon) {
        this.view.renderMap(
          result.story.lat,
          result.story.lon,
          result.story.description
        );
      } else {
        this.view.renderNoLocation();
      }
    } catch (err) {
      this.view.showError(err.message);
    }
  }
}
