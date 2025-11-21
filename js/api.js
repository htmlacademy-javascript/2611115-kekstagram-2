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

export { getData, sendData };

