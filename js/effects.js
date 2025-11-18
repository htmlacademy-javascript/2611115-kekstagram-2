const imagePreview = document.querySelector('.img-upload__preview img');
const effectLevelContainer = document.querySelector('.img-upload__effect-level');
const effectLevelValue = document.querySelector('.effect-level__value');
const effectLevelValueInput = document.querySelector('.effect-level__value-input');
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

function initSlider() {
  noUiSlider.create(effectLevelSlider, {
    range: {
      min: 0,
      max: 100
    },
    start: 100,
    step: 1,
    connect: 'lower',
    format: {
      to: function (value) {
        return value.toFixed(0);
      },
      from: function (value) {
        return parseFloat(value);
      }
    }
  });

  effectLevelSlider.noUiSlider.on('update', (values, handle) => {
    const value = parseFloat(values[handle]);
    updateEffect(value);
  });
}

function updateEffect(value) {
  const effect = effectsConfig[currentEffect];
  effectLevelValue.textContent = `${Math.round(value)}%`;
  effectLevelValueInput.value = value;
  const filterValue = effect.filter(value);
  imagePreview.style.filter = filterValue;
}

function switchEffect(effectName) {
  currentEffect = effectName;

  if (effectName === 'none') {
    effectLevelContainer.style.display = 'none';
    imagePreview.style.filter = '';
    effectLevelValueInput.value = '';
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
        to: function (value) {
          if (effectName === 'chrome' || effectName === 'sepia') {
            return value.toFixed(1);
          }
          return value.toFixed(effectName === 'marvin' ? 0 : 1);
        },
        from: function (value) {
          return parseFloat(value);
        }
      }
    });
    effectLevelSlider.noUiSlider.set(effect.max);
  }
}

function resetEffects() {
  switchEffect('none');

  const noneRadio = document.querySelector('input[value="none"]');
  if (noneRadio) {
    noneRadio.checked = true;
  }
}

effectRadios.forEach((radio) => {
  radio.addEventListener('change', (evt) => {
    switchEffect(evt.target.value);
  });
});

function initEffects() {
  initSlider();
  switchEffect('none');
}

document.addEventListener('DOMContentLoaded', initEffects);

export { resetEffects, switchEffect };
