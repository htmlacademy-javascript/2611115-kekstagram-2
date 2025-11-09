import { initPictureHandlers } from './big-picture.js';
import { generatePhotos } from './data.js';
import { renderThumbnails } from './thumbnails.js';
const photos = generatePhotos();
renderThumbnails(photos);
initPictureHandlers(photos);

