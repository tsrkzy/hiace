<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<div class="notice-bar">
  <span><slot /></span>
</div>

<style>
    .notice-bar {
        border-left: 2px solid orangered;
        background-color: dimgray;
        color: ghostwhite;
        margin: 0.5rem;
        padding: 0.5rem;
        max-width: 30vw;
        max-height: 30px;
        white-space: nowrap;
        word-break: keep-all;
        border-radius: 2px;
    }
</style>