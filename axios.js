import * as Carousel from "./Carousel.js";
import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element. - Not using
//const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY =
  "live_M5iSn1Ms9iVph8qjvE9WPWl9A1N6FX5NzmmFXoE8qFpSycE7BRo2XSwtUHV10VjT";

// Default headers and base URL for Axios
axios.defaults.headers.common["x-api-key"] = API_KEY;
axios.defaults.baseURL = "https://api.thedogapi.com/v1";

/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */
async function initialLoad() {
  try {
    // Retrieve a list of breeds from the dog API using axios
    const response = await axios.get("/breeds");
    const breeds = response.data;

    // Create new <options> for each of these breeds, and append them to breedSelect
    breeds.forEach((breed) => {
      const option = document.createElement("option");
      // Each option value attribute is equal to the id of the breed
      option.value = breed.id;
      // Display the text of each option equal to the name of the breed
      option.text = breed.name;
      breedSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error during initialLoad:", error);
  }
}

// Execute the function immediately
initialLoad();

// Create an event handler for breedSelect
breedSelect.addEventListener("change", async () => {
  // Clear existing carousel items
  Carousel.clear();

  // Retrieve information on the selected breed from the dog API using axios
  const selectedBreedId = breedSelect.value;
  if (selectedBreedId) {
    try {
      const response = await axios.get(
        `/images/search?breed_ids=${selectedBreedId}&limit=5`
      );
      const data = response.data;

      // Create new elements for the carousel and append them
      data.forEach((image) => {
        const carouselItem = Carousel.createCarouselItem(
          image.url,
          image.alt,
          selectedBreedId
        );
        Carousel.appendCarousel(carouselItem);
      });

      // Update the informational section in the infoDump element
      updateInfoDump(selectedBreedId);

      // Start the carousel
      Carousel.start();
    } catch (error) {
      console.error("Error fetching breed information:", error);
    }
  }
});

async function updateInfoDump(breedId) {
  try {
    // Fetch detailed information about the selected breed using Axios
    const response = await axios.get(`/breeds/${breedId}`);
    const breedInfo = response.data;

    // Customize the information based on the data you receive
    const infoText = `
      Breed Name: ${breedInfo.name}
      Description: ${breedInfo.description || "Not Available"}
      Origin: ${breedInfo.origin || "Not Available"}
      Temperament: ${breedInfo.temperament || "Not Available"}
      Life Span: ${breedInfo.life_span || "Not Available"}
    `;

    // Update the infoDump element with the breed information
    infoDump.textContent = infoText;
  } catch (error) {
    console.error("Error fetching breed information:", error);
    infoDump.textContent = "Error fetching breed information";
  }
}

/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
  // your code here
  try {
    // Check to see if the image is already favourited
    const isFavourited = await isImageFavourited(imgId);

    if (isFavourited) {
      // If favourited, delete the favourite
      await axios.delete(`/favourites/${imgId}`);
      console.log(`Removed favourite for image with ID ${imgId}`);
    } else {
      // If not favourited, post the favourite
      await axios.post("/favourites", { image_id: imgId });
      console.log(`Added favourite for image with ID ${imgId}`);
    }
  } catch (error) {
    console.log("Error toggling favourite:", error);
  }
}

async function isImageFavourited(imgId) {
  try {
    // Get the list of user's favourites
    const response = await axios.get("/favourites");
    const favourites = response.data;

    // Check if the image ID is in the list of favourites
    return favourites.some((favourite) => favourite.image_id === imgId);
  } catch (error) {
    console.error("Error checking if image is favortied", error);
    return false;
  }
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */
getFavouritesBtn.addEventListener("click", async () => {
  try {
    // Fetch all favourites from the dog API
    const response = await axios.get("/favourites");
    //const favourites = response.data;

    // Clear existing carousel items
    Carousel.clear();

    // Create carousel items for each favourite and append them to the carousel
    favourites.forEach((favourite) => {
      const carouselItem = Carousel.createCarouselItem(
        favourite.image.url,
        favourite.image.alt,
        favourite.image_id
      );
      Carousel.appendCarousel(carouselItem);
    });

    // Start the carousel
    Carousel.start();
  } catch (error) {
    console.error("Error fetching favourites:", error);
  }
});

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
