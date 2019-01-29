
<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">

          <error-message
            v-show="error"
            :errors="error"
          ></error-message>

          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  v-model="article.title"
                  :disabled="sending"
                >
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  v-model="article.description"
                  :disabled="sending"
                >
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  v-model="article.body"
                  :disabled="sending"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  v-model="tagInput"
                  v-on:keypress.enter.prevent="addTag(tagInput)"
                  :disabled="sending"
                >

              </fieldset>
              <fieldset v-if="article.tagList.length">
                <div class="tag-list">
                  <span
                    class="tag-default tag-pill"
                    v-for="(tag, index) of article.tagList"
                    :key="tag + index"
                  >
                    <i
                      class="ion-close-round"
                      @click="removeTag(tag);"
                    >
                    </i>
                    {{ tag }}
                  </span>
                </div>

              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                :disabled="sending"
                @click="onPublish()"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import ErrorMessage from "@/components/ErrorMessage";

export default {
  name: "Editor",
  components: {
    ErrorMessage
  },
  head() {
    return {
      title: "New Article - Conduit"
    };
  },
  middleware: ["auth-require"],
  asyncData({ $axios, params, store }) {
    const slug = params.slug;
    let data = {
      article: {
        title: "",
        description: "",
        body: "",
        tagList: []
      },
      tagInput: "",
      sending: false,
      error: null
    };
    if (!slug) {
      return data;
    }

    return store.dispatch("api/getArticleSlug", slug).then(res => {
      return { ...data, article: res.article };
    });
  },
  methods: {
    addTag(tag) {
      this.article.tagList.push(tag);
      this.tagInput = null;
    },
    removeTag(tag) {
      let targetIdx = this.article.tagList.findIndex(t => {
        return t === tag;
      });

      if (targetIdx > -1) {
        this.article.tagList.splice(targetIdx, 1);
      }
    },
    onPublish() {
      this.sending = true;
      let url = "api/createArticle";
      if (this.article.slug) {
        url = "api/updateArticle";
      }

      this.$store
        .dispatch(url, this.article)
        .then(res => {
          this.sending = false;

          if (this.article.slug) {
            this.$router.push({
              name: "articles-slug",
              params: { slug: this.article.slug }
            });
          } else {
            this.$router.push({ name: "index" });
          }
        })
        .catch(err => {
          // console.log(err)
          this.sending = false;
          this.error = err && err.response.data.errors;
        });
    }
  }
};
</script>
