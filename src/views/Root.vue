<template>
  <section>
    <the-header />
    <main>
      <ul>
        <li
          v-for="article in articles"
          :key="article.id"
        >
          <article-item v-bind="article" />
        </li>
      </ul>
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
      articles: []
    }
  },
  created () {
    this.db = firebase.firestore()
    this.db.collection('articles').onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const article = doc.data()
        article.id = doc.id
        this.articles.push(article)
      })
    })
  }
}
</script>
