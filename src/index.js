import './styles.scss';
import 'bootstrap';
import i18next from 'i18next';
import app from './app';
import resources from './locales/index.js';

const init = () => {
  const defaultLanguage = 'ru';
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  })
    .then(() => {
      app(i18nextInstance);
    });
};

init();
