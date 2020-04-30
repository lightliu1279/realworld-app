<template>
  <form
    class="card comment-form"
    @submit.prevent="$emit('submit-comment')"
  >
    <div class="card-block">
      <textarea
        class="form-control"
        placeholder="Write a comment..."
        rows="3"
        v-model="value$"
      ></textarea>
    </div>
    <div class="card-footer">
      <img
        :src="image"
        class="comment-author-img"
      />
      <button class="btn btn-sm btn-primary"
      :disabled="!value$ || sending">
        Post Comment
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'CommentForm',
  props: {
    value: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: 'https://static.productionready.io/images/smiley-cyrus.jpg'
    },
    sending: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    value$: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val.trim());
      }
    }
  }
};
</script>
