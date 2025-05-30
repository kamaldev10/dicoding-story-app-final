export default class NavigationModel {
  getUserName() {
    return localStorage.getItem("userName") || "User";
  }

  clearUserData() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
  }
}
