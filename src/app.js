import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';

export default () => {
  const state = {
    url: [],
    valid: true,
    error: '',
  };

  i18next.init({
    lng: 'ru',
    resources: {
      ru: {
        translation: {
          success: 'RSS успешно загружен',
          invalidUrl: 'Ссылка должна быть валидным URL',
          existingUrl: 'RSS уже существует',
        },
      },
    },
  });

  const inputForm = document.querySelector('.rss-form');
  const inputField = document.querySelector('#url-input');

  const watchedState = onChange(state, (path, value) => {
    const pEl = document.querySelector('.feedback');
    if (state.valid) {
      pEl.textContent = i18next.t('success');
      pEl.classList.replace('text-danger', 'text-success');
      inputField.classList.remove('is-invalid');
      inputField.focus();
      inputField.value = '';
    } else {
      pEl.textContent = i18next.t(value);
      pEl.classList.replace('text-success', 'text-danger');
      inputField.classList.add('is-invalid');
    }
  });

  const schema = yup.string().required()
    .url('invalidUrl')
    .notOneOf([watchedState.url], 'existingUrl');

  inputForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const url = data.get('url');
    schema.validate(url).then(() => {
      watchedState.valid = true;
      watchedState.error = '';
      watchedState.url.push(url);
    })
      .catch((e) => {
        watchedState.valid = false;
        watchedState.error = e.message;
      });
  });
};