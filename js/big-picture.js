const body = document.body;
const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const socialCaption = bigPicture.querySelector('.social__caption');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCommentCount = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const cancelButton = bigPicture.querySelector('.big-picture__cancel');
const picturesContainer = document.querySelector('.pictures');


function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeBigPicture();
  }
}

function onOverlayClick(evt){
  if (evt.target === bigPicture) {
    closeBigPicture();
  }
}
function closeBigPicture() {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  cancelButton.removeEventListener('click', closeBigPicture);
  bigPicture.removeEventListener('click', onOverlayClick);
}

const createComment = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');
  commentElement.innerHTML = `
    <img class="social__picture" src="${comment.avatar}" alt="${comment.name}" width="35" height="35">
    <p class="social__text">${comment.message}</p>
  `;
  return commentElement;
};

const renderComments = (comments) => {
  socialComments.innerHTML = '';
  comments.forEach((comment) => {
    const commentElement = createComment(comment);
    socialComments.appendChild(commentElement);
  });
};

const openBigPicture = (pictureData) => {
  bigPictureImg.src = pictureData.url;
  likesCount.textContent = pictureData.likes;
  socialCaption.textContent = pictureData.description;
  const totalComments = pictureData.comments.length;

  bigPicture.querySelector('.social__comment-shown-count').textContent = totalComments;
  renderComments(pictureData.comments);
  socialCommentCount.classList.add('hidden');
  commentsLoader.classList.add('hidden');
  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');

  document.addEventListener('keydown', onDocumentKeydown);
  cancelButton.addEventListener('click', closeBigPicture);
  bigPicture.addEventListener('click', onOverlayClick);
};

const onPictureClick = (evt, picturesData) => {
  const pictureElement = evt.target.closest('.picture');
  if (pictureElement) {
    evt.preventDefault();
    const pictureId = parseInt(pictureElement.dataset.pictureId, 10);
    const pictureData = picturesData.find((item) => item.id === pictureId);
    if (pictureData) {
      openBigPicture(pictureData);
    }
  }
};

const initPictureHandlers = (picturesData) => {
  picturesContainer.addEventListener('click', (evt) => {
    onPictureClick(evt, picturesData);
  });
};

export { openBigPicture, initPictureHandlers };
