window.COGNILENS_APP_CONFIG = {
  firebase: {
    apiKey: "AIzaSyBXDRHDJR_xZIZ_rM12P5hO4BC2-2P2N34",
    authDomain: "cognilens-bd088.firebaseapp.com",
    projectId: "cognilens-bd088",
    appId: "1:122873332316:web:dc245e7d69e63f5aaa5c99"
  },

  auth: {
    mode: "firebase",
    enableDemoFallback: false,
    requireEmailVerification: false,
    providers: {
      google: true,
      facebook: true
    }
  },

  turnstile: {
    siteKey: "0x4AAAAAADYkKAXRGYUTysCr",
    verifyEndpoint: "/api/verify-turnstile"
  }
};
