<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script>
  import AliasPortrait from "@/component/float/ChatManager/AliasPortrait.svelte";
  import { ALIAS_DISPLAY_HEIGHT } from "@/constant";
  import { useAliases } from "@/model/store/aliases";
  import { useCharacters } from "@/model/store/characters";
  import { useChats } from "@/model/store/chats";
  import { toCSS } from "@/util/style";

  const { characters } = useCharacters();
  const { chats } = useChats();
  const { aliases } = useAliases();

  const displayBaseStyle = toCSS({
    top: `-${ALIAS_DISPLAY_HEIGHT}px`,
    height: `${ALIAS_DISPLAY_HEIGHT}px`
  });

  $: portraits = (() => {
    const items = [];

    const cMap = new Map();
    const pMap = new Map();

    /* 最終チャットの立ち絵が最も手前にくるので逆順でシーク */
    for (let i = 0; i < $chats.length; i++) {
      const chat = $chats[$chats.length - (i + 1)];
      const { character: characterId } = chat;

      /* characterを持たないchatは無視 */
      if (!characterId) {
        continue;
      }

      /* 同じキャラの発言は、最も(逆順で)直近の発言に対して立ち絵を表示 */
      if (cMap.has(characterId)) {
        continue;
      }
      cMap.set(characterId, true);

      for (let j = 0; j < $characters.length; j++) {
        const {
          id,
          activeAlias,
          chatPosition,
          archived = false,
        } = $characters[j];

        if (archived) {
          continue;
        }

        if (characterId !== id) {
          continue;
        }

        const top = !pMap.has(chatPosition);
        if (top) {
          pMap.set(chatPosition, characterId);
        }

        for (let k = 0; k < $aliases.length; k++) {
          const a = $aliases[k];
          if (activeAlias === a.id) {
            items.push({
              characterId,
              aliasId: a.id,
              chatPosition,
              imageId: a.image,
              top,
            });
            break;
          }
        }
      }

      /* 直近で発言した10名のcharacterのみ */
      if (items.length >= 10) {
        break;
      }
    }

    items.reverse();

    return items;
  })();
</script>

<div class="alias-display" style={displayBaseStyle}>
</div>
<div class="alias-portraits" style={displayBaseStyle}>
  {#each portraits as p (p.characterId)}
    <AliasPortrait portrait={p}></AliasPortrait>
  {/each}
</div>

<style lang="scss">
  div.alias-display {
    position: absolute;
    width: 100%;
    left: 0;
    background-color: black;
    opacity: 0.2;
  }

  div.alias-portraits {
    position: absolute;
    width: 100%;
    left: 0;
    background-color: transparent;
  }
</style>