'use strict';

import { gettingApiImages, markupImages } from './functions';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const throttle = require('lodash.throttle');

const formElem = document.querySelector('form');
const galleryElem = document.querySelector('.gallery');
const inputElem = document.querySelector('input');

let inputValue = '';
let page = 1;
let hasEventListener = false;

const lightbox = new SimpleLightbox('.photo-card a');

inputElem.addEventListener('input', () => {
    inputValue = inputElem.value;
    window.removeEventListener('scroll', throttleFunction);
    hasEventListener = false;
});

formElem.addEventListener('submit', event => {
    event.preventDefault();

    if (!hasEventListener) {
      window.addEventListener('scroll', throttleFunction);
      hasEventListener = true;
    };

    page = 1;
    galleryElem.innerHTML = '';

    generatingImages(inputValue, page);
});

function handleScroll() {
    if (window.innerHeight + window.scrollY + 100 >= document.body.offsetHeight) {
        page++;
        generatingImages(inputValue, page);
    }
};

const throttleFunction = throttle((handleScroll), 1000);

async function generatingImages(q, page) {
    const data = await gettingApiImages(q, page);

    if (!data.hits.length) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        window.removeEventListener('scroll', throttleFunction);
        hasEventListener = false;
        galleryElem.innerHTML = '';
        return;
    };
      
    markupImages(data.hits, galleryElem);
    lightbox.refresh();
    
    if (data.totalHits === galleryElem.childElementCount || galleryElem.childElementCount >= 500) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        window.removeEventListener('scroll', throttleFunction);
        hasEventListener = false;
        return;
    };
}
