<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div class="float-content">
    <character-list :float-id="floatId" v-if="contentId === 1"></character-list>
    <board-list :float-id="floatId" v-else-if="contentId === 2"></board-list>
    <chat-list :float-id="floatId" v-else-if="contentId === 3"></chat-list>
    <div :float-id="floatId" v-else-if="contentId === 4">4</div>
    <div :float-id="floatId" v-else>content not found: {{ contentId }}</div>
  </div>
</template>

<script>
import BoardList from "@/components/organisms/FloatContents/BoardList";
import CharacterList from "@/components/organisms/FloatContents/CharacterList";
import ChatList from "@/components/organisms/FloatContents/ChatList";
export default {
  name: "FloatContent",
  components: { ChatList, BoardList, CharacterList },
  props: {
    floatId: {
      type: Number,
      require: true
    },
    contentId: {
      type: Number,
      require: true
    }
  }
};
</script>

<style scoped lang="scss">
.float-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
