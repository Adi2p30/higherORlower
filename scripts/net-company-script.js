import { getImage } from "./getImageBackground.js";

document.addEventListener("DOMContentLoaded", () => {
  const company1Title = document.getElementById("company1-name");
  const company1Valuation = document.getElementById("company1-valuation");
  const company2Title = document.getElementById("company2-name");
  const company2Valuation = document.getElementById("company2-valuation");
  const resultMessage = document.getElementById("result-message");
  const higherBtn = document.getElementById("higher-btn");
  const lowerBtn = document.getElementById("lower-btn");
  const scoreDisplay = document.getElementById("score");

  let companies = [];
  let currentCompany1 = null;
  let currentCompany2 = null;
  let score = 0;

  // Fetch company data
  fetch("premadeCategories/net-company.json")
    .then((response) => response.json())
    .then((data) => {
      companies = data.map((company) => ({
        name: company.Company,
        valuation: parseInt(
          company["Valuation (in millions)"].replace(/\$|,/g, ""),
          10
        ),
        rank: company.Rank,
      }));

      if (companies.length > 0) {
        initializeGame();
      } else {
        resultMessage.textContent = "Failed to load company data.";
      }
    })
    .catch((error) => {
      console.error("Error fetching company data:", error);
      resultMessage.textContent = "Error loading game data. Please try again.";
    });

  // Function to set background images for the companies
  async function setBackgroundImages() {
    try {
      const company1Image = await getImage(currentCompany1.name);
      const company2Image = await getImage(currentCompany2.name);

      document.getElementById("company1").style.backgroundImage = company1Image
        ? `url(${company1Image})`
        : "none";
      document.getElementById("company2").style.backgroundImage = company2Image
        ? `url(${company2Image})`
        : "none";
    } catch (error) {
      console.error("Error setting background images:", error);
    }
  }

  function initializeGame() {
    score = 0;
    updateScore();
    selectRandomCompanies();
    updateCompanies();
  }

  function selectRandomCompanies() {
    const randomIndex1 = Math.floor(Math.random() * companies.length);
    let randomIndex2;
    do {
      randomIndex2 = Math.floor(Math.random() * companies.length);
    } while (randomIndex2 === randomIndex1);

    currentCompany1 = companies[randomIndex1];
    currentCompany2 = companies[randomIndex2];
  }

  async function updateCompanies() {
    await setBackgroundImages();
    company1Title.textContent = currentCompany1.name;
    company1Valuation.textContent = `$${currentCompany1.valuation.toLocaleString()}M`;

    company2Title.textContent = currentCompany2.name;
    company2Valuation.textContent = "?"; // Hide valuation for company 2 initially

    resultMessage.textContent = "";
  }

  function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
  }

  function handleGuess(isHigher) {
    const correct = isHigher
      ? currentCompany2.valuation > currentCompany1.valuation
      : currentCompany2.valuation <= currentCompany1.valuation;

    // Reveal valuation for Company 2 after the guess
    company2Valuation.textContent = `$${currentCompany2.valuation.toLocaleString()}M`;

    if (correct) {
      score++;
      resultMessage.textContent = "Correct!";
      currentCompany1 = currentCompany2;

      let newCompanyIndex;
      do {
        newCompanyIndex = Math.floor(Math.random() * companies.length);
      } while (companies[newCompanyIndex] === currentCompany1);

      currentCompany2 = companies[newCompanyIndex];

      updateScore();
      setTimeout(() => {
        updateCompanies();
      }, 100);

      shiftRightSide();
    } else {
      resultMessage.textContent = "You got it wrong! Game Over!";
      score = 0;
      updateScore();
    }
  }

  function shiftRightSide() {
    const gameContainer = document.getElementById("game-container");
    gameContainer.classList.add("right-shifted");

    setTimeout(() => {
      gameContainer.classList.remove("right-shifted");
    }, 700);
  }

  higherBtn.addEventListener("click", () => handleGuess(true));
  lowerBtn.addEventListener("click", () => handleGuess(false));
});
