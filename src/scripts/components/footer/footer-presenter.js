import { FooterModel } from "./footer-model.js";
import { footerView } from "./footer-view.js";

export const footerPresenter = {
  init() {
    const model = new FooterModel();
    const data = model.getData();
    footerView.render(data);
  },

  clear() {
    footerView.clear();
  },
};
