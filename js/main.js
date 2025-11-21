import { initPictureHandlers } from './big-picture.js';
import { renderThumbnails } from './thumbnails.js';
import './form.js';
import { getData } from './fetch.js';

const loadPhotos = async () => {
  try {
    const photos = await getData();
    renderThumbnails(photos);
    initPictureHandlers(photos);
  } catch (error) { /* empty */ }
};
loadPhotos();


