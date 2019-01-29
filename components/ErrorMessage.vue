<template>
  <ul class="error-messages">
    <li
      v-for="(n, k) in errors"
      :key="k"
    >{{ k }} {{ n[0] }}</li>
  </ul>
</template>

<script>
export default {
  name: "ErrorMessages",
  props: {
    errors: {
        default: {}
    }
  }
};
</script>
