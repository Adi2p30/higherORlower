export async function getImage(query) {
  try {
    const apiKey = "AIzaSyBm1u2CUOsuSC8MKxUxLJVBFRLyjT2B5bo";
    const cseId = "442b75221d701406d"; // Your Google CSE ID
    const encodedQuery = encodeURIComponent(query);
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodedQuery}&cx=${cseId}&searchType=image&key=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      return data.items[0].link; // Return the URL of the first image
    } else {
      console.error("No images found for the query.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
}
