
<template>
  <div class="home-page">

    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">

        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{'active': tab === 'your'}"
                  :to="{ name:`your-feed`}"
                >Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{'active': tab === 'global'}"
                  :to="{ name:`index`}"
                >Global Feed</nuxt-link>
              </li>
              <li
                class="nav-item"
                v-if="option.tag"
              >
                <nuxt-link
                  class="nav-link"
                  :class="{'active': tab === 'tag'}"
                  :to="{ name:`tag-tagname`, params:{ tagname: option.tag } }"
                ># {{ option.tag }}</nuxt-link>
              </li>
            </ul>
          </div>

          <article-preview
            v-for="n in articles || []"
            :key="n.slug"
            :article="n"
          />

          <pagination
            :total="articlesCount"
            :page.sync="offsetPage"
            :per-page="10"
          ></pagination>

        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div class="tag-list">
              <nuxt-link
                class="tag-pill tag-default"
                v-for="n in tags || []"
                :key="n"
                :to="{ name:`tag-tagname`, params:{ tagname: n } }"
              >{{ n }}</nuxt-link>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import ArticlePreview from "@/components/ArticlePreview";
import Pagination from "@/components/Pagination";

export default {
  name: "Home",
  data() {
    return {};
  },
  components: {
    ArticlePreview,
    Pagination
  },
  computed: {
    offsetPage: {
      get() {
        return this.option.offset / this.option.limit + 1;
      },
      set(page) {
        this.getNextPage(page);
      }
    }
  },
  head() {
    return {
      title: "Home - Conduit"
    };
  },
  asyncData({ store, params, route }) {
    let tag = params.tagname || null;
    let tab = "global";
    let api_url = "api/getArticles";
    let option = {
      limit: 10,
      offset: 0,
      ...(tag && { tag: tag })
    };

    if (route.name === "your-feed") {
      tab = "your";
      api_url = "api/getArticlesFeed";
    } else if (tag) {
      tab = "tag";
    }

    return Promise.all([
      store.dispatch(api_url, option),
      store.dispatch("api/getTags")
    ]).then(([article, tags]) => {
      return {
        ...article,
        ...tags,
        option,
        tab
      };
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
    // tabChange(type) {
    //   this.tab = type;
    //   let api_url = "api/getArticles";
    //   this.option.offset = 0;

    //   switch (type) {
    //     case "your":
    //       api_url = "api/getArticlesFeed";
    //       break;
    //   }

    //   this.$store.dispatch(api_url, this.option).then(res => {
    //     this.articles = [...res.articles];
    //     this.articlesCount = res.articlesCount;
    //   });
    // }
  }
};
</script>


<style scoped>
a.nav-link {
  cursor: pointer;
}
</style>
