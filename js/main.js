
import { generatePhotos } from './data.js';
import { renderThumbnails } from './thumbnail.js';
renderThumbnails();
const photos = generatePhotos();
// eslint-disable-next-line no-console
console.log(photos);


