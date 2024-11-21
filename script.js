document.addEventListener("DOMContentLoaded", () => {
  const background = document.getElementById("background");
  const buttons = document.querySelectorAll(".category-btn");

  buttons.forEach((button) => {
    button.addEventListener("mouseover", () => {
      const bgImage = button.getAttribute("data-bg");
      background.style.backgroundImage = `url('${bgImage}')`;
    });

    button.addEventListener("mouseout", () => {
      background.style.backgroundImage = "url('images/bg.png')";
    });
  });
});
