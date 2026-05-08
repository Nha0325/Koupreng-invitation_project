// Mock API for authentication
export const loginAPI = async (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
        resolve({ success: true, token: 'mock-jwt-token', user: { name: 'Test User', email: credentials.email } });
      } else {
        reject(new Error('Invalid email or password (use test@example.com / password123)'));
      }
    }, 1000);
  });
};

export const registerAPI = async (userData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, token: 'mock-jwt-token', user: { name: userData.name, email: userData.email } });
    }, 1000);
  });
};

export const forgotPasswordAPI = async (email) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Password reset link sent to ' + email });
    }, 1000);
  });
};
