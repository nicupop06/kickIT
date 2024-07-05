const config = {
  SERVER_BASE_URL: "your url:3000", 
  
  STRIPE_PUBLISHABLE_KEY:
    "stripe publishable key",
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
