
<template>
  <div class="article-preview">
    <article-meta
      :author="article.author"
      :favorited.sync="article.favorited"
      :favoritesCount.sync="article.favoritesCount"
      :createdAt="article.createdAt"
      :slug="article.slug"
    ></article-meta>
    <nuxt-link
      :to="{ name:'articles-slug', params:{ slug: article.slug } }"
      class="preview-link"
    >
      <h1>{{ article.title }}</h1>
      <p>{{ article.description }}</p>
      <span>Read more...</span>

      <ul class="tag-list">
        <li
          class="tag-default tag-pill tag-outline"
          v-for="(tag, idx) of article.tagList"
          :key="idx"
        >
          <span v-text="tag" />
        </li>
      </ul>
    </nuxt-link>

  </div>
</template>

<script>
import ArticleMeta from "./ArticleMeta";

export default {
  name: "ArticlePreview",
  components: {
    ArticleMeta
  },
  props: {
    article: {
      default: {}
    }
  }
};
</script>
