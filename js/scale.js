const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;

const scaleControlValue = document.querySelector('.scale__control--value');
const scaleControlSmaller = document.querySelector('.scale__control--smaller');
const scaleControlBigger = document.querySelector('.scale__control--bigger');
const imagePreview = document.querySelector('.img-upload__preview img');

let currentScale = SCALE_DEFAULT;

const updateScale = (value) => {
  currentScale = Math.max(SCALE_MIN, Math.min(SCALE_MAX, value));
  scaleControlValue.value = `${currentScale}%`;
  const scaleValue = currentScale / 100;
  imagePreview.style.transform = `scale(${scaleValue})`;
};

const onScaleSmallerClick = () => {
  updateScale(currentScale - SCALE_STEP);
};

const onScaleBiggerClick = () => {
  updateScale(currentScale + SCALE_STEP);
};

const resetScale = () => {
  updateScale(SCALE_DEFAULT);
};

scaleControlSmaller.addEventListener('click', onScaleSmallerClick);
scaleControlBigger.addEventListener('click', onScaleBiggerClick);

export { resetScale, updateScale, currentScale };
