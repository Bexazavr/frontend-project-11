import validate from '../utils/validate';
import loadXML from '../utils/loadXML';

export default (state, elements, watchedState) => {
  elements.inputForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(event.target);
    const link = data.get(elements.inputField.name);
    validate(link.trim(), state)
      .then((url) => {
        watchedState.valid = true;
        watchedState.status = 'loading';
        loadXML(url, watchedState, state)
          .then(() => {
            watchedState.error = null;
          });
      })
      .catch((e) => {
        watchedState.valid = false;
        watchedState.error = e.message;
      });
  });
};
