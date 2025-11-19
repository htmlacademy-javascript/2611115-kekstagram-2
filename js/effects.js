const imagePreview = document.querySelector('.img-upload__preview img');
const effectLevelContainer = document.querySelector('.img-upload__effect-level');
const effectLevelValue = document.querySelector('.effect-level__value');
const effectLevelSlider = document.querySelector('.effect-level__slider');
const effectRadios = document.querySelectorAll('input[name="effect"]');

let currentEffect = 'none';

const effectsConfig = {
  none: {
    min: 0,
    max: 100,
    step: 1,
    unit: '',
    filter: () => ''
  },
  chrome: {
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
    filter: (value) => `grayscale(${value})`
  },
  sepia: {
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
    filter: (value) => `sepia(${value})`
  },
  marvin: {
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
    filter: (value) => `invert(${value}%)`
  },
  phobos: {
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'px',
    filter: (value) => `blur(${value}px)`
  },
  heat: {
    min: 1,
    max: 3,
    step: 0.1,
    unit: '',
    filter: (value) => `brightness(${value})`
  }
};

const initSlider = () => {
  noUiSlider.create(effectLevelSlider, {
    range: {
      min: 0,
      max: 100
    },
    start: 100,
    step: 1,
    connect: 'lower',
    format: {
      to: (value) => value.toFixed(0),
      from: (value) => parseFloat(value)
    }
  });
  const updateEffect = (value) => {
    const effect = effectsConfig[currentEffect];
    effectLevelValue.value = value;
    const filterValue = effect.filter(value);
    imagePreview.style.filter = filterValue;
  };

  effectLevelSlider.noUiSlider.on('update', (values, handle) => {
    const value = parseFloat(values[handle]);
    updateEffect(value);
  });
};


const switchEffect = (effectName) => {
  currentEffect = effectName;

  if (effectName === 'none') {
    effectLevelContainer.style.display = 'none';
    imagePreview.style.filter = '';
    effectLevelValue.value = '';
  } else {
    effectLevelContainer.style.display = 'block';

    const effect = effectsConfig[effectName];
    effectLevelSlider.noUiSlider.updateOptions({
      range: {
        min: effect.min,
        max: effect.max
      },
      step: effect.step,
      start: effect.max,
      format: {
        to: (value) => {
          if (effectName === 'chrome' || effectName === 'sepia') {
            return value.toFixed(1);
          }
          return value.toFixed(effectName === 'marvin' ? 0 : 1);
        },
        from: (value) => parseFloat(value)
      }
    });
    effectLevelSlider.noUiSlider.set(effect.max);
  }
};

const resetEffects = () => {
  switchEffect('none');

  const noneRadio = document.querySelector('input[value="none"]');
  if (noneRadio) {
    noneRadio.checked = true;
  }
};

effectRadios.forEach((radio) => {
  radio.addEventListener('change', (evt) => {
    switchEffect(evt.target.value);
  });
});

const initEffects = () => {
  initSlider();
  switchEffect('none');
};

document.addEventListener('DOMContentLoaded', () => {
  initEffects();
});

export { resetEffects };
