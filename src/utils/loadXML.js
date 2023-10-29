import axios from 'axios';
import parser from './parser.js';
import update from './update.js';

export default (url, watchedState, state) => (axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
  .then((r) => {
    const id = state.feeds.length + 1;
    const { feed, posts } = parser(r);
    feed.id = id;
    feed.url = url;

    const feedPosts = posts.map((post, index) => {
      post.id = index;
      post.feedID = feed.id;
      return post;
    });
    watchedState.status = 'success';
    watchedState.feeds.push(feed);
    watchedState.posts.push(...feedPosts);
    update(state, watchedState);
  }).catch((e) => console.log(e)));