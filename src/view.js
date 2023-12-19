const renderError = ({ feedbackEl }, error, i18nextInstance) => {
  if (error) {
    feedbackEl.classList.add('text-danger');
    feedbackEl.textContent = i18nextInstance.t(error);
  }
};

const renderState = ({ feedbackEl, form, input }, value, i18nextInstance) => {
  switch (value) {
    case 'ready':
      form.reset();
      input.focus();
      break;
    case 'validating':
      feedbackEl.classList.remove('text-success');
      feedbackEl.classList.remove('text-warning');
      feedbackEl.classList.add('text-danger');
      break;
    case 'valid':
      input.classList.remove('is-invalid');
      feedbackEl.innerHTML = '';
      break;
    case 'invalid':
      input.classList.add('is-invalid');
      feedbackEl.classList.remove('text-success');
      feedbackEl.classList.remove('text-warning');
      feedbackEl.classList.add('text-danger');
      break;
    case 'loading':
      feedbackEl.classList.remove('text-success');
      feedbackEl.classList.remove('text-danger');
      feedbackEl.classList.add('text-warning');
      feedbackEl.textContent = i18nextInstance.t('form.feedback.loading');
      break;
    case 'success':
      feedbackEl.classList.remove('text-danger');
      feedbackEl.classList.remove('text-warning');
      feedbackEl.classList.add('text-success');
      feedbackEl.textContent = i18nextInstance.t('form.feedback.success');
      break;
    default:
      throw new Error(`Unknown process state: ${value}`);
  }
};

const renderFeeds = ({ feedsContainer }, value, i18nextInstance) => {
  feedsContainer.innerHTML = '';
  const cardBorder = document.createElement('div');
  cardBorder.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const feedsTitle = document.createElement('h2');
  feedsTitle.classList.add('card-title', 'h4');
  feedsTitle.textContent = i18nextInstance.t('feeds.title');
  cardBody.append(feedsTitle);
  cardBorder.append(cardBody);
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  value.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.title;
    li.prepend(h3);
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.description;
    li.append(p);
    ul.prepend(li);
  });
  cardBorder.append(ul);
  feedsContainer.append(cardBorder);
};

const renderPosts = ({ postsContainer }, value, i18nextInstance) => {
  postsContainer.innerHTML = '';
  const cardBorder = document.createElement('div');
  cardBorder.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const postsTitle = document.createElement('h2');
  postsTitle.classList.add('cadr-title', 'h4');
  postsTitle.textContent = i18nextInstance.t('posts.title');
  cardBody.append(postsTitle);
  cardBorder.append(cardBody);
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounder-0');
  value.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const a = document.createElement('a');
    a.setAttribute('href', post.link);
    a.classList.add(post.viewed ? 'fw-normal' : 'fw-bold');
    a.classList.add(post.viewed ? 'link-secondary' : 'fw-bold');
    a.setAttribute('data-id', post.id);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = post.title;
    li.prepend(a);
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('type', 'button');
    button.setAttribute('data-id', post.id);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.setAttribute('data-bs-id', post.id);
    button.setAttribute('data-bs-title', post.title);
    button.setAttribute('data-bs-description', post.description);
    button.setAttribute('data-bs-link', post.link);
    button.textContent = i18nextInstance.t('posts.button');
    li.append(button);
    ul.prepend(li);
  });
  cardBorder.append(ul);
  postsContainer.append(cardBorder);
};

const renderModal = ({ modalTitle, modalBody, readAllModalButton }, post) => {
  modalTitle.textContent = post?.title;
  modalBody.textContent = post?.description;
  readAllModalButton.setAttribute('href', post?.link);
};

const renderViewedPosts = (viewedPostIds) => {
  const lastId = [...viewedPostIds].at(-1);
  const postElement = document.querySelector(`[data-id="${lastId}"]`);
  postElement.classList.remove('fw-bold');
  postElement.classList.add('fw-normal', 'link-secondary');
};

export default (elements, initialState, i18nextInstance) => (path, value) => {
  switch (path) {
    case 'rssForm.addingNewFeedState':
      renderState(elements, value, i18nextInstance);
      break;
    case 'rssForm.error':
      renderError(elements, value, i18nextInstance);
      break;
    case 'rssFeeds':
      renderFeeds(elements, value, i18nextInstance);
      break;
    case 'rssPosts':
      renderPosts(elements, value, i18nextInstance);
      break;
    case 'modal.post':
      renderModal(elements, value);
      break;
    case 'uiState.viewedPostIds':
      renderViewedPosts(value);
      break;
    default:
      break;
  }
};
