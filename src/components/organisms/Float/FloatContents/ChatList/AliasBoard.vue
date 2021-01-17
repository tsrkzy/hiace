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
      :style="{
        height: `${height}px`,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.2)'
      }"
    >
      <alias
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
      console.log("AliasBoard.onEnter"); // @DELETEME
      const $el = e.currentTarget;
      $el.style.display = "none";
      setTimeout(onTimeout, 2000);
      function onTimeout() {
        console.log("AliasBoard.onTimeout"); // @DELETEME
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
    characterItems() {
      const items = [];

      const { characters = [], aliases = [] } = this;
      for (let i = 0; i < characters.length; i++) {
        const { id: characterId, activeAlias, chatPosition } = characters[i];
        for (let j = 0; j < aliases.length; j++) {
          const a = aliases[j];
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

      return items;
    }
  }
};
</script>
