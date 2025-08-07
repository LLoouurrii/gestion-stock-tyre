window.addEventListener("beforeunload", () => {
  const menu = document.getElementById("topMenu");
  if (menu) {
    localStorage.setItem("topMenuScroll", menu.scrollLeft);
  }
});

window.addEventListener("load", () => {
  const menu = document.getElementById("topMenu");
  const savedScroll = localStorage.getItem("topMenuScroll");
  if (menu && savedScroll !== null) {
    menu.scrollLeft = parseInt(savedScroll, 10);
  }
});