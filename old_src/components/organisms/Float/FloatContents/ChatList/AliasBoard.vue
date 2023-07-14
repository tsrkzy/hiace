<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div
    class="__hide_on_drag alias-board__container"
    :style="{ top: `-${height}px` }"
    @mouseenter="onEnter($event)"
  >
    <div
      class="alias-board__alias_container"
      :style="{
        height: `${height}px`,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.2)',
      }"
    >
      <alias
        :key="c.characterId"
        v-for="c in characterItems"
        :character-id="c.characterId"
        :alias-id="c.aliasId"
        :chat-position="c.chatPosition"
        :image="c.image"
        :top="c.top"
      />
    </div>
  </div>
</template>

<script>
import Alias from "@/components/organisms/Float/FloatContents/ChatList/Alias";

export default {
  name: "AliasBoard",
  components: { Alias },
  data() {
    return {
      height: 200,
      timeoutId: null,
    };
  },
  methods: {
    onEnter(e) {
      const $el = e.currentTarget;
      $el.style.opacity = ".7";
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      this.timeoutId = setTimeout(onTimeout, 2000);
      function onTimeout() {
        $el.style.opacity = "1";
      }
    },
  },
  computed: {
    characters() {
      return this.$store.getters["character/info"];
    },
    aliases() {
      return this.$store.getters["alias/info"];
    },
    chats() {
      return this.$store.getters["chat/info"];
    },
    characterItems() {
      const items = [];

      const { chats = [], characters = [], aliases = [] } = this;

      const cMap = new Map();
      const pMap = new Map();

      /* 最終チャットの立ち絵が最も手前にくるので逆順でシーク */
      for (let i = 0; i < chats.length; i++) {
        const chat = chats[chats.length - (i + 1)];
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

        for (let j = 0; j < characters.length; j++) {
          const {
            id,
            activeAlias,
            chatPosition,
            archived = false,
          } = characters[j];

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

          for (let k = 0; k < aliases.length; k++) {
            const a = aliases[k];
            if (activeAlias === a.id) {
              items.push({
                characterId,
                aliasId: a.id,
                chatPosition,
                image: a.image,
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
    },
  },
};
</script>
<style scoped lang="scss">
div.alias-board__container {
  background-color: transparent;
  position: absolute;
  height: 200px;
  width: 100%;
  left: 0;
  transition: opacity 200ms;
}
</style>
