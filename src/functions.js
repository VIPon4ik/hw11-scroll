'use strict';

import Notiflix from 'notiflix';
import axios from 'axios';

const apiKey = '19760378-d2f1c7488e9d6752a9d7092b3';
const axiosOptions = {
  key: apiKey,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
};

export async function gettingApiImages(query, page) {
    try {
      const response = await axios.get('https://pixabay.com/api/', {
        params: { ...axiosOptions, q: query, page: page },
      });
      const data = await response.data;
      return data;
    } catch (error) {
      Notiflix.Notify.failure('Sorry, there are problems with API.');
    }
};
  
export function markupImages(images, galleryElem) {
    images.forEach(img => {
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
            `;
        galleryElem.insertAdjacentHTML('beforeend', imgMarkup);
    });
};