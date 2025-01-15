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
  },
};

export default responseMessages;
