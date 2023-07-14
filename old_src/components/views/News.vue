<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div>
    <h1>お知らせ</h1>
    <p>内部で使用しているライブラリ(firebase)のバージョンアップを実施。</p>
    <p>この移行期間中も、サービスは引き続き使用可能。</p>
    <h3>進捗</h3>
    <ul>
      <li>使用していた <code>v7</code> は、2022年内でサポート終了</li>
      <li>
        取り急ぎ、<u> <code>v9</code> のv7互換モードに切り替え済み</u>
      </li>
      <li>
        コードを <code>v9</code> 完全対応版に更新したのち、
        <code>v9</code> へ切り替え予定
      </li>
    </ul>
    <h3>リリース</h3>
    <ul>
      <li>rev.20220804.Pokemon_Scarlet/Violet == v7</li>
      <li>
        <span style="color: red; font-weight: bold"
          >rev.20220927.Splatoon3 == v9_v7互換</span
        >
        →
        <a href="https://github.com/tsrkzy/hiace/issues/112" target="_blank"
          >#112</a
        >
      </li>
      <li>
        作業完了 == v9 →
        <a href="https://github.com/tsrkzy/hiace/issues/113" target="_blank"
          >#113</a
        >
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "news",
};
</script>
<style lang="scss" scoped>
div.powered-by {
  margin-top: 2rem;
  p {
    white-space: pre-line;

    &.comment-out {
      font-size: 0.8rem;
      color: steelblue;
    }

    &.src-code {
      font-size: 0.8rem;
      color: gray;

      span {
        &.key1 {
          color: dimgray;
          font-weight: 400;
        }

        &.key2 {
          color: rebeccapurple;
          font-weight: 500;
        }

        &.key3 {
          color: darkorange;
        }
      }

      a {
        text-decoration: underline;
        font-weight: 400;
        color: darkgreen;
      }
    }
  }
}
</style>
