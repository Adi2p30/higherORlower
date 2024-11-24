import { getImage } from "./getImageBackground.js";

document.addEventListener("DOMContentLoaded", () => {
  const movie1 = document.getElementById("movie1");
  const movie2 = document.getElementById("movie2");
  const movie1Title = document.getElementById("movie1-title");
  const movie1Revenue = document.getElementById("movie1-revenue");
  const movie2Title = document.getElementById("movie2-title");
  const movie2Revenue = document.getElementById("movie2-revenue");
  const resultMessage = document.getElementById("result-message");
  const higherBtn = document.getElementById("higher-btn");
  const lowerBtn = document.getElementById("lower-btn");
  const scoreDisplay = document.getElementById("score");

  let movies = [];
  let currentMovie1 = null;
  let currentMovie2 = null;
  let score = 0;

  fetch("premadeCategories/movie-box-office.json")
    .then((response) => response.json())
    .then((data) => {
      movies = data.map((movie) => ({
        title: movie.Title,
        revenue: parseInt(movie["Lifetime Gross"].replace(/[\$,]/g, ""), 10),
      }));

      if (movies.length > 0) {
        initializeGame();
      } else {
        resultMessage.textContent = "Failed to load movie data.";
      }
    })
    .catch((error) => {
      console.error("Error fetching movie data:", error);
      resultMessage.textContent = "Error loading game data. Please try again.";
    });

  async function setBackgroundImages() {
    try {
      const movie1Image = await getImage(currentMovie1.title);
      const movie2Image = await getImage(currentMovie2.title);

      movie1.style.setProperty(
        "--bg-image",
        movie1Image ? `url(${movie1Image})` : "none"
      );
      movie2.style.setProperty(
        "--bg-image",
        movie2Image ? `url(${movie2Image})` : "none"
      );

      movie1.style.setProperty(
        "background-image",
        movie1Image ? `url(${movie1Image})` : "none"
      );
      movie2.style.setProperty(
        "background-image",
        movie2Image ? `url(${movie2Image})` : "none"
      );
    } catch (error) {
      console.error("Error setting background images:", error);
    }
  }

  function initializeGame() {
    score = 0;
    updateScore();
    selectRandomMovies();
    updateMovies();
  }

  function selectRandomMovies() {
    const randomIndex1 = Math.floor(Math.random() * movies.length);
    let randomIndex2;
    do {
      randomIndex2 = Math.floor(Math.random() * movies.length);
    } while (randomIndex2 === randomIndex1);

    currentMovie1 = movies[randomIndex1];
    currentMovie2 = movies[randomIndex2];
  }

  async function updateMovies() {
    await setBackgroundImages();
    movie1Title.textContent = currentMovie1.title;
    movie1Revenue.textContent = `$${currentMovie1.revenue.toLocaleString()}`;
    movie2Title.textContent = currentMovie2.title;
    movie2Revenue.textContent = "?";
    resultMessage.textContent = "";
  }

  function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
  }

  function handleGuess(isHigher) {
    const correct = isHigher
      ? currentMovie2.revenue > currentMovie1.revenue
      : currentMovie2.revenue <= currentMovie1.revenue;

    if (correct) {
      score++;
      resultMessage.textContent = "Correct!";
      currentMovie1 = currentMovie2;

      let newMovieIndex;
      do {
        newMovieIndex = Math.floor(Math.random() * movies.length);
      } while (movies[newMovieIndex] === currentMovie1);

      currentMovie2 = movies[newMovieIndex];

      updateScore();
      setTimeout(() => {
        updateMovies();
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
