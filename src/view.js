import onChange from 'on-change';

const containers = (name, lists) => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const ulEl = document.createElement('ul');
  ulEl.classList.add('list-group', 'border-0', 'rounded-0');
  const h2El = document.createElement('h2');
  h2El.classList.add('card-title', 'h4');
  h2El.textContent = name;
  ulEl.replaceChildren(...lists);
  cardBody.replaceChildren(h2El);
  card.replaceChildren(cardBody, ulEl);
  return card;
};

const handleErrors = (elements, currentError, prevError, i18n) => {
  const { feedBack, inputField } = elements;
  inputField.classList.add('is-invalid');
  feedBack.classList.remove('text-info', 'text-success');
  feedBack.classList.add('text-danger');
  feedBack.textContent = currentError !== null
    ? i18n.t(currentError)
    : i18n.t(prevError);
};

const renderFeeds = (elements, feeds) => {
  const lists = feeds.map((feed) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'border-0', 'border-end-0');

    const hEl = document.createElement('h3');
    hEl.classList.add('h6', 'm-0');
    hEl.textContent = feed.title;

    const pEl = document.createElement('p');
    pEl.classList.add('m-0', 'small', 'text-black-50');
    pEl.textContent = feed.description;

    liEl.replaceChildren(hEl, pEl);
    return liEl;
  });

  elements.feedsContainer.replaceChildren(containers('Фиды', lists));
};

const renderModal = (elements, posts, modalWindowId) => {
  const post = posts.find(({ id }) => modalWindowId === id.toString());
  const { modal } = elements;
  modal.title.textContent = post.title;
  modal.body.textContent = post.description;
  modal.footer.firstElementChild.href = post.url;
};

const renderPosts = (elements, state) => {
  const lists = state.posts.map((post) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const classForLink = state.visitedLinksIds.has(post.id) ? 'fw-normal' : 'fw-bold';
    const link = document.createElement('a');
    link.classList.add(classForLink);
    link.setAttribute('href', post.url);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    link.setAttribute('data-id', post.id);
    link.textContent = post.title;

    const btn = document.createElement('button');
    btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btn.setAttribute('type', 'button');
    btn.setAttribute('data-bs-toggle', 'modal');
    btn.setAttribute('data-bs-target', '#modal');
    btn.setAttribute('data-id', post.id);
    btn.textContent = 'Просмотр';

    liEl.replaceChildren(link, btn);
    return liEl;
  });

  elements.postsContainer.replaceChildren(containers('Посты', lists));
};

const renderStatus = (elements, validationState, i18n) => {
  switch (validationState) {
    case 'loading':
      elements.inputButton.disabled = true;
      elements.inputField.disabled = true;
      break;
    case 'success':
      elements.feedBack.textContent = i18n.t('success');
      elements.feedBack.classList.replace('text-danger', 'text-success');
      elements.inputField.classList.remove('is-invalid', 'text-info');
      elements.inputField.focus();
      elements.inputField.value = '';
      elements.inputButton.disabled = false;
      elements.inputField.disabled = false;

      break;
    case 'awaiting':
      elements.inputButton.disabled = false;
      elements.inputField.disabled = false;
      break;
    default:
      throw new Error(`Incorrect status - ${validationState}!`);
  }
};

const renderVisitedLinks = (setID) => {
  const currentVisitedID = [...setID.values()][setID.size - 1];
  const currentLink = document.querySelector(`[data-id="${currentVisitedID}"]`);
  currentLink.classList.toggle('fw-bold');
  currentLink.classList.toggle('fw-normal');
};

const render = (state, elements, i18n) => {
  const watcher = onChange(state, (path, value, prevValue) => {
    switch (path) {
      case 'error':
        handleErrors(elements, value, prevValue, i18n);
        break;
      case 'feeds':
        renderFeeds(elements, state.feeds);
        break;
      case 'posts':
        renderPosts(elements, state);
        break;
      case 'status':
        renderStatus(elements, value, i18n);
        break;
      case 'modalWindowId':
        renderModal(elements, state.posts, value);
        break;
      case 'visitedLinksIds':
        renderVisitedLinks(value, state.posts);
        break;
      default:
        break;
    }
  });

  return watcher;
};

export default render;
