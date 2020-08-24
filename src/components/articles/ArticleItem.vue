<template>
  <article>
    <h1>
      {{ title }}
      <span>{{ createdAtString }}</span>
    </h1>
    <section v-html="parsedMarkdown"></section>
  </article>
</template>
<script>
import marked from 'marked'
import moment from 'moment'

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    createdAt: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  computed: {
    createdAtString () {
      return moment(this.createdAt).format('YYYY-MM-DD')
    },
    parsedMarkdown () {
      return marked(this.content.replace(/\\n/g, '\n'))
    }
  }
}
</script>
