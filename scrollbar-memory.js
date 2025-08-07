<script>
  const menu = document.getElementById("topMenu");

  // 🔁 Sauvegarde la position du scroll avant de quitter la page
  window.addEventListener("beforeunload", () => {
    if (menu) {
      localStorage.setItem("topMenuScroll", menu.scrollLeft);
    }
  });

  // 🔁 Restaure la position + centre le bouton actif au chargement
  window.addEventListener("DOMContentLoaded", () => {
    const savedScroll = localStorage.getItem("topMenuScroll");

    if (menu && savedScroll !== null) {
      // Scroll fluide vers la position sauvegardée
      requestAnimationFrame(() => {
        menu.scrollTo({
          left: parseInt(savedScroll, 10),
          behavior: "smooth"
        });
      });
    }

    // 🔍 Centrage du bouton actif
    const activeBtn = menu.querySelector("button.active");
    if (activeBtn) {
      requestAnimationFrame(() => {
        const menuRect = menu.getBoundingClientRect();
        const btnRect = activeBtn.getBoundingClientRect();
        const offset = btnRect.left - menuRect.left - (menuRect.width / 2) + (btnRect.width / 2);

        menu.scrollTo({
          left: menu.scrollLeft + offset,
          behavior: "smooth"
        });
      });
    }
  });
</script>