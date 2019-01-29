
<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img
              :src="profile && profile.image"
              class="user-img"
            />
            <h4>{{ profile && profile.username }}</h4>
            <p>{{ profile && profile.bio }}</p>

            <template v-if="user">
              <button
                v-if="profile.username !== user.username"
                class="btn btn-sm btn-outline-secondary action-btn"
                @click="toggleFollow((profile && profile.following) ? false : true)"
              >
                <i class="ion-plus-round"></i>
                &nbsp;
                <template> {{ (profile && profile.following) ? 'unfollow' : 'Follow' }}</template>
                {{ profile && profile.username }}
              </button>

              <nuxt-link
                v-else
                class="btn btn-sm btn-outline-secondary action-btn"
                :to="{ name: 'settings' }"
              >
                <i class="ion-gear-a"></i>
                &nbsp;Edit Profile Settings
              </nuxt-link>
            </template>

            <template v-else>
              <button
                class="btn btn-sm btn-outline-secondary action-btn"
                @click="toggleFollow((profile && profile.following) ? false : true)"
              >
                <i class="ion-plus-round"></i>
                &nbsp;
                <template> {{ (profile && profile.following) ? 'unfollow' : 'Follow' }}</template>
                {{ profile && profile.username }}
              </button>
            </template>

          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a
                  class="nav-link"
                  :class="{'active': tab === 'my'}"
                  @click="tabChange('my')"
                >My Articles</a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  :class="{'active': tab === 'fav'}"
                  @click="tabChange('fav')"
                >Favorited Articles</a>
              </li>
            </ul>
          </div>
          <article-preview
            v-for="n in articles || []"
            :key="n.slug"
            :article="n"
          ></article-preview>
          <div
            v-if="!articles.length"
            class="article-preview"
          >No articles are here... yet.</div>

          <pagination
            :total="articlesCount"
            :page.sync="offsetPage"
            :per-page="10"
          ></pagination>

        </div>

      </div>
    </div>

  </div>
</template>

<script>
import ArticlePreview from "@/components/ArticlePreview";
import Pagination from "@/components/Pagination";

export default {
  name: "User",
  components: {
    ArticlePreview,
    Pagination
  },
  head() {
    return {
      title: `${this.$route.params.user} - Conduit`
    };
  },
  computed: {
    user() {
      return this.$store.getters["auth/currentUser"];
    },
    offsetPage: {
      get() {
        return this.option.offset / this.option.limit + 1;
      },
      set(page) {
        this.getNextPage(page);
      }
    }
  },
  asyncData({ $axios, params, store }) {
    const username = params.user.replace("@", "");
    let option = {
      limit: 10,
      offset: 0,
      author: username
    };
    let tab = "my";

    return Promise.all([
      store.dispatch("api/getProfile", username),
      store.dispatch("api/getArticles", option)
    ]).then(([profile, articles]) => {
      return { ...profile, ...articles, option, tab };
    });
  },
  methods: {
    getNextPage(page) {
      let { limit } = this.option;

      this.option.offset = (page - 1) * limit;

      this.$store.dispatch("api/getArticles", this.option).then(res => {
        this.articles = [...res.articles];
      });
    },
    tabChange(type) {
      this.tab = type;
      let option = {
        limit: 10,
        offset: 0
      };

      switch (type) {
        case "my":
          option.author = this.profile.username;
          break;
        case "fav":
          option.favorited = this.profile.username;
          break;
      }

      this.$store.dispatch("api/getArticles", option).then(res => {
        this.articles = [...res.articles];
        this.option = { ...option };
      });
    },
    toggleFollow(type) {
      if (!this.$store.getters["auth/headerAuth"]) {
        this.$router.push({ name: "login" });
        return false
      }

      let params = {
        username: this.profile.username,
        method: type ? "post" : "delete"
      };

      this.$store
        .dispatch("api/toggleFollow", params)
        .then(res => {
          this.profile = { ...res.profile };
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
a.nav-link {
  cursor: pointer;
}
</style>
