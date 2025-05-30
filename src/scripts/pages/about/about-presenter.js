import AboutModel from "./about-model.js";
import AboutView from "./about-view.js";

class AboutPresenter {
  constructor() {
    this.model = new AboutModel();
    this.view = new AboutView();
  }

  async init() {
    const data = await this.model.getAboutData();
    this.view.render(data);
  }

  getViewElement() {
    return this.view.getContainer();
  }
}

export default AboutPresenter;
