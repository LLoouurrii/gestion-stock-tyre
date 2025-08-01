function handleCredentialResponse(response) {
    // Décode le token ID
    const data = parseJwt(response.credential);
    document.getElementById("userName").textContent = `Nom : ${data.name}`;
    document.getElementById("userEmail").textContent = `Email : ${data.email}`;
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = decodeURIComponent(window.atob(base64Url).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    return JSON.parse(base64);
}

window.onload = () => {
    google.accounts.id.initialize({
        client_id: "TON_CLIENT_ID.apps.googleusercontent.com", // Remplace par ton ID client OAuth
        callback: handleCredentialResponse
    });
    google.accounts.id.prompt(); // Affiche la boîte de connexion si nécessaire
};