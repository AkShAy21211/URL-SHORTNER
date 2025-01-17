const responseMessages = {
  success: {
    USER_REGISTERED: {
      message: "User registered successfully",
      statusCode: 201,
    },

    LOGIN_SUCCESS: {
      message: "Login successful",
      statusCode: 200,
    },

    URL_SHORTENED: {
      message: "URL shortened successfully",
      statusCode: 201,
    },

    URL_REDIRECTED: {
      message: "Redirecting to the shortened URL",
      statusCode: 302,
    },
   
  },

  error: {
    USER_REGISTERED_FAILED: {
      message: "Registration failed please try again",
      statusCode: 400,
    },
    USER_EXISTS:{
      message: "User already exists",
      statusCode: 409,
    },
    LOGIN_FAILED:{
      message: "Invalid credentials",
      statusCode: 400,
    },
    USER_NOT_FOUND: {
      message: "User not found please register",
      statusCode: 404,
    },
    AUTHENTICATION_FAILED: {
      message: "Authentication failed",
      statusCode: 401,
    },
    SERVER_ERROR: {
      message: "Internal server error",
      statusCode: 500,
    },

     URL_NOT_FOUND: {
      message: "URL not found",
      statusCode: 404,
    },

    URL_INVALID: {
      message: "Invalid URL",
      statusCode: 400,
    },
    URL_EXIST:{
      message: "URL already exists",
      statusCode: 409,
    },

    URL_SHORTEN_FAILED: {
      message: "Failed to shorten URL",
      statusCode: 500,
    },

    ANALYTICS_NOT_FOUND:{
      message: "No analytics found for the given URL",
      statusCode: 404,
    },
   
  },
};

export default responseMessages;
