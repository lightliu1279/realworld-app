<template>
  <nav v-if="pages">
    <no-ssr>
      <paginate
        :page-count="pages"
        :page-range="5"
        :container-class="'pagination'"
        :page-class="'page-item'"
        :page-link-class="'page-link'"
        :click-handler="handleClick"
        :prev-text="'prev'"
        :next-text="'next'"
        :prev-class="'page-item'"
        :next-class="'page-item'"
        :prev-link-class="'page-link'"
        :next-link-class="'page-link'"
      >
      </paginate>
    </no-ssr>
  </nav>
</template>

<script>
const Paginate = process.client ? require('vuejs-paginate') : undefined;

export default {
  name: 'Pagination',
  components: { Paginate },
  props: {
    total: {
      type: Number,
      required: true
    },
    page: {
      type: Number,
      required: true
    },
    perPage: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
    };
  },
  computed: {
    pages() {
      return Math.ceil(this.total / this.perPage);
    }
  },
  methods: {
    handleClick(page) {
      this.$emit('update:page', page);
    }
  }
};
</script>