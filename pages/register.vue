
<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign up</h1>
          <p class="text-xs-center">
            <nuxt-link to="/login">Have an account?</nuxt-link>
          </p>

          <error-message
            v-show="error"
            :errors="error"
          ></error-message>

          <form @submit.prevent="onSubmit(username, email, password)">
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
                v-model="username"
              >
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="text"
                placeholder="Email"
                v-model="email"
              >
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
                v-model="password"
              >
            </fieldset>
            <button
              class="btn btn-lg btn-primary pull-xs-right"
              type="submit"
            >
              Sign up
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>

</template>

<script>
import ErrorMessage from '@/components/ErrorMessage';
export default {
  name: 'Register',
  components: {
    ErrorMessage
  },
  head() {
    return {
      title: 'Register - Conduit'
    };
  },
  middleware: ['auth-forbidden'],
  data() {
    return {
      username: null,
      email: null,
      password: null,
      error: null
    };
  },
  methods: {
    onSubmit(username, email, password) {
      this.$store
        .dispatch('auth/register', { username, email, password })
        .then(() => {
          this.$router.replace({ name: 'index' });
        })
        .catch(err => {
          this.error = err && err.response.data.errors;
        });
    }
  }
};
</script>
