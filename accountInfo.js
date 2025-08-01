function handleCredentialResponse(response) {
  const data = parseJwt(response.credential);
  document.getElementById("userName").textContent = `Nom : ${data.name}`;
  document.getElementById("userEmail").textContent = `Email : ${data.email}`;
}

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = atob(base64Url.replace(/-/g, '+').replace(/_/g, '/'));
  const jsonPayload = decodeURIComponent(
    base64.split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join('')
  );
  return JSON.parse(jsonPayload);
}
