import { generatePhotos } from './data.js';


const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

const createThumbnail = (photoData) => {
  const thumbnail = pictureTemplate.cloneNode(true);

  const image = thumbnail.querySelector('.picture__img');
  image.src = photoData.url;
  image.alt = photoData.description;
  thumbnail.querySelector('.picture__likes').textContent = photoData.likes;
  thumbnail.querySelector('.picture__comments').textContent = photoData.comments.length;
  thumbnail.dataset.photoId = photoData.id;
  return thumbnail;
};
const renderThumbnails = () => {
  const photos = generatePhotos();
  const fragment = document.createDocumentFragment();
  photos.forEach((photo) => {
    const thumbnail = createThumbnail(photo);
    fragment.appendChild(thumbnail);
  });
  picturesContainer.appendChild(fragment);
};
export { renderThumbnails };
