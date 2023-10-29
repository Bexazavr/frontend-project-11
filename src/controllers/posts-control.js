export default (elements, watchedState) => {
  elements.postsContainer.addEventListener('click', (e) => {
    if (Object.hasOwn(e.target.dataset, 'id')) {
      const { id } = e.target.dataset;
      watchedState.modalWindowId = id;
      watchedState.visitedLinksIds.add(id);
    }
  });
};
