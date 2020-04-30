
<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <error-message
            v-show="error"
            :errors="error"
          ></error-message>

          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                  v-model="user.image"
                >
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  v-model="user.username"
                >
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                  v-model="user.bio"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  v-model="user.email"
                >
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="password"
                  v-model="user.password"
                >
              </fieldset>
              <button
                class="btn btn-lg btn-primary pull-xs-right"
                type="button"
                @click="updateUser"
              >
                Update Settings
              </button>
            </fieldset>
          </form>

          <hr>

          <button
            class="btn btn-outline-danger"
            @click="logout"
          >
            Or click here to logout.
          </button>

        </div>

      </div>
    </div>
  </div>
</template>

<script>
import ErrorMessage from '@/components/ErrorMessage';

export default {
  name: 'Settings',
  components: {
    ErrorMessage
  },
  head() {
    return {
      title: 'Setting - Conduit'
    };
  },
  middleware: ['auth-require'],
  data() {
    return {
      sending: false
    };
  },
  // async asyncData({ $axios, params, store }) {
  async asyncData({ store }) {
    // let jwt = store.getters["auth/headerAuth"]
    return await store.dispatch('auth/getUser').then(res => {
      let { email, bio, image, username, password } = res.user;

      return {
        user: {
          email,
          bio,
          image,
          username,
          password
        },
        error: null
      };
    });
  },
  methods: {
    updateUser() {
      // let profile = Object.keys(this.user).reduce((rst, cur) => {
      //   if (this.user[cur]) {
      //     rst = {
      //       ...rst,
      //       [cur]: this.user[cur]
      //     }
      //   }
      //   return rst
      // }, {})
      this.$store
        .dispatch('auth/updateUser', this.user)
        .then(() => {
          this.$router.push({ name: 'index' });
        })
        .catch(err => {
          this.error = err && err.response.data.errors;
        });
    },
    logout() {
      this.$store.dispatch('auth/logout').then(() => {
        this.$router.push({ name: 'index' });
      });
    }
  }
};
</script>
