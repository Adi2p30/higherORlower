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

  // Fetch JSON data
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
      console.error("Error fetching or parsing the JSON file:", error);
      resultMessage.textContent = "Error loading game data. Please try again.";
    });

  function initializeGame() {
    score = 0;
    updateScore();
    currentCompany1 = getRandomCompany();
    currentCompany2 = getRandomCompany();
    updateCompanies();
  }

  function getRandomCompany() {
    return companies[Math.floor(Math.random() * companies.length)];
  }

  function updateCompanies() {
    company1Title.textContent = currentCompany1.name;
    company1Valuation.textContent = `$${currentCompany1.valuation.toLocaleString()}M`;
    company2Title.textContent = currentCompany2.name;
    company2Valuation.textContent = "?";
    resultMessage.textContent = "";
  }

  function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
  }

  function handleGuess(isHigher) {
    const correct = isHigher
      ? currentCompany2.valuation > currentCompany1.valuation
      : currentCompany2.valuation <= currentCompany1.valuation;

    if (correct) {
      score++;
      resultMessage.textContent = "Correct!";
      currentCompany1 = currentCompany2;
      currentCompany2 = getRandomCompany();
      updateScore();
      animateCorrectGuess();
    } else {
      resultMessage.textContent = "You got it wrong! Game Over!";
      score = 0;
      updateScore();
    }
  }

  function animateCorrectGuess() {
    const company1Element = document.getElementById("company1");
    const company2Element = document.getElementById("company2");

    company2Element.style.transition = "transform 0.4s ease, opacity 0.4s ease";

    // Slide company2 to the left
    company2Element.style.transform = "translateX(-300px)";
    company2Element.style.opacity = "0";
    setTimeout(() => {
      updateCompanies();
      company2Element.style.transform = "translateX(0)";
      company2Element.style.opacity = "1";
    }, 400);
  }

  higherBtn.addEventListener("click", () => handleGuess(true));
  lowerBtn.addEventListener("click", () => handleGuess(false));
});
