import jwt from 'jsonwebtoken';
import { promised } from 'q';

export const state = () => ({
  user: null,
  isAuth: null,
});

export const getters = {
  currentUser(state) {
    return state.user;
  },
  headerAuth(state) {
    if (state.isAuth) {
      return `Token ${state.isAuth}`;
    } else {
      return null;
    }
  },
};

export const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setAuth(state, auth) {
    state.isAuth = auth;
  },
  logout(state) {
    (state.user = null), (state.isAuth = null);
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
  register(vuex, { username, email, password }) {
    return this.$axios({
      url: 'users',
      method: 'post',
      data: {
        user: {
          username,
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
  getUser(vuex) {
    return this.$axios({
      url: 'user',
      method: 'get',
      headers: {
        ...(vuex.getters.headerAuth && {
          Authorization: vuex.getters.headerAuth,
        }),
      },
    })
      .then(({ data }) => {
        // vuex.commit('setUser', data.user);
        return data;
      })
      .catch(err => {
        console.log(err);
      });
  },
  updateUser(vuex, user) {
    return this.$axios({
      url: 'user',
      method: 'put',
      headers: {
        ...(vuex.getters.headerAuth && {
          Authorization: vuex.getters.headerAuth,
        }),
      },
      data: { user },
    })
      .then(({ data }) => {
        // vuex.commit('setUser', data.user);
        return Promise.resolve(data) ;
      })
      .catch(err => {
        // return err
        return Promise.reject(err) 
      });
  },

  setAuthenticate(vuex, user) {
    vuex.commit('setAuth', user.token);
    vuex.commit('setUser', user);
    this.$cookies.set('jwt', user.token);
  },
  checkAuthentication(vuex, req) {
    if (req && req.headers.cookie) {
      const token = this.$cookies.get('jwt');
      const jwtpayload = jwt.decode(token)
      // console.log(jwtpayload)
      vuex.commit('setAuth', token);
      vuex.commit('setUser', jwt.decode(token));
    }else{
      vuex.dispatch('logout')
    }
  },
  logout(vuex, req) {
    return new Promise(resolve => {
      this.$cookies.remove('jwt');
      vuex.commit('logout')
      resolve();
    });
  },
};
