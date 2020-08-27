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
import hljs from 'highlightjs'
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
  created () {
    marked.setOptions({
      langPrefix: '',
      highlight: (code, lang) => {
        return hljs.highlightAuto(code, [lang]).value
      }
    })
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
