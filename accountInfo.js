function handleCredentialResponse(response) {
  const data = parseJwt(response.credential);

  // Affiche les infos
  document.getElementById("userName").textContent = `Nom : ${data.name}`;
  document.getElementById("userEmail").textContent = `Email : ${data.email}`;

  // Stocke dans le navigateur
  localStorage.setItem("userName", data.name);
  localStorage.setItem("userEmail", data.email);
}

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join(''));

  return JSON.parse(jsonPayload);
}

window.onload = () => {
  // Affiche les infos stockées si présentes
  const savedName = localStorage.getItem("userName");
  const savedEmail = localStorage.getItem("userEmail");

  if (savedName && savedEmail) {
    document.getElementById("userName").textContent = `Nom : ${savedName}`;
    document.getElementById("userEmail").textContent = `Email : ${savedEmail}`;
  }

  // Initialisation de Google One Tap déjà incluse dans le HTML (g_id_onload)
};
