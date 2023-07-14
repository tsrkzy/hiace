<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div class="powered-by">
    <p class="comment-out">/* hiace: onlineTRPG session utility */</p>
    <p class="src-code">
      <span class="key1">this</span>.<span class="key2">isPoweredBy</span>({
      <span class="key3">script</span>: [
      <a href="https://github.com/tsrkzy/hiace" target="_blank">"tsrkzy"</a> ],
      <span class="key3">hosting</span>:
      <a href="https://firebase.google.com/" target="_blank">"firebase"</a>,
      <span class="key3">frameworks</span>: [
      <a href="https://jp.vuejs.org/index.html" target="_blank">"vuejs"</a
      >,&nbsp;
      <a href="https://necolas.github.io/normalize.css/" target="_blank"
        >"Normalize.css"</a
      >
      ] });
    </p>
  </div>
</template>
<script>
export default {
  name: "powered-by",
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
