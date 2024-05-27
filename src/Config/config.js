const config = {
  // SERVER_BASE_URL: "http://192.168.43.82:3000", // BCU
  SERVER_BASE_URL: "http://192.168.100.86:3000",
  // SERVER_BASE_URL: "http://192.168.1.8:3000", //perta
  
  STRIPE_PUBLISHABLE_KEY:
    "pk_test_51P1YCERuXzvvb7O52UXIRHxLTRKL6A2JnM9MP8qVkocFyfirki5yjU1ATvGtWLwi87HiYL72GwtG99gEEAKed9Yd00H4UJmRiW",
  SERVER_ROUTES: {
    LOGIN_USER: "login-user",
    SIGNUP_USER: "signup-user",
    ADMIN_KGBYMS: "admin-kbgyms",
    USERS: "users",
    LOGIN_ADMINISTRATOR: "login-user",
    LOGOUT: "logout",
    SIGNUP_GYM: "signup-gym",
    STRIPE_SECRET: "stripe-secret",
    REVIEWS: "reviews",
    VIDEOS: "videos",
    PAYMENTS: "payments",
    USER_RANK: "user-rank",
    REVIEW_ALLOWED: "review-allowed",
  },
  getRouteUrl(route) {
    return `${this.SERVER_BASE_URL}/${route}`;
  },
};

export default config;
