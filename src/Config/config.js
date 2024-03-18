const config = {
  SERVER_BASE_URL: "http://192.168.100.86:3000",
  SERVER_ROUTES: {
    LOGIN: "login",
    SIGNUP: "signup",
    KGBYMS: "kbgyms",
    USERS: "users"
  },
  getRouteUrl(route) {
    return `${this.SERVER_BASE_URL}/${route}`;
  },
};

export default config;
