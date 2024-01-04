<!-----------------------------------------------------------------------------
  - Copyright (c) 2024.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { useBoards } from "@/model/store/boards";

  const { transform } = useBoards()

  $: domMatrix = (() =>{
    const { e, f } = $transform
    const r = Math.sqrt(e * e + f * f);
    const a = r === 0 ? 1 : e / r;
    const b = r === 0 ? 0 : f / r;
    const c = r === 0 ? 0 : -f / r;
    const d = r === 0 ? 1 : e / r;
    return new DOMMatrix([a, b, c, d, 40, 40])
  })();

  const W = 20;
  const h = W / 2;
  const weathercockPath =
    `M -${W / 2},-${h / 2} l ${W},${h / 2} l -${W},${h / 2} l 0,-${
      W / 2
    } z`;
  // <!--transform: {`${transformStr}`};-->

</script>

<path
    id="weathercock"
    style="
          stroke: gray;
          fill: lightgray;
          fill-opacity: 0.8;
          transform: {domMatrix}
"
    d={weathercockPath}
></path>
<circle cx="40" cy="40" r="20" style="
        stroke:rgba(0,0,0,0.4);
        stroke-dasharray: 3;
        fill: transparent;
        "
></circle>