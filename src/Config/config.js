const config = {
  SERVER_BASE_URL: "http://192.168.100.86:3000",
  SERVER_ROUTES: {
    LOGIN_USER: "login-user",
    SIGNUP_USER: "signup-user",
    KGBYMS: "kbgyms",
    USERS: "users",
    LOGIN_ADMINISTRATOR: "login-user",
    LOGOUT: "logout",
    SIGNUP_GYM: "signup-gym",
  },
  getRouteUrl(route) {
    return `${this.SERVER_BASE_URL}/${route}`;
  },
};

export default config;
