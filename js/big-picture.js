const body = document.querySelector('body');
const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const socialCaption = bigPicture.querySelector('.social__caption');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCommentCount = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const cancelButton = bigPicture.querySelector('.big-picture__cancel');

let onDocumentKeydown = null;

const createComment = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');
  commentElement.innerHTML = `
    <img
      class="social__picture"
      src="${comment.avatar}"
      alt="${comment.name}"
      width="35" height="35">
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

const closeBigPicture = () => {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
  if (onDocumentKeydown) {
    document.removeEventListener('keydown', onDocumentKeydown);
    onDocumentKeydown = null;
  }
  const onOverlayClick = (evt) => {
    if (evt.target === bigPicture) {
      closeBigPicture();
    }
  };

  cancelButton.removeEventListener('click', closeBigPicture);
  bigPicture.removeEventListener('click', onOverlayClick);
};


const openBigPicture = (pictureData) => {
  bigPictureImg.src = pictureData.url;
  likesCount.textContent = pictureData.likes;
  socialCaption.textContent = pictureData.description;
  const totalComments = pictureData.comments.length;
  bigPicture.querySelector('.social__comment-total-count').textContent = totalComments;
  bigPicture.querySelector('.social__comment-shown-count').textContent = totalComments;
  renderComments(pictureData.comments);
  socialCommentCount.classList.add('hidden');
  commentsLoader.classList.add('hidden');
  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');
  onDocumentKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeBigPicture();
    }
  };
  document.addEventListener('keydown', onDocumentKeydown);
  cancelButton.addEventListener('click', closeBigPicture);
  // eslint-disable-next-line no-undef
  bigPicture.addEventListener('click', onOverlayClick);
};

export { openBigPicture };

