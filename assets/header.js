
document.addEventListener("DOMContentLoaded",()=>{
  const bar = `
  <header id="topbar">
    <span class="logo">
      <span class="ring"></span>
      <span class="brand">Metalloine</span>
    </span>
  </header>`;
  document.body.insertAdjacentHTML("afterbegin", bar);
});
