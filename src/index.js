// import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

// API key and endpoint for the Pixabay API
const API_KEY = "37619405-9719ac033b63a10770946e8e1";
const ENDPOINT = "https://pixabay.com/api/";

// Selecting DOM elements
const form = document.querySelector("#search-form");
let currentSearchQuery = ''; // The current search query
let currentPage = 1; // The current page number of results
let totalHits = 0; // The total number of search results


const gallery = document.querySelector(".gallery");
const moreBttn = document.querySelector(".load-more");
const MAX_IMG_PER_REQUEST = 40; // Maximum number of images per API request

// Event listener for form submit
form.addEventListener('submit', function(event){
    event.preventDefault();
    currentSearchQuery = document.querySelector('input[name="searchQuery"]').value; // Get the value of the search input
    currentPage = 1; // Reset the current page to 1
    totalHits = 0; // Reset the total hits count
    gallery.innerHTML = ''; // empting galllery
    apiFetchImages(currentSearchQuery) // Fetch images based on the search query
});

moreBttn.style.display = 'none';

// Event listener for "Load More" button click
moreBttn.addEventListener('click', function(){
    apiFetchImages(currentSearchQuery); // Fetch more images based on the current search query
})


// Function to fetch images from the Pixabay API
function apiFetchImages(query){
    const apiURL =`${ENDPOINT}?key=${API_KEY}&q=${query}&page=${currentPage}&per_page=${MAX_IMG_PER_REQUEST}&image_type="photo"&orientation="horizontal"&safesearch="true"`
    axios
    .get(apiURL)
    .then(function(response){

        const data = response.data;
        console.log(data)

        if (data.hits.length > 0){
            totalHits=data.totalHits;
            renderImages(data.hits); // Render the fetched images in the gallery

            if(totalHits > currentPage * MAX_IMG_PER_REQUEST){
                moreBttn.style.display = 'block'
            } else{
                moreBttn.style.display = "none";
                console.log("Sorry, there are no images matching your search query. Please try again.")
                // Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.");
            }
            currentPage++ // Increment the current page
        } else{
            // Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.");
            console.log("Sorry, there are no images matching your search query. Please try again.")
            
        }
    })
    .catch(error => console.log(error))
}



// Function to render images in the gallery
function renderImages(images){
    images.forEach(function(image){
        const card = document.createElement('div');
        card.className = 'photo-card';
        


        const img = document.createElement('img');
        img.src = image.webformatURL;
        img.alt = image.tags;
        img.loading = "lazy";
        img.style.width="250px";

        const a = document.createElement('a');
        a.className = 'gallery__image';
        a.href = image.largeImageURL; // Set the href attribute to the large image URL

        const info = document.createElement('div');
        info.className ='info';

        const likes = document.createElement('p');
        likes.className ='info-items';
        info.innerHTML=`<b>Likes: </b> ${image.likes}`;

        const views = document.createElement('p');
        views.className ='info-items';
        views.innerHTML = `<b>View: </b>${image.views}`;

        const comments =document.createElement('p');
        comments.className='info-item';
        comments.innerHTML = `<b>Comments: </b>${image.comments}`;

        const downloads = document.createElement('p');
        downloads.className='info-item';
        downloads.innerHTML = `<b>Downloads: </b>${image.downloads}`

        info.append(likes, views, comments, downloads);
        card.append(img, info);
        gallery.append(card);


        // Event listener for individual image click inside the gallery

        a.addEventListener('click', function(event){
            event.preventDefault();
            createSimpleLB(a); // Open the SimpleLightbox for the clicked image
        })

    })
}

// Event listener for image click inside the gallery

gallery.addEventListener('click', function(event){
    event.preventDefault();
    if(event.target.classList.contains('gallery__image')){
        createSimpleLB(event.target); // Open the SimpleLightbox for the clicked image
    }
})

// Function to create a SimpleLightbox and open it

function createSimpleLB(imageElement){
    const imageSource = imageElement.getAttribute('href'); // Get the href attribute of the clicked image
    const galleryEl = new SimpleLightbox('.gallery a');
    galleryEl.open(imageSource); // Open the SimpleLightbox with the clicked image
}


gallery.style.display = "flex";
gallery.style.flexwrap = "wrap";
gallery.style.justifyContent = "space-around";


