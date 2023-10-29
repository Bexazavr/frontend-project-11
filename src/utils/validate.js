import * as yup from 'yup';

export default (linkRSS, state) => {
  yup.setLocale({
    string: {
      url: 'ValidationError',
    },
  });

  const existingLinks = state.feeds.map((feed) => feed.url);

  const yupScheme = yup.object({
    url: yup.string().url('invalidUrl').notOneOf(existingLinks, 'existingUrl'),
  });

  return yupScheme
    .validate({ url: linkRSS }, { abortEarly: false })
    .then(({ url }) => Promise.resolve(url));
};
