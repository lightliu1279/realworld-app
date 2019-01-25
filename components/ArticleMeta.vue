<template>
  <div class="article-meta">
    <nuxt-link
      class="author"
      :to="{ name: 'user', params:{user:`@${author && author.username || ''}`} }"
    >
      <img :src="author.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'" />
    </nuxt-link>
    <div class="info">
      <nuxt-link
        class="author"
        :to="{ name: 'user', params:{user:`@${author && author.username || ''}`} }"
      >&nbsp;{{ author && author.username }}
      </nuxt-link>

      <span class="date">{{ createdAt | dateformat}}</span>
    </div>

    <template v-if="actions === 'follow'">

      <button
        class="btn btn-sm btn-outline-secondary"
        @click="toggleFollow((following) ? false : true)"
      >
        <i class="ion-plus-round"></i>
        &nbsp;
        {{ following ? 'Unfollow' : 'Follow' }} {{ author && author.username }}
      </button>
      &nbsp;&nbsp;
      <button
        class="btn btn-sm"
        :class="{'btn-primary': favorited, 'btn-outline-primary': !favorited}"
        @click="toggleFavorited((favorited) ? false : true)"
      >
        <i class="ion-heart"></i>
        &nbsp;
        Favorite Articles <span class="counter">({{ favoritesCount }})</span>
      </button>

    </template>

    <template v-else-if="actions === 'edit'">

      <button class="btn btn-sm btn-outline-secondary"
      @click="turnToEdit()"
      >
        <i class="ion-edit"></i>
        &nbsp; Edit Article
      </button>
      &nbsp;&nbsp;
      <button
        class="btn btn-sm btn-outline-danger"
        @click="deleteArticle"
      >
        <i class="ion-trash-a"></i>
        &nbsp; Delete Article
      </button>

    </template>

    <template v-else>

      <button
        class="btn btn-sm pull-xs-right"
        :class="{'btn-primary': favorited, 'btn-outline-primary': !favorited}"
        @click="toggleFavorited((favorited) ? false : true)"
      >
        <i class="ion-heart"></i> {{ favoritesCount }}
      </button>

    </template>

  </div>
</template>

<script>
export default {
  name: "ArticleMeta",
  props: {
    author: {
      type: Object,
      defult: {},
      require: true
    },
    favoritesCount: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: String,
      default: ""
    },
    actions: {
      type: String,
      defult: ""
    },
    slug: {
      type: String,
      defult: ""
    },
    following: {
      type: Boolean,
      default: false
    },
    favorited: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isAuth() {
      return !!this.$store.getters["api/isAuth"];
    }
  },
  methods: {
    deleteArticle() {
      this.$store.dispatch("api/deleteArticle", this.slug).then(() => {
        this.$router.push({ name: "index" });
      });
    },
    toggleFollow(type) {
      if (!this.$store.getters["auth.headerAuth"]) {
        this.$router.push({ name: "login" });
        return false
      }
      let params = {
        username: this.author.username,
        method: type ? "post" : "delete"
      };
      this.$store
        .dispatch("api/toggleFollow", params)
        .then(res => {
          this.$emit("update:following", res.profile.following);
        })
        .catch(err => {
          console.log(err);
        });
    },
    toggleFavorited(type) {
      if (!this.$store.getters["auth.headerAuth"]) {
        this.$router.push({ name: "login" });
        return false
      }
      let params = {
        slug: this.slug,
        method: type ? "post" : "delete"
      };
      this.$store
        .dispatch("api/toggleFavorited", params)
        .then(res => {
          this.$emit("update:favorited", res.article.favorited);
          this.$emit("update:favoritesCount", res.article.favoritesCount);
        })
        .catch(err => {
          console.log(err);
        });
    },
    turnToEdit() {
      this.$router.push({
        name: 'editor-slug',
        params: {
          slug: this.slug
        }
      })
    }
  }
};
</script>
