import i18next from 'i18next';
import render from './view.js';
import formControl from './controllers/form-control.js';
import postsControl from './controllers/posts-control.js';
import resources from './locales/ru.js';

export default () => {
  const state = {
    urls: [],
    valid: null,
    error: '',
    status: 'awaiting',
    feeds: [],
    posts: [],
    modalWindowId: null,
    visitedLinksIds: new Set(),
  };

  const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
    debug: true,
    resources,
  });

  const elements = {
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
    inputForm: document.querySelector('.rss-form'),
    inputField: document.querySelector('#url-input'),
    inputButton: document.querySelector('[type="submit"]'),
    feedBack: document.querySelector('.feedback'),
    modal: {
      title: document.querySelector('.modal-title'),
      body: document.querySelector('.modal-body'),
      footer: document.querySelector('.modal-footer'),
    },
  };

  const view = render(state, elements, i18n);

  formControl(state, elements, view);
  postsControl(elements, view);
};
