const config = {
  SERVER_BASE_URL: "http://192.168.100.86:3000",
  // Sabina hotspot SERVER_BASE_URL: "http://172.20.10.5:3000",
  STRIPE_PUBLISHABLE_KEY:
    "pk_test_51P1YCERuXzvvb7O52UXIRHxLTRKL6A2JnM9MP8qVkocFyfirki5yjU1ATvGtWLwi87HiYL72GwtG99gEEAKed9Yd00H4UJmRiW",
  SERVER_ROUTES: {
    LOGIN_USER: "login-user",
    SIGNUP_USER: "signup-user",
    KGBYMS: "kbgyms",
    USERS: "users",
    LOGIN_ADMINISTRATOR: "login-user",
    LOGOUT: "logout",
    SIGNUP_GYM: "signup-gym",
    STRIPE_SECRET: "stripe-secret",
    REVIEWS: "reviews",
  },
  getRouteUrl(route) {
    return `${this.SERVER_BASE_URL}/${route}`;
  },
};

export default config;
