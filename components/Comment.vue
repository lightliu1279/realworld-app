<template>
  <div class="card">
    <div class="card-block">
      <p class="card-text">{{ body }}</p>
    </div>
    <div class="card-footer">
      <nuxt-link
        :to="{ name:'user', params:{user:`@${username}`} }"
        class="comment-author"
      >
        <img
          :src="image"
          class="comment-author-img"
        />
      </nuxt-link>
      &nbsp;
      <nuxt-link
        :to="{ name:'user', params:{user:`@${username}`} }"
        class="comment-author"
      >{{ username }}</nuxt-link>
      <span class="date-posted">{{ createdAt | dateformat }}</span>

      <span
        v-if="username === currentUser"
        class="mod-options"
      ><i
          class="ion-trash-a"
          @click="$emit('delete-comment')"
        ></i></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Comment",
  props: {
    username: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: ""
    },
    body: {
      type: String,
      default: ""
    },
    createdAt: {
      type: String,
      default: ""
    },
    currentUser: {
      type: String,
      default: ""
    }
  }
};
</script>
