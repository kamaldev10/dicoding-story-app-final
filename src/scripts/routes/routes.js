import LoginPage from '../pages/auth/login/login-page';
import RegisterPage from '../pages/auth/register/register-page';
import HomePage from '../pages/home/home-page';
import DetailPage from '../pages/detail-story/detail-page';
import AddStoryPage from '../pages/add-story/add-story-page';
import AboutPage from '../pages/about/about-page';
import SavedStoriesPage from '../pages/saved-stories/saved-stories-page';

const routes = {
  '#/': HomePage,
  '#/login': LoginPage,
  '#/register': RegisterPage,
  '#/about': AboutPage,
  '#/stories/:id': DetailPage,
  '#/add-story': AddStoryPage,
  '#/saved-stories': SavedStoriesPage,
};

export default routes;
