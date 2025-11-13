const HASHTAG_MAX_COUNT = 5;
const HASHTAG_MAX_LENGTH = 20;
const HASHTAG_MIN_LENGTH = 2;
const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;
const COMMENT_MAX_LENGTH = 140;

const submitButton = document.querySelector('.img-upload__submit');
const form = document.querySelector('.img-upload__form');

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Отправляю...';
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Отправить';
};

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--error',
  successClass: 'img-upload__field-wrapper--success',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'pristine-error'
});

const validateHashtags = (value) => {
  if (!value.trim()) {
    return true;
  }

  const hashtags = value.trim().toLowerCase().split(/\s+/);
  if (hashtags.length > HASHTAG_MAX_COUNT) {
    return false;
  }

  const uniqueHashtags = new Set(hashtags);
  if (uniqueHashtags.size !== hashtags.length) {
    return false;
  }

  return hashtags.every((hashtag) => {
    if (hashtag === '#') {
      return false;
    }
    return HASHTAG_REGEX.test(hashtag);
  });
};

const getHashtagErrorMessage = (value) => {
  if (!value.trim()) {
    return '';
  }

  const hashtags = value.trim().toLowerCase().split(/\s+/);

  if (hashtags.length > HASHTAG_MAX_COUNT) {
    return `Превышено количество хэштегов (максимум ${HASHTAG_MAX_COUNT})`;
  }

  const uniqueHashtags = new Set(hashtags);
  if (uniqueHashtags.size !== hashtags.length) {
    return 'Хэштеги не должны повторяться';
  }

  for (const hashtag of hashtags) {
    if (hashtag === '#') {
      return 'Хэштег не может состоять только из решётки';
    }
    if (!HASHTAG_REGEX.test(hashtag)) {
      return `Хэштег должен начинаться с #, содержать только буквы и цифры, и быть длиной от ${HASHTAG_MIN_LENGTH} до ${HASHTAG_MAX_LENGTH} символов`;
    }
  }

  return '';
};

const validateComment = (value) => !value || value.length <= COMMENT_MAX_LENGTH;

const getCommentErrorMessage = () => `Длина комментария не может превышать ${COMMENT_MAX_LENGTH} символов`;

pristine.addValidator(
  form.querySelector('.text__hashtags'),
  validateHashtags,
  getHashtagErrorMessage
);

pristine.addValidator(
  form.querySelector('.text__description'),
  validateComment,
  getCommentErrorMessage
);

const resetForm = () => {
  form.reset();
  pristine.reset();
};

const closeForm = () => {
  const overlay = document.querySelector('.img-upload__overlay');
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  resetForm();
};

const cancelButton = document.querySelector('.img-upload__cancel');
cancelButton.addEventListener('click', closeForm);

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    const hashtagInput = document.querySelector('.text__hashtags');
    const commentInput = document.querySelector('.text__description');

    if (document.activeElement !== hashtagInput && document.activeElement !== commentInput) {
      closeForm();
    }
  }
});
form.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const isValid = pristine.validate();
  if (!isValid) {
    return;
  }
  console.log('Форма валидна, можно отправлять');
});
