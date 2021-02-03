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
      script: [<a href="https://github.com/tsrkzy/hiace" target="_blank"
        >"tsrkzy"</a
      >], hosting:
      <a href="https://firebase.google.com/" target="_blank">"firebase"</a>,
      frameworks: [<a href="https://jp.vuejs.org/index.html" target="_blank"
        >"vuejs"</a
      >,&nbsp;
      <a href="https://necolas.github.io/normalize.css/" target="_blank"
        >"Normalize.css"</a
      >] });
    </p>
  </div>
</template>
<script>
export default {
  name: "powered-by"
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
          color: darkorange;
          font-weight: 400;
        }

        &.key2 {
          color: rebeccapurple;
        }
      }

      a {
        text-decoration: none;
        font-weight: 400;
        color: darkgreen;
      }
    }
  }
}
</style>
