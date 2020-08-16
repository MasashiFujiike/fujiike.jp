<template>
  <article>
    <h2>
      {{ article.title }}
      <span>{{ article.createdAt }}</span>
    </h2>
    <section v-html="parsedMarkdown"></section>
  </article>
</template>
<script>
import marked from 'marked'

export default {
  data () {
    return {
      article: {
        title: 'タイトルのサンプル',
        createdAt: '2020/07/04',
        content: '本文のサンプル1。\n\n本文のサンプル2。\n\n- リストのサンプル1\n- リストのサンプル2\n- リストのサンプル3\n\n本文のサンプル3。\n\n十分に長いテキストが入った本文のサンプル。あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。またそのなかでいっしょになったたくさんのひとたち、ファゼーロとロザーロ、羊飼のミーロや、顔の赤いこどもたち、地主のテーモ、山猫博士のボーガント・デストゥパーゴなど、いまこの暗い巨きな石の建物のなかで考えていると、みんなむかし風のなつかしい青い幻燈のように思われます。では、わたくしはいつかの小さなみだしをつけながら、しずかにあの年のイーハトーヴォの五月から十月までを書きつけましょう。\n\n### 見出しのサンプル1\n\n改行を含む本文のサンプル。<br>改行を含む本文のサンプル\n\n<b>太字</b>を含む本文のサンプル。'
      }
    }
  },
  computed: {
    parsedMarkdown () {
      return marked(this.article.content)
    }
  }
}
</script>
