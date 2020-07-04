<template>
  <section>
    <the-header />
    <main>
      <ul>
        <li>
          <article-item />
        </li>
      </ul>
    </main>
  </section>
</template>
<script>
import TheHeader from '@/components/TheHeader'
import ArticleItem from '@/components/articles/ArticleItem'

export default {
  components: { TheHeader, ArticleItem }
}
</script>
