export const state = () => ({
  profile_user: null,
});

export const getters = {
  isAuth(state, getters, rootState, rootGetters) {
    return rootGetters['auth/headerAuth'];
  },
};

export const actions = {
  // api Constructor
  request(vuex, { promise, success, fail }) {
    return promise
      .then(() => {
        if (typeof success === 'function') {
          Promise.resolve(success);
        } else {
          return Promise.resolve(success);
        }
      })
      .catch(err => {
        if (typeof fail === 'function') {
          return fail(err);
        } else {
          return Promise.reject(err);
        }
      })
      .catch(err => {
        let code = err.response.status;

        if (code === 401) {
          vuex.dispatch('auth/signOut', null, { root: true });
          this.$router.replace({ name: 'login' });
        } else if ([403, 404].indexOf(code) !== -1) {
          this.$router.replace({ name: 'index' });
        } else {
          this.$router.replace({ name: 'index' });
        }
      });
  },

  getProfile(vuex, username) {
    return this.$axios({
      url: `profiles/${username}`,
      method: 'get',
      headers: {
        ...(vuex.getters.isAuth && { Authorization: vuex.getters.isAuth }),
      },
    })
      .then(({ data }) => {
        return data;
      })
      .catch(err => {
        return err;
      });
  },

  getArticles(vuex, params) {
    return this.$axios({
      url: 'articles',
      method: 'get',
      params,
    })
      .then(({ data }) => {
        return data;
      })
      .catch(err => {
        return err;
      });
  },

  getArticleSlug(vuex, slug) {
    return this.$axios({
      url: `articles/${slug}`,
      method: 'get',
    })
      .then(({ data }) => {
        return data;
      })
      .catch(err => {
        return err;
      });
  },

  createArticle(vuex, article) {
    return this.$axios({
      url: 'articles',
      method: 'post',
      headers: {
        ...(vuex.getters.isAuth && { Authorization: vuex.getters.isAuth }),
      },
      data: { article },
    });
      // .then(({ data }) => {
      //   return data;
      // })
      // .catch(err => {
      //   return err;
      // });
  },

  updateArticle(vuex, article) {
    return this.$axios({
      url: `articles/${article.slug}`,
      method: 'put',
      headers: {
        ...(vuex.getters.isAuth && { Authorization: vuex.getters.isAuth }),
      },
      data: { article },
    });
      // .then(({ data }) => {
      //   return data;
      // })
      // .catch(err => {
      //   return err;
      // });
  },

  deleteArticle(vuex, slug) {
    return this.$axios({
      url: `articles/${slug}`,
      method: 'delete',
      headers: {
        ...(vuex.getters.isAuth && { Authorization: vuex.getters.isAuth }),
      },
    })
      .then(({ data }) => {
        return data;
      })
      .catch(err => {
        return err;
      });
  },

  getComment(vuex, slug) {
    return this.$axios({
      url: `articles/${slug}/comments`,
      method: 'get',
      headers: {
        ...(vuex.getters.isAuth && { Authorization: vuex.getters.isAuth }),
      },
    })
      .then(({ data }) => {
        return data;
      })
      .catch(err => {
        return err;
      });
  },

  addComment(vuex, { slug, comment }) {
    return this.$axios({
      url: `articles/${slug}/comments`,
      method: 'post',
      headers: {
        ...(vuex.getters.isAuth && { Authorization: vuex.getters.isAuth }),
      },
      data: { comment },
    })
      .then(({ data }) => {
        return data;
      })
      .catch(err => {
        return err;
      });
  },

  deleteComment(vuex, { slug, id }) {
    return this.$axios({
      url: `articles/${slug}/comments/${id}`,
      method: 'delete',
      headers: {
        ...(vuex.getters.isAuth && { Authorization: vuex.getters.isAuth }),
      },
    })
      .then(({ data }) => {
        return data;
      })
      .catch(err => {
        return err;
      });
  },

  getArticlesFeed(vuex, params) {
    return this.$axios({
      url: 'articles/feed',
      method: 'get',
      headers: {
        ...(vuex.getters.isAuth && { Authorization: vuex.getters.isAuth }),
      },
      params,
    })
      .then(({ data }) => {
        return data;
      })
      .catch(err => {
        return err;
      });
  },

  getTags() {
    return this.$axios({
      url: 'tags',
      method: 'get',
    })
      .then(({ data }) => {
        return data;
      })
      .catch(err => {
        return err;
      });
  },

  toggleFollow(vuex, { method, username }) {
    return this.$axios({
      url: `profiles/${username}/follow`,
      method,
      headers: {
        ...(vuex.getters.isAuth && { Authorization: vuex.getters.isAuth }),
      },
    })
      .then(({ data }) => {
        return data;
      })
      .catch(err => {
        return err;
      });
  },

  toggleFavorited(vuex, { slug, method }) {
    return this.$axios({
      url: `articles/${slug}/favorite`,
      method,
      headers: {
        ...(vuex.getters.isAuth && { Authorization: vuex.getters.isAuth }),
      },
    })
      .then(({ data }) => {
        return data;
      })
      .catch(err => {
        return err;
      });
  },
};
