<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div
    class="__hide_on_drag"
    :style="{
      backgroundColor: 'transparent',
      position: 'absolute',
      height: '200px',
      width: '100%',
      left: 0,
      top: `-${height}px`
    }"
    @mouseenter="onEnter($event)"
  >
    <div
      class="alias-board__alias_container"
      :style="{
        height: `${height}px`,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.2)'
      }"
    >
      <alias
        class="alias"
        :key="c.characterId"
        v-for="c in characterItems"
        :character-id="c.characterId"
        :alias-id="c.aliasId"
        :chat-position="c.chatPosition"
        :image="c.image"
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
      height: 200
    };
  },
  methods: {
    onEnter(e) {
      const $el = e.currentTarget;
      $el.style.display = "none";
      setTimeout(onTimeout, 2000);
      function onTimeout() {
        $el.style.display = "";
      }
    }
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

      const counter = new Map();
      for (let i = 0; i < chats.length; i++) {
        const chat = chats[chats.length - (i + 1)];
        const { character: characterId } = chat;

        /* characterを持たないchatは無視 */
        if (!characterId) {
          continue;
        }

        /* 直近で発言した10名のcharacterのみ */
        if (counter.has(characterId)) {
          continue;
        }
        counter.set(characterId, true);

        for (let j = 0; j < characters.length; j++) {
          const { id, activeAlias, chatPosition } = characters[j];

          if (characterId !== id) {
            continue;
          }

          for (let k = 0; k < aliases.length; k++) {
            const a = aliases[k];
            if (activeAlias === a.id) {
              items.push({
                characterId,
                aliasId: a.id,
                chatPosition,
                image: a.image
              });
              break;
            }
          }
        }

        /* 直近で発言した10名のcharacterのみ */
        if (Array.from(counter.keys()).length >= 10) {
          break;
        }
      }

      items.reverse();
      return items;
    }
  }
};
</script>
