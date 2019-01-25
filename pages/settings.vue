
<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <ul
            class="error-messages"
            v-show="error"
          >
            <li
              v-for="(n, k) in error"
              :key="k"
            >{{ k }} {{ n[0] }}</li>
          </ul>

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
export default {
  name: "Settings",
  head() {
    return {
      title: "Setting - Conduit"
    };
  },
  middleware: ['auth-require'],
  async asyncData({ $axios, params, store }) {
    let jwt = store.getters["auth/headerAuth"];
    return await store.dispatch("auth/getUser").then(res => {
      console.log(res);
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
      let profile = Object.keys(this.user).reduce((rst, cur) => {
        if (this.user[cur]) {
          rst = {
            ...rst,
            [cur]: this.user[cur]
          };
        }
        return rst;
      }, {});
      this.$store
        .dispatch("auth/updateUser", this.user)
        .then(res => {
          this.$router.push({ name: "index" });
        })
        .catch(err => {
          this.error = err && err.response.data.errors;
        });
    },
    logout() {
      this.$store.dispatch("auth/logout").then(() => {
        this.$router.push({ name: "index" });
      });
    }
  }
};
</script>
