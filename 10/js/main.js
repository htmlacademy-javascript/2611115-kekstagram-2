import { initPictureHandlers } from './big-picture.js';
import { generatePhotos } from './data.js';
import { renderThumbnails } from './thumbnails.js';
import './form.js';
import { getData } from './fetch.js';

const loadPhotos = async () => {
  try {
    const photos = await getData();
    renderThumbnails(photos);
    initPictureHandlers(photos);
  } catch (error) {

    const photos = generatePhotos();
    renderThumbnails(photos);
    initPictureHandlers(photos);
  }
};
loadPhotos();


