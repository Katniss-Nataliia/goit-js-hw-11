// import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const API_KEY = "37619405-9719ac033b63a10770946e8e1";
const ENDPOINT = "https://pixabay.com/api/";

const form = document.querySelector("#search-form");
// const formInput = form.elements.searchQuery;
let currentSearchQuery = '';
let currentPage = 1;
let totalHits = 0;


const gallery = document.querySelector(".gallery");
const moreBttn = document.querySelector(".load-more");
const MAX_IMG_PER_REQUEST = 40;


form.addEventListener('submit', function(event){
    event.preventDefault();
    currentSearchQuery = document.querySelector('input[name="searchQuery"]').value;
    currentPage = 1;
    totalHits = 0;
    gallery.innerHTML = ''; // empting galllery
    apiFetchImages(currentSearchQuery)
});

moreBttn.style.display = 'none';
moreBttn.addEventListener('click', function(){
    apiFetchImages(currentSearchQuery);
})

function apiFetchImages(query){
    const apiURL =`${ENDPOINT}?key=${API_KEY}&q=${query}&page=${currentPage}&per_page=${MAX_IMG_PER_REQUEST}&image_type="photo"&orientation="horizontal"&safesearch="true"`
    axios.get(apiURL)
    .then(function(response){

        const data = response.data;
        console.log(data)

        if (data.hits.length > 0){
            totalHits=data.totalHits;
            renderImages(data.hits);

            if(totalHits> currentPage *MAX_IMG_PER_REQUEST){
                moreBttn.style.display = 'block'
            } else{
                moreBttn.style.display = "none";
                console.log("Sorry, there are no images matching your search query. Please try again.")
                // Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.");
            }
            currentPage++
        } else{
            // Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.");
            console.log("Sorry, there are no images matching your search query. Please try again.")
            
        }
    })
    .catch(error => console.log(error))
}




function renderImages(images){
    images.forEach(function(image){
        const card = document.createElement('div');
        card.className = 'photo-card';
        


        const img = document.createElement('img');
        img.src = image.webformatURL;
        img.alt = image.tags;
        img.loading = "lazy";
        img.style.width="250px";

        `<a class="gallery__image" href=${img.largeImageURL}  onclick = "event.preventDefault()">`



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
        views.innerHTML = `<b>Comments: </b>${image.comments}`;

        const downloads = document.createElement('p');
        downloads.className='info-item';
        downloads.innerHTML = `<b>Downloads: </b>${image.downloads}`

        info.append(likes, views, comments, downloads);
        card.append(img, info);
        gallery.append(card);

    })
}

// gallery.style.display = "flex";
gallery.style.flexwrap ="wrap";
gallery.style.width = "calc(100%-5)";

img.addEventListener("click", createSimpleLB);

function createSimpleLB(event){
    console.log(event.target.dataset.source);
    let galleryEl = new Simplelightbox('.galleryEl a');
    galleryEl.on('show.simplelightbox');
}



