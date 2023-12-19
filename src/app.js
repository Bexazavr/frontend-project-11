import onChange from 'on-change';
import axios from 'axios';
import * as yup from 'yup';
import render from './view';
import {
  fetchData,
  parseData,
  handleData,
  updatePosts,
} from './utils/getRss';

const validate = (inputUrl, feeds) => {
  yup.setLocale({
    mixed: {
      required: 'form.feedback.required',
      notOneOf: 'form.feedback.notOneOf',
    },
    string: {
      url: 'form.feedback.invalidUrl',
    },
  });

  const schema = yup
    .string()
    .trim()
    .required()
    .url()
    .notOneOf(feeds);

  return schema.validate(inputUrl);
};

const handleError = (error) => {
  if (error.isParsingError) {
    return 'form.feedback.invalidRss';
  }
  if (axios.isAxiosError(error)) {
    return 'form.feedback.networkError';
  }
  return error.message;
};

const app = (i18nextInstance) => {
  const refreshTime = 5000;

  const initialState = {
    rssForm: {
      addingNewFeedState: 'ready',
      error: null,
    },
    rssFeeds: [],
    rssPosts: [],
    uiState: {
      viewedPostIds: new Set(),
    },
    modal: {
      post: null,
    },
  };

  const elements = {
    form: document.querySelector('form.rss-form'),
    input: document.getElementById('url-input'),
    submitButton: document.querySelector('button[type="submit"]'),
    feedbackEl: document.querySelector('p.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
    modalEl: document.getElementById('modal'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    closeModalButtons: document.querySelectorAll('#modal button[data-bs-dismiss="modal"]'),
    readAllModalButton: document.querySelector('#modal a.full-article'),
  };

  const state = onChange(initialState, render(elements, initialState, i18nextInstance));

  const {
    rssForm,
    modal,
    rssFeeds,
    rssPosts,
    uiState,
  } = state;

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    rssForm.addingNewFeedState = 'validating';
    const formData = new FormData(e.target);
    const url = formData.get('url');
    const feeds = rssFeeds.map(({ link }) => link);
    validate(url, feeds)
      .then(() => {
        rssForm.addingNewFeedState = 'valid';
        rssForm.error = null;
        rssForm.addingNewFeedState = 'loading';
        return fetchData(url);
      })
      .then((response) => {
        const data = parseData(response.data.contents);
        handleData(data, state, url);
        rssForm.addingNewFeedState = 'success';
        rssForm.addingNewFeedState = 'ready';
      })
      .catch((error) => {
        rssForm.error = handleError(error);
        rssForm.addingNewFeedState = 'invalid';
      });
  });

  elements.modalEl.addEventListener('show.bs.modal', (e) => {
    const button = e.relatedTarget;
    const selectedId = button.getAttribute('data-bs-id');
    const selectedPost = rssPosts.find(({ id }) => id === selectedId);
    if (selectedPost) {
      selectedPost.viewed = true;
      uiState.viewedPostIds.add(selectedId);
      modal.post = selectedPost;
    }
  });

  setTimeout(() => updatePosts(state, refreshTime), refreshTime);
};

export default app;
