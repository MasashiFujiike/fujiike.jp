[ログの設計](https://fujiike.jp/article/E7SrhAW1nXukqxvVxTAO)で検討した内容を踏まえて、以下の項目を整理する。

- フォーマットを定義する
- 主要なプラットフォームやフレームワークでの実装例

## ログのフォーマット

前提として、ログそれ自体ははテキストデータとして保持されると仮定して考える。<br>
これは、特定のプログラムの中のクラスオブジェクトなどの形で定義すると、保存・利用できる範囲が大幅に制限されるため。

選択肢としては、以下のようにいくつかのフォーマットが挙げられる。

- JSON
- 任意の形式のテキストデータ
- XML
- YAML

結論としては、JSON形式で解釈可能なテキストを出力するとよいと思う。

`ログに求められる要件` で記載した要件を満たすにあたって、以下の要件に適合する度合いが高いのがJSON、というのが主な理由。

> 検索しやすい<br>
> 外部ツールと連携しやすい<br>
> 状況によって異なる構造のデータを記録できる

JSONは

- ほとんどの言語でparseすることができ、またjsonを生成することが容易であること
- jq などのformatterツールが多く、検索や取り出しに向いていること
- Datadog や BigQuery など各種SaaS・クラウドツールなどが、JSON形式で書き込まれた情報に対する検索性を向上していること

を理由として選定した。

YAMLはデータ記述言語としてはJSONに次ぐ性能を持っており、単体のファイルとしての可視性はJSON以上(主観だけど)だが、改行前提で設計されているデータ形式のため、平文で保存することを想定したログの記述言語としては不適切と考えた。

## Vue.jsでのログ取得の事例

取得したい項目は以下とする。
繰り返しになるが、項目自体の設定背景などは[ログの設計](https://fujiike.jp/article/E7SrhAW1nXukqxvVxTAO)を参照のこと。

- アクセス日時・処理日時
- ログレベル
- アプリケーションのバージョン
- 実行環境の情報
- 処理したサーバーのIPアドレス (※ここは現実的に取れないケースが多いため、ホスト名で代用する)
- stacktrace
- エラーメッセージ
- エラー発生時点での変数・定数のログ
- 実行されたページのURL・エンドポイント
- クエリストリング
- 実行されたJSファイル名
- 依存しているcookieのキーと値
- アクセス元端末のOSの種類
- アクセス元端末のOSのバージョン
- ブラウザの名称
- ブラウザのバージョン情報
- UserAgent文字列

### 前提：JavaScriptにおけるエラーオブジェクト

基本的に、エラーのログを取る場合はエラーオブジェクトの仕様に沿って必要な情報を取りに行くことになる。
以下のリファレンスなどを参考に、エラーオブジェクトそのものを理解すること。

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Error

#### ちょっと趣旨違うけどこれ良さそう

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Errors

### ログデータの取得例

フォーマットはESLintのstandard-styleに準拠する。

#### 下準備

```vue.config.js
// 参考) http://kana-linux.info/vue-js/vue%E3%81%A7package-json%E3%81%AE%E3%83%90%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%B3%E3%82%92%E8%AA%AD%E3%81%BF%E8%BE%BC%E3%82%80
process.env.VUE_APP_APP_VERSION = require('./package.json').version
```

```src/config/env.js
// 参考) https://qiita.com/miiiiiiika/items/b7dd0913d1753a01464d
// 実行時の環境変数などをもとに、アプリに必要な情報を管理する。
// process.envを毎回正直に呼んでもいい。
export default {
  nodeEnv: process.env.NODE_ENV,
  appVersion: process.env.VUE_APP_APP_VERSION
}
```

#### 予期しないエラーによりconsoleでエラーが出力されているようなケースの対応

`xxx is undefined` とか `xxx is not a function` とか出たりするのはこちら。実装の不備などが主な原因となる。

```main.js
// 以下の内容を追記
// 参考) http://sms-c-engineer.hatenablog.com/entry/2018/04/24/142445
Vue.config.errorHandler = (err, vm, info) => {
  // 例外がループしないようにtry-catch
  try {
    const log = {
      // アクセス日時・処理日時
      createdAt: moment().format('YYYY-MM-DD HH:mm:SS'),
      // ログレベル
      level: 'WARNING',
      // アプリケーションのバージョン
      appVersion: env.appVersion,
      // 実行環境の情報
      env: env.nodeEnv,
      // 処理したサーバーのIPアドレス
      ip: location.host,
      // stacktrace
      stacktrace: e.stack,
      // エラーメッセージ
      message: e.message,
      // エラー発生時点での変数・定数のログ
      vars: {
        // 取れないので空オブジェクトで送信する
      },
      // 実行されたページのURL・エンドポイント
      url: location.href,
      // クエリストリング
      params: location.search,
      // 実行されたJSファイル名
      file: e.fileName,
      // 依存しているcookieのキーと値
      cookie: {
        // 処理ごとに異なるので、オブジェクトで持たせる
      },
      // アクセス元端末のOSの種類
      os: platform.os.family,
      // アクセス元端末のOSのバージョン
      osVersion: platform.os.version,
      // ブラウザの名称
      browser: platform.name,
      // ブラウザのバージョン情報
      browserVersion: platform.version,
      // UserAgent文字列 
      userAgent: platform.ua
    }
    // ログを外部ツールなどに書き込む処理
    // 大抵の場合は非同期の書き込みAPIを呼び出して完了となる
  } catch (e) {
  }
}
```

#### 明示的にエラーをキャッチできるケースでの対応

ハンドリングできているという意味では扱いやすい部類に入る。
参考) https://qiita.com/clomie/items/73fa1e9f61e5b88826bc

```src/components/SampleComponent.vue
// 時刻の取り扱いを安定させるため、 moment.js の利用を推奨したい
import moment from 'moment'
// JavaScriptでのブラウザ・OS判定は原則、UserAgentに依存する
// ブラウザやOSの判定には platform.js を用いた方がやりやすい
// 参考) https://s8a.jp/javascript-platform-js#platform%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%81%AE%E5%AE%9A%E7%BE%A9
// 自作するにはUserAgent文字列パターンへの理解が必要で、platform.jsを用いないメリットはキリッキリにチューニングしたいときや、
// WebViewからの独自UA解析をしたいときを除いてほとんどないと言っていいと思う。
import platform from 'platform'
import env from '@/config/env'

export default {
  methods: {
    sampleMethod () {
      try {
        // 失敗する処理
      } catch (e) {
        const log = {
          // アクセス日時・処理日時
          createdAt: moment().format('YYYY-MM-DD HH:mm:SS'),
          // ログレベル
          level: 'WARNING',
          // アプリケーションのバージョン
          appVersion: env.appVersion,
          // 実行環境の情報
          env: env.nodeEnv,
          // 処理したサーバーのIPアドレス
          ip: location.host,
          // stacktrace
          stacktrace: e.stack,
          // エラーメッセージ
          message: e.message,
          // エラー発生時点での変数・定数のログ
          vars: {
            // 処理ごとに異なるので、オブジェクトで持たせる
          },
          // 実行されたページのURL・エンドポイント
          url: location.href,
          // クエリストリング
          params: location.search,
          // 実行されたJSファイル名
          file: e.fileName,
          // 依存しているcookieのキーと値
          cookie: {
            // 処理ごとに異なるので、オブジェクトで持たせる
          },
          // アクセス元端末のOSの種類
          os: platform.os.family,
          // アクセス元端末のOSのバージョン
          osVersion: platform.os.version,
          // ブラウザの名称
          browser: platform.name,
          // ブラウザのバージョン情報
          browserVersion: platform.version,
          // UserAgent文字列 
          userAgent: platform.ua
        }
        // ログを外部ツールなどに書き込む処理
        // 大抵の場合は非同期の書き込みAPIを呼び出して完了となる
      }
    }
  }
}
```

### Golang - labstack/echo でのログ取得の事例

### Golang - gin-gonic/gin でのログ取得の事例
