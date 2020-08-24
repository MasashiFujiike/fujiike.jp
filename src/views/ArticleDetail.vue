<template>
  <section>
    <the-header />
    <main>
      <article-item
        v-if="article"
        v-bind="article"
      />
    </main>
  </section>
</template>
<script>
import firebase from 'firebase/app'
import 'firebase/firestore'

import TheHeader from '@/components/TheHeader'
import ArticleItem from '@/components/articles/ArticleItem'

export default {
  components: { TheHeader, ArticleItem },
  data () {
    return {
      db: null,
      article: null
    }
  },
  created () {
    this.db = firebase.firestore()
    this.db.collection('articles').onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.id === this.$route.params.articleId) {
          const article = doc.data()
          article.id = doc.id
          this.article = article
        }
      })
    })
  }
}
</script>
