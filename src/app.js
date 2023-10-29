import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';

const handleValid = (elements, validationState) => {
  if (validationState) {
    elements.feedBack.textContent = i18next.t('success');
    elements.feedBack.classList.replace('text-danger', 'text-success');
    elements.inputField.classList.remove('is-invalid');
    elements.inputField.focus();
    elements.inputField.value = '';
  }
};

const handleError = (elements, errorState) => {
  if (errorState.length > 0) {
    elements.feedBack.textContent = i18next.t(errorState);
    elements.feedBack.classList.replace('text-success', 'text-danger');
    elements.inputField.classList.add('is-invalid');
  }
};

const renderFeeds = (elements, feed) => {
  if (!elements.feedsContainer.querySelector('.card')) {
    const card = document.createElement('div');
    card.classList.add('card', 'border-0');
    elements.feedsContainer.append(card);
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    card.append(cardBody);
    const h2El = document.createElement('h2');
    h2El.classList.add('card-title', 'h4');
    h2El.textContent = 'Фиды';
    cardBody.append(h2El);
    const ulEl = document.createElement('ul');
    ulEl.classList.add('list-group', 'border-0', 'rounded-0');
    card.append(ulEl);
  }
  const { title } = feed;
  const { description } = feed;
  const liEl = document.createElement('li');
  liEl.classList.add('list-group-item', 'border-0', 'border-end-0');
  elements.feedsContainer.querySelector('ul').prepend(liEl);
  const hEl = document.createElement('h3');
  hEl.classList.add('h6', 'm-0');
  hEl.textContent = title;
  const pEl = document.createElement('p');
  pEl.classList.add('m-0', 'small', 'text-black-50');
  pEl.textContent = description;
  liEl.append(hEl);
  liEl.append(pEl);
};

const renderPosts = (elements, posts) => {
  if (!elements.postsContainer.querySelector('.card')) {
    const card = document.createElement('div');
    card.classList.add('card', 'border-0');
    elements.postsContainer.append(card);
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    card.append(cardBody);
    const h2El = document.createElement('h2');
    h2El.classList.add('card-title', 'h4');
    h2El.textContent = 'Посты';
    cardBody.append(h2El);
    const ulEl = document.createElement('ul');
    ulEl.classList.add('list-group', 'border-0', 'rounded-0');
    card.append(ulEl);
  }
  const liEl = document.createElement('li');
  liEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
  const link = document.createElement('a');
  link.classList.add('fw-bold');
  link.setAttribute('href', posts.link);
  link.textContent = posts.title;
  elements.postsContainer.querySelector('ul').append(liEl);
  liEl.append(link);
};

export default () => {
  const state = {
    urls: [],
    valid: null,
    error: '',
    status: 'none',
    feeds: [],
    posts: [],
  };

  const render = (elements) => (path, value) => {
    switch (path) {
      case 'valid':
        handleValid(elements, value);
        break;
      case 'error':
        handleError(elements, value);
        break;
      case 'feeds':
        renderFeeds(elements, value[value.length - 1]);
        break;
      case 'posts':
        renderPosts(elements, value[value.length - 1]);
        break;
      default:
        break;
    }
  };

  i18next.init({
    lng: 'ru',
    resources: {
      ru: {
        translation: {
          success: 'RSS успешно загружен',
          invalidUrl: 'Ссылка должна быть валидным URL',
          existingUrl: 'RSS уже существует',
          notValidRSS: 'Ресурс не содержит валидный RSS',
        },
      },
    },
  });

  const elements = {
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
    inputForm: document.querySelector('.rss-form'),
    inputField: document.querySelector('#url-input'),
    feedBack: document.querySelector('.feedback'),
  };

  const watchedState = onChange(state, render(elements));

  const schema = yup.string().required()
    .url('invalidUrl')
    .notOneOf([watchedState.urls], 'existingUrl');

  elements.inputForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const url = data.get('url');
    schema.validate(url.trim()).then(() => {
      watchedState.valid = true;
      watchedState.error = '';
      watchedState.urls.push(url);
      axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
        .then((r) => {
          const response = new DOMParser();
          const xmlDocument = response.parseFromString(r.data.contents, 'text/html');
          if (!xmlDocument.querySelector('channel')) {
            watchedState.valid = false;
            watchedState.error = 'notValidRSS';
          }
          const feed = {
            id: watchedState.feeds.length + 1,
            title: xmlDocument.querySelector('title').textContent,
            description: xmlDocument.querySelector('description').textContent,
          };
          watchedState.feeds.push(feed);
          const items = xmlDocument.querySelectorAll('item');
          items.forEach((item) => {
            const post = {
              id: feed.id,
              title: item.querySelector('title').textContent,
              link: item.querySelector('link').nextSibling.textContent,
            };
            watchedState.posts.push(post);
          });

          watchedState.status = 'parsing';
        })
        .catch((e) => console.log(e));
    })
      .catch((e) => {
        watchedState.valid = false;
        watchedState.error = e.message;
      });
  });
};
