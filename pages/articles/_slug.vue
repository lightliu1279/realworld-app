
<template>
  <div class="article-page">

    <div class="banner">
      <div class="container">

        <h1>{{ article.title }}</h1>

        <ArticleMeta
          :author="article.author"
          :actions="isCurrentUser ? 'edit': 'follow'"
          :slug="article.slug"
          :following.sync="article.author.following"
          :createdAt="article.createdAt"
          :favoritesCount.sync="article.favoritesCount"
          :favorited.sync="article.favorited"
        ></ArticleMeta>

      </div>
    </div>

    <div class="container page">

      <div class="row article-content">
        <div class="col-md-12">
          <div v-html="parseMarkdown(article.body)"></div>
          <!-- <h2 id="introducing-ionic">Introducing RealWorld.</h2>
          <p>It's a great solution for learning how other frameworks work.</p> -->
          <ul class="tag-list">
            <li
              v-for="(n, idx) in article.tagList"
              class="tag-default tag-pill tag-outline"
              :key="n + idx"
            >
              <nuxt-link :to="{ name:`tag-tagname`, params:{ tagname: n } }">{{ n }}</nuxt-link>
            </li>
          </ul>
        </div>
      </div>

      <hr />

      <div class="article-actions">
        <ArticleMeta
          :author="article.author"
          :actions="isCurrentUser ? 'edit': 'follow'"
          :createdAt="article.createdAt"
          :following.sync="article.author.following"
          :slug="article.slug"
          :favoritesCount.sync="article.favoritesCount"
          :favorited.sync="article.favorited"
        ></ArticleMeta>
      </div>

      <div class="row">

        <div class="col-xs-12 col-md-8 offset-md-2">

          <comment-form
            v-if="isAuth"
            v-model="commentVal"
            :image="currentUser.image"
            @submit-comment="submitComment"
          ></comment-form>

          <comment
            v-for="n in comments || []"
            :key="n.id"
            :username="n.author.username"
            :image="n.author.image"
            :createdAt="n.createdAt"
            :body="n.body"
            :currentUser="currentUser.username"
            @delete-comment="deleteComment(n.id)"
          ></comment>

        </div>

      </div>

    </div>

  </div>
</template>

<script>
import ArticleMeta from "@/components/ArticleMeta";
import Comment from "@/components/Comment";
import CommentForm from "@/components/CommentForm";
import marked from "marked";

export default {
  name: "Article",
  components: {
    ArticleMeta,
    Comment,
    CommentForm
  },
  head() {
    return {
      title: "Article - Conduit"
    };
  },
  data() {
    return {
      commentVal: ""
    };
  },
  asyncData({ $axios, params, store }) {
    const slug = params.slug;

    return Promise.all([
      store.dispatch("api/getArticleSlug", slug),
      store.dispatch("api/getComment", slug)
    ]).then(([article, comment]) => {
      return { ...article, ...comment };
    });

    return store.dispatch("api/getArticleSlug", slug).then(res => {
      return res.article;
    });
  },
  computed: {
    currentUser() {
      return this.$store.getters["auth/currentUser"];
    },
    isAuth() {
      return !!this.$store.getters["api/isAuth"];
    },
    isCurrentUser() {
      return this.currentUser.username === this.article.author.username;
    }
  },
  methods: {
    parseMarkdown(content) {
      return marked(content);
    },
    deleteComment(id) {
      let params = {
        slug: this.$route.params.slug,
        id
      };
      this.$store.dispatch("api/deleteComment", params).then(res => {
        let targetIdx = this.comments.findIndex(n => {
          return n.id === id;
        });

        if (targetIdx > -1) {
          this.comments.splice(targetIdx, 1);
        }
      });
    },
    submitComment() {
      let params = {
        slug: this.$route.params.slug,
        comment: {
          body: this.commentVal
        }
      };

      this.$store
        .dispatch("api/addComment", params)
        .then(res => {
          this.commentVal = "";
          this.comments.unshift({ ...res.comment });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>