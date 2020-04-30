<template>
  <div class="wrap">
    <nav class="navbar navbar-light">
      <div class="container">
        <nuxt-link
          class="navbar-brand"
          to="/"
        >Conduit</nuxt-link>

        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <!-- Add "active" class when you're on that page" -->
            <nuxt-link
              class="nav-link"
              :class="{ 'active': route_name === 'index'}"
              to="/"
            >Home</nuxt-link>

          </li>
          <li
            class="nav-item"
            v-show="user"
          >
            <nuxt-link
              class="nav-link"
              :class="{ 'active': route_name === 'editor'}"
              to="/editor"
            >
              <i class="ion-compose"></i>&nbsp;New Article
            </nuxt-link>
          </li>
          <li
            class="nav-item"
            v-show="user"
          >
            <nuxt-link
              class="nav-link"
              :class="{ 'active': route_name === 'settings'}"
              to="/settings"
            >
              <i class="ion-gear-a"></i>&nbsp;Settings
            </nuxt-link>
          </li>
          <li
            class="nav-item"
            v-show="!user"
          >
            <nuxt-link
              class="nav-link"
              :class="{ 'active': route_name === 'login'}"
              to="/login"
            >
              <i class="ion-compose">&nbsp;Sign in</i>
            </nuxt-link>
          </li>
          <li
            class="nav-item"
            v-show="!user"
          >
            <nuxt-link
              class="nav-link"
              to="/register"
              :class="{ 'active': route_name === 'register'}"
            >
              <i class="ion-compose">&nbsp;Sign up</i>
            </nuxt-link>
          </li>
          <li
            class="nav-item"
            v-show="user"
          >
            <nuxt-link
              class="nav-link"
              :to="{ name: 'user', params:{user:`@${user && user.username || ''}`} }"
              :class="{ 'active': route_name === 'profile'}"
            >&nbsp;{{ user && user.username }}
            </nuxt-link>
          </li>
        </ul>
      </div>
    </nav>

    <nuxt />

    <footer>
      <div class="container">
        <a
          href="/"
          class="logo-font"
        >conduit</a>
        <span class="attribution">
          An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.
        </span>
      </div>
    </footer>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'Layout',
  computed: {
    route_name() {
      return this.$route.name;
    },
    ...mapState({
      user: state => state.auth.user
    })
  }
};
</script>

<style>
</style>
