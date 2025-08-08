const allowedEmails = [
  'louri.panfiloff@gmail.com',
  'e.tyresmax@gmail.com',
  'a.tyresmax@gmail.com',
  'tom.tyresmax@gmail.com',
  'ab.tyresmax@mail.com',
  'y.tyresmax@gmail.com
];

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

function checkGoogleAccess() {
  const token = sessionStorage.getItem('google_jwt');
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  const payload = parseJwt(token);
  const userEmail = payload.email;

  if (!allowedEmails.includes(userEmail)) {
    alert("⛔ Accès refusé : adresse non autorisée");
    sessionStorage.removeItem('google_jwt');
    window.location.href = 'index.html';
  }
}

function logoutGoogleAccess() {
  sessionStorage.removeItem('google_jwt');
  window.location.href = 'index.html';
}