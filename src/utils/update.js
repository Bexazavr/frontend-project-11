import axios from 'axios';
import { uniqueId } from 'lodash';
import parser from './parser.js';

const getNewPosts = (coll1, coll2) => coll1
  .filter(({ title: title1 }) => !coll2.some(({ title: title2 }) => title1 === title2));

const update = (state, watchedObject) => {
  const currentPosts = state.posts;
  const { url, id: feedID } = state.feeds[state.feeds.length - 1];

  setTimeout(() => {
    axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
      .then((res) => {
        const dataFromParse = parser(res);
        const { posts: updatedPosts } = dataFromParse;
        const newPosts = getNewPosts(updatedPosts, currentPosts);

        const newPostsFromFeed = newPosts.map((post) => {
          post.id = uniqueId();
          post.feedID = feedID;
          return post;
        });

        if (newPostsFromFeed.length !== 0) {
          watchedObject.channels.posts.unshift(...newPostsFromFeed);
        }
      })
      .finally(update(state, watchedObject));
  }, 5000);
};

export default update;
