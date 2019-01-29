
<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign in</h1>
          <p class="text-xs-center">
            <nuxt-link to="/register">Need an account?</nuxt-link>
          </p>

          <error-message
            v-show="error"
            :errors="error"
          ></error-message>

          <form v-on:submit.prevent="onSubmit(email, password);">
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="text"
                v-model="email"
                placeholder="Email"
              >
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="password"
                v-model="password"
                placeholder="Password"
              >
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              Sign in
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>

</template>

<script>
import ErrorMessage from '@/components/ErrorMessage'
export default {
  name: "Login",
  components: {
    ErrorMessage
  },
  head() {
    return {
      title: "Sign in - Conduit"
    };
  },
  middleware: ["auth-forbidden"],
  data() {
    return {
      email: null,
      password: null,
      error: null
    };
  },
  methods: {
    onSubmit(email, password) {
      this.$store
        .dispatch("auth/login", { email, password })
        .then(() => {
          this.$router.replace({ name: "index" });
        })
        .catch(err => {
          console.log(err);
          this.error = err && err.response.data.errors;
        });
    }
  }
};
</script>
