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

const showMessage = (templateId, closeCallback = null) => {
  const template = document.querySelector(`#${templateId}`).content.querySelector(`.${templateId}`);
  const messageElement = template.cloneNode(true);
  document.body.appendChild(messageElement);

  const closeMessage = () => {
    messageElement.remove();
    if (closeCallback) {
      closeCallback();
    }
  };

  const onDocumentKeydown = (evt) => {
    if (evt.key === 'Escape') {
      closeMessage();
      document.removeEventListener('keydown', onDocumentKeydown);
    }
  };

  const onMessageClick = (evt) => {
    if (evt.target === messageElement || evt.target.closest(`.${templateId}__button`)) {
      closeMessage();
      messageElement.removeEventListener('click', onMessageClick);
    }
  };

  messageElement.addEventListener('click', onMessageClick);
  document.addEventListener('keydown', onDocumentKeydown);
};

const load = async (route, method = Method.GET, body = null) => {
  const response = await fetch(`${BASE_URL}${route}`, {
    method,
    body,
  });

  if (!response.ok) {
    throw new Error(ErrorText[method]);
  }

  return response.json();
};

const getData = async () => load(Route.GET_DATA);

const sendData = async (body) => load(Route.SEND_DATA, Method.POST, body);

const initFormHandlers = () => {
  const form = document.querySelector('.img-upload__form');
  const overlay = document.querySelector('.img-upload__overlay');
  const cancelButton = document.querySelector('.img-upload__cancel');
  const fileInput = document.querySelector('.img-upload__input');
  const submitButton = document.querySelector('.img-upload__submit');
  const scaleControl = document.querySelector('.scale__control--value');
  const effectLevel = document.querySelector('.img-upload__effect-level');

  const pristine = new Pristine(form, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--error',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    errorTextClass: 'pristine-error'
  });

  const resetForm = () => {
    form.reset();
    scaleControl.value = '100%';
    document.querySelector('#effect-none').checked = true;
    effectLevel.classList.add('hidden');
    pristine.reset();
  };

  const closeForm = () => {
    overlay.classList.add('hidden');
    document.body.classList.remove('modal-open');
    resetForm();
  };

  const onCancelButtonClick = () => {
    closeForm();
  };

  const onDocumentKeydown = (evt) => {
    if (evt.key === 'Escape' && !evt.target.closest('.text__hashtags') && !evt.target.closest('.text__description')) {
      closeForm();
    }
  };

  const onFileInputChange = () => {
    overlay.classList.remove('hidden');
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', onDocumentKeydown);
  };

  const blockSubmitButton = () => {
    submitButton.disabled = true;
    submitButton.textContent = 'Отправляю...';
  };

  const unblockSubmitButton = () => {
    submitButton.disabled = false;
    submitButton.textContent = 'Опубликовать';
  };

  const onFormSubmit = async (evt) => {
    evt.preventDefault();

    if (!pristine.validate()) {
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

  fileInput.addEventListener('change', onFileInputChange);
  cancelButton.addEventListener('click', onCancelButtonClick);
  form.addEventListener('submit', onFormSubmit);
};

export { getData, sendData, initFormHandlers };
