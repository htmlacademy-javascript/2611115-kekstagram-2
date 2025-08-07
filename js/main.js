/*написла функции*/
const PHOTO_PICTURE = 25;
const COMMENT_NAMES = ['Артём', 'Мария', 'Иван', 'Ольга', 'Дмитрий', 'Анна', 'Сергей'];
const COMMENT_MESSAGES = [
  'В целом всё неплохо. Но не всё',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше',
  'лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const LANDSCAPE = [
  'Фото в прекрасный день',
  'Момент из путешествия',
  'Семейное фото',
  'Пейзаж за окном',
  'Фото с друзьями'
];
const CommentId = {
  MIN: 1,
  MAX: 1000
};

const Avatar = {
  MIN: 1,
  MAX: 6
};

const Like = {
  MIN: 15,
  MAX: 200
};
const Comment = {
  MIN: 0,
  MAX: 30
};


const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};


const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const createComment = () => ({
  id: Date.now() + getRandomInteger(CommentId.MIN, CommentId.MAX),
  avatar: `img/avatar-${getRandomInteger(Avatar.MIN, Avatar.MAX)}.svg`,
  message: getRandomArrayElement(COMMENT_MESSAGES),
  name: getRandomArrayElement(COMMENT_NAMES)
});
const createPhotoComments = () => {
  const commentsCount = getRandomInteger(Comment.MIN, Comment.MAX);
  return Array.from({length: commentsCount}, createComment);
};


const createPhoto = (id) => ({
  id,
  url: `createPhotoComment/${id}.jpg`,
  description: getRandomArrayElement(LANDSCAPE),
  likes: getRandomInteger(Like.MIN, Like.MAX),
  comments: createPhotoComments()
});


const generatePhotos = () => Array.from({length: PHOTO_PICTURE}, (_, index) => createPhoto(index + 1));

const photos = generatePhotos();
console.log(photos);


