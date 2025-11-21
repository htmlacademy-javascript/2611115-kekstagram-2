import { resetScale } from './scale.js';
import { resetEffects } from './effects.js';
import { sendData } from './api.js';

const HASHTAG_MAX_COUNT = 5;
const HASHTAG_MAX_LENGTH = 20;
const HASHTAG_MIN_LENGTH = 2;
const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;
const COMMENT_MAX_LENGTH = 140;

const HashtagError = {
  COUNT: 'count',
  DUPLICATE: 'duplicate',
  ONLY_HASH: 'only-hash',
  INVALID_FORMAT: 'invalid-format'
};

const errorMessages = {
  [HashtagError.COUNT]: `Превышено количество хэштегов (максимум ${HASHTAG_MAX_COUNT})`,
  [HashtagError.DUPLICATE]: 'Хэштеги не должны повторяться',
  [HashtagError.ONLY_HASH]: 'Хэштег не может состоять только из решётки',
  [HashtagError.INVALID_FORMAT]: `Хэштег должен начинаться с #, содержать только буквы и цифры, и быть длиной от ${HASHTAG_MIN_LENGTH} до ${HASHTAG_MAX_LENGTH} символов`
};

const form = document.querySelector('.img-upload__form');
const cancelButton = document.querySelector('.img-upload__cancel');
const hashtagInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');
const fileInput = form.querySelector('.img-upload__input');
const overlay = document.querySelector('.img-upload__overlay');
const submitButton = form.querySelector('.img-upload__submit');

let hashtagErrorMessage = '';

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--error',
  successClass: 'img-upload__field-wrapper--success',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'pristine-error'
});

const validateHashtags = (value) => {
  hashtagErrorMessage = '';
  if (!value.trim()) {
    return true;
  }

  const hashtags = value.trim().toLowerCase().split(/\s+/);

  if (hashtags.length > HASHTAG_MAX_COUNT) {
    hashtagErrorMessage = errorMessages[HashtagError.COUNT];
    return false;
  }

  const uniqueHashtags = new Set(hashtags);
  if (uniqueHashtags.size !== hashtags.length) {
    hashtagErrorMessage = errorMessages[HashtagError.DUPLICATE];
    return false;
  }

  for (const hashtag of hashtags) {
    if (hashtag === '#') {
      hashtagErrorMessage = errorMessages[HashtagError.ONLY_HASH];
      return false;
    }
    if (!HASHTAG_REGEX.test(hashtag)) {
      hashtagErrorMessage = errorMessages[HashtagError.INVALID_FORMAT];
      return false;
    }
  }

  return true;
};

const getHashtagErrorMessage = () => hashtagErrorMessage;

const validateComment = (value) => !value || value.length <= COMMENT_MAX_LENGTH;
const getCommentErrorMessage = () => `Длина комментария не может превышать ${COMMENT_MAX_LENGTH} символов`;

pristine.addValidator(hashtagInput, validateHashtags, getHashtagErrorMessage);
pristine.addValidator(commentInput, validateComment, getCommentErrorMessage);

const showMessage = (templateId) => {
  const template = document.querySelector(`#${templateId}`).content.querySelector(`.${templateId}`);
  const messageElement = template.cloneNode(true);
  document.body.appendChild(messageElement);


  messageElement.addEventListener('click', onMessageClick);
  document.addEventListener('keydown', onDocumentKeydown);
};
 const closeMessage = () => {
    messageElement.remove();
  };

  function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    closeMessage();
    document.removeEventListener('keydown', onDocumentKeydown);
  }
}

  const onMessageClick = (evt) => {
    if (evt.target === messageElement || evt.target.closest(`.${templateId}__button`)) {
      closeMessage();
      messageElement.removeEventListener('click', onMessageClick);
    }
  };
const openForm = () => {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

const resetForm = () => {
  form.reset();
  pristine.reset();
  resetScale();
  resetEffects();
};

const closeForm = () => {
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  resetForm();
};

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Отправляю...';
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
};

const onFileInputChange = (evt) => {
  if (evt.target.files && evt.target.files[0]) {
    openForm();
  }
};

const onCloseButtonClick = () => {
  closeForm();
};

function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    if (document.activeElement !== hashtagInput && document.activeElement !== commentInput) {
      closeForm();
    }
  }
}

const onFormSubmit = async (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();
  if (!isValid) {
    return;
  }

  const formData = new FormData(form);

  try {
    blockSubmitButton();
    await sendData(formData);
    closeForm();
    showMessage('success');
  } catch (error) {
    showMessage('error');
  } finally {
    unblockSubmitButton();
  }
};

const initFormHandlers = () => {
  fileInput.addEventListener('change', onFileInputChange);
  cancelButton.addEventListener('click', onCloseButtonClick);
  document.addEventListener('keydown', onDocumentKeydown);
  form.addEventListener('submit', onFormSubmit);

  hashtagInput.addEventListener('input', () => {
    pristine.validate(hashtagInput);
  });

  commentInput.addEventListener('input', () => {
    pristine.validate(commentInput);
  });
};

export { initFormHandlers };
