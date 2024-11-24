import { getImage } from "./getImageBackground.js";

document.addEventListener("DOMContentLoaded", () => {
  const artist1 = document.getElementById("artist1");
  const artist2 = document.getElementById("artist2");
  const song1Name = document.getElementById("song1-name");
  const song1Listeners = document.getElementById("song1-listeners");
  const song2Name = document.getElementById("song2-name");
  const song2Listeners = document.getElementById("song2-listeners");
  const resultMessage = document.getElementById("result-message");
  const higherBtn = document.getElementById("higher-btn");
  const lowerBtn = document.getElementById("lower-btn");
  const scoreDisplay = document.getElementById("score");

  let songs = [];
  let currentSong1 = null;
  let currentSong2 = null;
  let score = 0;

  fetch("premadeCategories/music.json")
    .then((response) => response.json())
    .then((data) => {
      songs = data.map((song) => ({
        title: song.Song,
        streams: parseInt(song.streams.replace(/,/g, ""), 10),
      }));

      if (songs.length > 0) {
        initializeGame();
      } else {
        resultMessage.textContent = "Failed to load song data.";
      }
    })
    .catch((error) => {
      console.error("Error fetching song data:", error);
      resultMessage.textContent = "Error loading game data. Please try again.";
    });

  async function setBackgroundImages() {
    try {
      const song1Image = await getImage(currentSong1.title);
      const song2Image = await getImage(currentSong2.title);

      artist1.style.setProperty(
        "--bg-image",
        song1Image ? `url(${song1Image})` : "none"
      );
      artist2.style.setProperty(
        "--bg-image",
        song2Image ? `url(${song2Image})` : "none"
      );

      artist1.style.setProperty(
        "background-image",
        song1Image ? `url(${song1Image})` : "none"
      );
      artist2.style.setProperty(
        "background-image",
        song2Image ? `url(${song2Image})` : "none"
      );
    } catch (error) {
      console.error("Error setting background images:", error);
    }
  }

  function initializeGame() {
    score = 0;
    updateScore();
    selectRandomSongs();
    updateSongs();
  }

  function selectRandomSongs() {
    const randomIndex1 = Math.floor(Math.random() * songs.length);
    let randomIndex2;
    do {
      randomIndex2 = Math.floor(Math.random() * songs.length);
    } while (randomIndex2 === randomIndex1);

    currentSong1 = songs[randomIndex1];
    currentSong2 = songs[randomIndex2];
  }

  async function updateSongs() {
    await setBackgroundImages();
    song1Name.textContent = currentSong1.title;
    song1Listeners.textContent = `${currentSong1.streams.toLocaleString()} streams`;
    song2Name.textContent = currentSong2.title;
    song2Listeners.textContent = "?";
    resultMessage.textContent = "";
  }

  function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
  }

  function handleGuess(isHigher) {
    const correct = isHigher
      ? currentSong2.streams > currentSong1.streams
      : currentSong2.streams <= currentSong1.streams;

    if (correct) {
      score++;
      resultMessage.textContent = "Correct!";
      currentSong1 = currentSong2;

      let newSongIndex;
      do {
        newSongIndex = Math.floor(Math.random() * songs.length);
      } while (songs[newSongIndex] === currentSong1);

      currentSong2 = songs[newSongIndex];

      updateScore();
      setTimeout(() => {
        updateSongs();
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
