import './styles.scss';
import 'bootstrap';

import onChange from 'on-change';

import validateFeedUrl from './validate.js';

const formEl = document.querySelector('.rss-form');
const inputEl = formEl.querySelector('#url-input');
const feedbackEl = document.querySelector('.feedback');

const renderInput = (inputState) => {
  const classListMethod = inputState.isValid ? 'remove' : 'add';
  inputEl.classList[classListMethod]('is-invalid');
  inputEl.value = inputState.value;
  feedbackEl.textContent = inputState.errorMessage;
};

const render = ({ input }) => {
  renderInput(input);
};

function onChangeState() { render(this); }

const state = onChange({
  feeds: [],
  input: {
    value: '',
    isValid: true,
    errorMessage: '',
  },
}, onChangeState);

const onInput = () => {
  state.input.value = inputEl.value;
};

const onSubmit = (event) => {
  event.preventDefault();

  const newFeedUrl = inputEl.value;

  validateFeedUrl(newFeedUrl, state.feeds)
    .then(({ isValid, errorMessage }) => {
      state.input.isValid = isValid;
      state.input.errorMessage = errorMessage;

      if (!isValid) return;

      state.feeds.push(newFeedUrl);
      state.input.value = '';
    });
};

inputEl.addEventListener('input', onInput);
formEl.addEventListener('submit', onSubmit);
