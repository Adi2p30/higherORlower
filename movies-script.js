document.addEventListener("DOMContentLoaded", () => {
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

  // Fetch JSON data
  fetch("premadeCategories/Top_1000_Movies_HigherOrLower.json")
    .then((response) => response.json())
    .then((data) => {
      movies = data.map((movie) => ({
        title: movie.Title,
        revenue: parseInt(movie["Lifetime Gross"].replace(/\$|,/g, ""), 10),
        year: movie.Year,
      }));

      if (movies.length > 0) {
        initializeGame();
      } else {
        resultMessage.textContent = "Failed to load movie data.";
      }
    })
    .catch((error) => {
      console.error("Error fetching or parsing the JSON file:", error);
      resultMessage.textContent = "Error loading game data. Please try again.";
    });

  function initializeGame() {
    score = 0;
    updateScore();
    currentMovie1 = getRandomMovie();
    currentMovie2 = getRandomMovie();
    updateMovies();
  }

  function getRandomMovie() {
    return movies[Math.floor(Math.random() * movies.length)];
  }

  function updateMovies() {
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
      currentMovie2 = getRandomMovie();
      updateScore();
      animateCorrectGuess();
    } else {
      resultMessage.textContent = "You got it wrong! Game Over!";
      score = 0;
      updateScore();
    }
  }

  function animateCorrectGuess() {
    const movie1Element = document.getElementById("movie1");
    const movie2Element = document.getElementById("movie2");

    movie2Element.style.transition = "transform 0.4s ease, opacity 0.4s ease";
    // movie1Element.style.transition = "opacity 0.4s ease";

    // Slide movie2 to the left
    movie2Element.style.transform = "translateX(-300px)";
    movie2Element.style.opacity = "0";
    setTimeout(() => {
      updateMovies();
      // movie1Element.style.opacity = "0";
      movie2Element.style.transform = "translateX(0)";
      movie2Element.style.opacity = "1";
      setTimeout(() => {
        movie1Element.style.opacity = "1";
      }, 400);
    }, 400);
  }

  higherBtn.addEventListener("click", () => handleGuess(true));
  lowerBtn.addEventListener("click", () => handleGuess(false));
});
