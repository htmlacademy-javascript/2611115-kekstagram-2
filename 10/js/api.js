

const BASE_URL = 'https://31.javascript.htmlacademy.pro/kekstagram';

const Route = {
  GET_DATA: '/data',
  SEND_DATA: '/',
};

const Method = {
  GET: 'GET',
  POST: 'POST',
};

const ErrorText = {
  [Method.GET]: 'Не удалось загрузить данные. Попробуйте обновить страницу',
  [Method.POST]: 'Не удалось отправить форму. Попробуйте ещё раз',
};

const showErrorMessage = (message) => {
  const errorTemplate = document.querySelector('#data-error').content.querySelector('.data-error');
  const errorElement = errorTemplate.cloneNode(true);

  const errorTitle = errorElement.querySelector('.data-error__title');
  errorTitle.textContent = message;

  document.body.appendChild(errorElement);

  setTimeout(() => {
    errorElement.remove();
  }, 5000);
};

const load = async (route, method = Method.GET, body = null) => {
  try {
    const response = await fetch(`${BASE_URL}${route}`, {
      method,
      body,
    });

    if (!response.ok) {
      throw new Error(ErrorText[method]);
    }

    return await response.json();
  } catch (error) {
    if (method === Method.GET) {
      showErrorMessage(ErrorText[method]);
    }
    throw error;
  }
};

const getData = async () => load(Route.GET_DATA);
const sendData = async (body) => load(Route.SEND_DATA, Method.POST, body);

const renderPhotos = (photos) => {
  const picturesContainer = document.querySelector('.pictures');
  const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

  const existingPictures = picturesContainer.querySelectorAll('.picture');
  existingPictures.forEach((picture) => picture.remove());

  const picturesFragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const pictureElement = pictureTemplate.cloneNode(true);

    const img = pictureElement.querySelector('.picture__img');
    img.src = photo.url;
    img.alt = photo.description;

    const likes = pictureElement.querySelector('.picture__likes');
    likes.textContent = photo.likes;

    const comments = pictureElement.querySelector('.picture__comments');
    comments.textContent = photo.comments.length;

    pictureElement.dataset.photoId = photo.id;

    picturesFragment.appendChild(pictureElement);
  });

  picturesContainer.appendChild(picturesFragment);
};

const initBigPictureHandlers = (photos) => {
  const picturesContainer = document.querySelector('.pictures');
  const bigPicture = document.querySelector('.big-picture');
  const closeButton = bigPicture.querySelector('.big-picture__cancel');
  const socialComments = bigPicture.querySelector('.social__comments');
  const commentsCount = bigPicture.querySelector('.social__comment-count');
  const commentsLoader = bigPicture.querySelector('.comments-loader');

  let currentPhoto = null;
  let shownComments = 0;
  const COMMENTS_PER_LOAD = 5;

  const createCommentElement = (comment) => {
    const commentTemplate = document.querySelector('#social-comment').content.querySelector('.social__comment');
    const commentElement = commentTemplate.cloneNode(true);

    const avatar = commentElement.querySelector('.social__picture');
    avatar.src = comment.avatar;
    avatar.alt = comment.name;

    const text = commentElement.querySelector('.social__text');
    text.textContent = comment.message;

    return commentElement;
  };

  const loadMoreComments = () => {
    const commentsToShow = currentPhoto.comments.slice(shownComments, shownComments + COMMENTS_PER_LOAD);
    commentsToShow.forEach((comment) => {
      socialComments.appendChild(createCommentElement(comment));
    });


    shownComments += commentsToShow.length;

    commentsCount.innerHTML = `${shownComments} из <span class="comments-count">${currentPhoto.comments.length}</span> комментариев`;

    if (shownComments >= currentPhoto.comments.length) {
      commentsLoader.classList.add('hidden');
    } else {
      commentsLoader.classList.remove('hidden');
    }
  };

  const openBigPicture = (photo) => {
    currentPhoto = photo;
    shownComments = 0;

    bigPicture.querySelector('.big-picture__img img').src = photo.url;
    bigPicture.querySelector('.big-picture__img img').alt = photo.description;
    bigPicture.querySelector('.likes-count').textContent = photo.likes;
    bigPicture.querySelector('.social__caption').textContent = photo.description;
    bigPicture.querySelector('.comments-count').textContent = photo.comments.length;


    bigPicture.classList.remove('hidden');
    document.body.classList.add('modal-open');
  };

  const onPictureClick = (evt) => {
    const pictureElement = evt.target.closest('.picture');
    if (pictureElement) {
      const photoId = parseInt(pictureElement.dataset.photoId, 10);
      const photo = photos.find((p) => p.id === photoId);
      if (photo) {
        openBigPicture(photo);
      }
    }
  };

  const closeBigPicture = () => {
    bigPicture.classList.add('hidden');
    document.body.classList.remove('modal-open');
    currentPhoto = null;
  };

  const onEscKeydown = (evt) => {
    if (evt.key === 'Escape' && !bigPicture.classList.contains('hidden')) {
      closeBigPicture();
    }
  };

  const onCommentsLoaderClick = () => {
    loadMoreComments();
  };

  const onOverlayClick = (evt) => {
    if (evt.target === bigPicture) {
      closeBigPicture();
    }
  };

  picturesContainer.addEventListener('click', onPictureClick);
  closeButton.addEventListener('click', closeBigPicture);
  commentsLoader.addEventListener('click', onCommentsLoaderClick);
  document.addEventListener('keydown', onEscKeydown);
  bigPicture.addEventListener('click', onOverlayClick);
};

const initPhotosModule = async () => {
  try {
    const photos = await getData();
    renderPhotos(photos);
    initBigPictureHandlers(photos);
  } catch (error) { /* empty */ }
};

document.addEventListener('DOMContentLoaded', () => {
  initPhotosModule();
});

export { getData, sendData, initPhotosModule };
