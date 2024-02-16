import axios from 'axios';
import { uniqueId } from 'lodash';

const makeProxy = (url) => {
  const proxyUrl = new URL('/get', 'https://allorigins.hexlet.app');
  proxyUrl.searchParams.set('disableCache', 'true');
  proxyUrl.searchParams.set('url', url);
  return proxyUrl.toString();
};

const fetchData = (url) => {
  const proxyUrl = makeProxy(url);
  return axios.get(proxyUrl);
};

const parseData = (contentData) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(contentData, 'text/xml');
  const parseError = doc.querySelector('parsererror');

  if (parseError) {
    const error = new Error(parseError.textContent);
    error.isParsingError = true;
    throw error;
  }

  const items = Array.from(doc.querySelectorAll('item'));
  const posts = [];
  items.forEach((item) => posts.push({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
  }));
  const channel = doc.querySelector('channel');
  const feed = {
    title: channel.querySelector('title').textContent,
    description: channel.querySelector('description').textContent,
  };
  return { posts, feed };
};

const normalizePostsData = (posts) => posts.map(({ title, description, link }) => ({
  id: uniqueId(),
  title,
  description,
  link,
  viewed: false,
}));

const handleData = (data, state, url) => {
  const { posts, feed } = data;
  const feedId = uniqueId();
  state.rssFeeds.push({ id: uniqueId(), link: url, ...feed });
  const postsNormalized = normalizePostsData(posts);
  state.rssPosts.push(...postsNormalized);
};

const updatePosts = (state, refreshTime) => {
  const { rssPosts, rssFeeds } = state;

  const promises = rssFeeds.map((feed) => fetchData(feed.link)
    .then((response) => {
      const { posts } = parseData(response.data.contents);
      const existedPostLinks = rssPosts.map((post) => post.link);
      const newPosts = posts.filter((post) => !existedPostLinks.includes(post.link));
      if (newPosts.length > 0) {
        const normalizedPosts = normalizePostsData(newPosts);
        rssPosts.push(...normalizedPosts);
      }
    }));

  Promise
    .all(promises)
    .finally(() => setTimeout(() => updatePosts(state, refreshTime), refreshTime));
};

export {
  fetchData,
  parseData,
  handleData,
  updatePosts,
};
