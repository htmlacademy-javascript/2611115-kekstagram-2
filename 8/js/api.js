
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
  if (hashtags.length > 5) {
    return false;
  }

  const uniqueHashtags = new Set(hashtags);
  if (uniqueHashtags.size !== hashtags.length) {
    return false;
  }


  const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/i;

  return hashtags.every((hashtag) => {

    if (hashtag === '#') {
      return false;
    }
    return hashtagRegex.test(hashtag);
  });
};

const getHashtagErrorMessage = (value) => {
  if (!value.trim()) {
    return '';
  }

  const hashtags = value.trim().toLowerCase().split(/\s+/);

  if (hashtags.length > 5) {
    return 'Превышено количество хэштегов (максимум 5)';
  }

  const uniqueHashtags = new Set(hashtags);
  if (uniqueHashtags.size !== hashtags.length) {
    return 'Хэштеги не должны повторяться';
  }

  const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/i;

  for (const hashtag of hashtags) {
    if (hashtag === '#') {
      return 'Хэштег не может состоять только из решётки';
    }
    if (!hashtagRegex.test(hashtag)) {
      return 'Неправильный хэштег';
    }
  }

  return '';
};


const validateComment = (value) => !value || value.length <= 140;

const getCommentErrorMessage = () => 'Длина комментария не может превышать 140 символов';


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


const setFormSubmit = (onSuccess, onFail) => {
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();

    if (!isValid) {
      return;
    }

    blockSubmitButton();

    const formData = new FormData(evt.target);

    fetch(
      'https://31.javascript.htmlacademy.pro/kekstagram',
      {
        method: 'POST',
        body: formData,
      },
    )
      .then((response) => {
        if (response.ok) {
          onSuccess();
          // eslint-disable-next-line no-use-before-define
          resetForm();
        } else {
          onFail();
        }
      })
      .catch(() => {
        onFail();
      })
      .finally(() => {
        unblockSubmitButton();
      });
  });
};


const resetForm = () => {
  form.reset();
  pristine.reset();

  const scaleControl = document.querySelector('.scale__control--value');
  scaleControl.value = '100%';

  const imagePreview = document.querySelector('.img-upload__preview img');
  imagePreview.style.transform = 'scale(1)';

  const originalEffect = document.querySelector('#effect-none');
  originalEffect.checked = true;

  const effectLevel = document.querySelector('.img-upload__effect-level');
  effectLevel.classList.add('hidden');

  imagePreview.style.filter = 'none';
  if (window.slider) {
    window.slider.updateOptions({
      start: 100,
      range: {
        'min': 0,
        'max': 100
      }
    });
  }
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


const showSuccessMessage = () => {
  const successTemplate = document.querySelector('#success').content.querySelector('.success');
  const successMessage = successTemplate.cloneNode(true);
  document.body.appendChild(successMessage);

  const removeMessage = () => {
    successMessage.remove();
    // eslint-disable-next-line no-use-before-define
    document.removeEventListener('keydown', onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      removeMessage();
    }
  };

  successMessage.querySelector('.success__button').addEventListener('click', removeMessage);
  successMessage.addEventListener('click', (evt) => {
    if (evt.target === successMessage) {
      removeMessage();
    }
  });
  document.addEventListener('keydown', onEscKeyDown);
};

const showErrorMessage = () => {
  const errorTemplate = document.querySelector('#error').content.querySelector('.error');
  const errorMessage = errorTemplate.cloneNode(true);
  document.body.appendChild(errorMessage);

  const removeMessage = () => {
    errorMessage.remove();
    // eslint-disable-next-line no-use-before-define
    document.removeEventListener('keydown', onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      removeMessage();
    }
  };

  errorMessage.querySelector('.error__button').addEventListener('click', removeMessage);
  errorMessage.addEventListener('click', (evt) => {
    if (evt.target === errorMessage) {
      removeMessage();
    }
  });
  document.addEventListener('keydown', onEscKeyDown);
};

setFormSubmit(showSuccessMessage, showErrorMessage);
