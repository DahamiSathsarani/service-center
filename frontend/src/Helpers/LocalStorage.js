export function setAuthToken(token) {
  localStorage.setItem("auth-token", token);
}

export function getAuthToken() {
  return localStorage.getItem("auth-token");
}

export function removeAuthToken() {
  localStorage.removeItem("auth-token");
}
export function setCredentials(email, password) {
  localStorage.setItem("email", email);
  localStorage.setItem("password", password);
}

export function getCredentials() {
  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");
  return { email, password };
}

export function removeCredentials() {
  localStorage.removeItem("email");
  localStorage.removeItem("password");
}
