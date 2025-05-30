import AboutPresenter from "./about-presenter.js";

const AboutPage = {
  async render() {
    this.presenter = new AboutPresenter();
    await this.presenter.init();
    return this.presenter.getViewElement().innerHTML;
  },
  async afterRender() {
    // Tambahkan logika tambahan jika diperlukan
  },
};

export default AboutPage;
