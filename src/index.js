'use strict';

import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from "axios";

const apiKey = '19760378-d2f1c7488e9d6752a9d7092b3';
const axiosOptions = {
    key: apiKey,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
};

const formElem = document.querySelector('form');
const galleryElem = document.querySelector('.gallery');
const nextPageButt = document.querySelector('.load-more');
const inputElem = document.querySelector('input');

let inputValue = '';
let page = 1;

const lightbox = new SimpleLightbox('.photo-card a');

inputElem.addEventListener('input', () => {
    inputValue = inputElem.value;
    nextPageButt.style.display = 'none';
});

formElem.addEventListener('submit', (event) => {
    event.preventDefault();

    page = 1;
    galleryElem.innerHTML = '';

    generatingImages(inputValue, page);
});

nextPageButt.addEventListener('click', (event) => {
    page++;

    generatingImages(inputValue, page);
});

async function gettingApiImages(query, page) {
    try {
        const response = await axios.get('https://pixabay.com/api/', { params: { ...axiosOptions, q: query, page: page }});
        const data = await response.data;
        return data;
    } catch (error) {
        Notiflix.Notify.failure('Sorry, there are problems with API.');
    };
};

function markupImages(images) {
    images.forEach((img) => {
        const imgMarkup = `
            <div class="photo-card">
                <a href="${img.largeImageURL}">
                    <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" />
                </a>
                <div class="info">
                    <p class="info-item">
                        <b>Likes</b>
                        ${img.likes}
                    </p>
                    <p class="info-item">
                        <b>Views</b>
                        ${img.views}
                    </p>
                    <p class="info-item">
                        <b>Comments</b>
                        ${img.views}
                    </p>
                    <p class="info-item">
                        <b>Downloads</b>
                        ${img.downloads}
                    </p>
                </div>
            </div>
        `
        galleryElem.insertAdjacentHTML('beforeend', imgMarkup);
    });
};

function smoothScroll() {
    if (page === 1) {
        return;
    };

    const galleryChildsList = document.querySelectorAll('.photo-card');
    const { height: cardHeight } = galleryChildsList[galleryChildsList.length - 1].getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
};

async function generatingImages(q, page) {
    const data = await gettingApiImages(q, page);
    if (!data.hits.length) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        galleryElem.innerHTML = '';
        return;
    };

    markupImages(data.hits);
    lightbox.refresh();
    nextPageButt.style.display = 'block';

    smoothScroll();

    if (data.totalHits === galleryElem.childElementCount || galleryElem.childElementCount >= 500) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        nextPageButt.style.display = 'none';
        return;
    };
}