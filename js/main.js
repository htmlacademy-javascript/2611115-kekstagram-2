import { initPictureHandlers } from './big-picture.js';
import { renderThumbnails } from './thumbnails.js';
import { getData } from './fetch.js';
import { showErrorMessage } from './util.js';
import { initFormHandlers } from './form.js';

const loadPhotos = async () => {
  try {
    const photos = await getData();
    renderThumbnails(photos);
    initPictureHandlers(photos);
  } catch (error) {
    showErrorMessage();
  }
};
loadPhotos();

initFormHandlers();


