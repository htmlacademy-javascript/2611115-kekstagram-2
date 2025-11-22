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

export { getData, sendData };
