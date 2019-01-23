import jwt from 'jsonwebtoken';

export const state = () => ({
  user: null,
  isAuth: null,
});

export const getters = {
  currentUser(state) {
    return state.user
  },
  headerAuth(state) {
    if(state.isAuth) {
      return `Token ${state.isAuth}`
    }else {
      return null
    }
  }
}

export const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setAuth(state, auth) {
    state.isAuth = auth;
  },
};

export const actions = {
  login(vuex, { email, password }) {
    return this.$axios({
      url: 'users/login',
      method: 'post',
      data: {
        user: {
          email,
          password,
        },
      },
    })
      .then(({ data }) => {
        vuex.dispatch('setAuthenticate', data.user);
        return Promise.resolve(data.user);
      })
      .catch(err => {
        return Promise.reject(err);
      });
  },
  getUser(vuex, jwt) {
    this.$axios({
      url: 'user',
      method: 'get',
      headers: {
        Authorization: `Token ${jwt}`,
      },
    })
      .then(({ data }) => {
        vuex.commit('setUser', data.user);
      })
      .catch(err => {
        console.log(err);
      });
  },
  setAuthenticate(vuex, user) {
    vuex.commit('setUser', user);
    this.$cookies.set('jwt', user.token);
  },
  checkAuthentication(vuex, req) {
    if (req && req.headers.cookie) {
      const token = this.$cookies.get('jwt');
    
      vuex.commit('setAuth', token);
      vuex.commit('setUser', jwt.decode(token));
    }
  },
};
