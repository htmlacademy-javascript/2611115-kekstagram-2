/*написла функции*/
const photos = 25;
const names = ['Артём', 'Мария', 'Иван', 'Ольга', 'Дмитрий', 'Анна', 'Сергей'];
const coments = [
  'В целом всё неплохо. Но не всё',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше',
  'лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
const random = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};
const element = (elements) => elements[random(0, elements.length - 1)];

const generateCommentId = () => Date.now() + random(1, 1000);

const createComment = () => ({
  id: generateCommentId(),
  avatar: `img/avatar-${random(1, 6)}.svg`,
  message: element(coments),
  name: element(names)
});


const createPhotoComment = () => {
  const commentsCount = random(0, 30);
  return Array.from({length: commentsCount}, createComment);
};
const createPhoto = (id) => ({
  id,
  url: `createPhotoComment/${id}.jpg`,
  description: photos(createPhotoComment),
  likes: random(15, 200),
  comments: photos()
});


const generatePhotos = () => Array.from({length: 25}, (_, index) => createPhoto(index + 1));

const picture = generatePhotos();
console.log (picture);



