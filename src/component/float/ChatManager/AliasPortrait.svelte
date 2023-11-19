<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { useImageSources } from "@/model/store/imageSources";
  import { toCSS } from "@/util/style";
  import { useCharacters } from "@/model/store/characters";
  import { useAliases } from "@/model/store/aliases";
  import { DEFAULT_PAWN_IMAGE_URL } from "@/constant.js";

  export let portrait: {
    characterId: string,
    aliasId: string,
    chatPosition: number,
    imageId: string,
    top: boolean,
  }

  const { imageSources } = useImageSources();
  const { characters } = useCharacters();
  const { aliases } = useAliases()
  $: character = $characters.find((character) => character.id === portrait.characterId)
  $: alias = $aliases.find((alias) => alias.id === portrait.aliasId)

  $: billBoard = `${character?.name}(${alias?.name})`
  $: imgSrc = $imageSources.find((i) => i.id === portrait.imageId)

  $: portraitStyle = (() => {
    const styleObj = {
      left: `calc(${portrait.chatPosition} * 90% / 12)`,
      height: '100%',
    }

    return toCSS(styleObj)
  })()
</script>

<div class="portrait" style={portraitStyle}>
  <span class="billboard">{ billBoard }</span>
  <div class="balloon-container">
    <svg class="balloon" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="25" rx="2" ry="2" class="mumble"></ellipse>
      <ellipse cx="40" cy="16" rx="5" ry="5" class="mumble"></ellipse>
      <ellipse cx="21" cy="11" rx="20" ry="10" class="mumble"></ellipse>
      <ellipse cx="10" cy="11" rx="1" ry="1" class="mumble dot"></ellipse>
      <ellipse cx="20" cy="11" rx="1" ry="1" class="mumble dot"></ellipse>
      <ellipse cx="30" cy="11" rx="1" ry="1" class="mumble dot"></ellipse>
    </svg>
  </div>
  <img src={imgSrc ? imgSrc?.url: DEFAULT_PAWN_IMAGE_URL} alt="alias-portrait"/>
</div>

<style lang="scss">
  div.portrait {
    border-left: solid 1px black;
    max-height: 100%;
    position: absolute;
    top: 0;

    span.billboard {
      position: absolute;
      top: 0;
      left: 0;
      background: linear-gradient(-0.25turn, rgba(0,0,0,0), black);
      color: white;
      width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    div.balloon-container {
      position: absolute;
      top: -30px;
      left: 10px;
      opacity: 0;

      svg.balloon {
        width: 100px;
        height: 30px;

        ellipse.mumble {
          stroke: dimgray;
          fill: white;

          &.dot {
            stroke: none;
            fill: dimgray;
          }
        }
      }
    }

    img {
      max-height: 100%;
    }
  }
</style>
