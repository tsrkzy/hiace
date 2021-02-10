<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div
    v-if="show"
    class="contextmenu contextmenu-overlay"
    @click.stop="onClickOverlay"
    @contextmenu.prevent.stop
  >
    <div
      class="contextmenu contextmenu-parent__accordion"
      :style="{
        top: `${y + 5}px`,
        left: `${x + 5}px`
      }"
    >
      <div
        v-for="item in itemList"
        :key="item.value"
        @click.stop="onClickItem(item)"
      >
        <div class="contextmenu contextmenu-parent__item">
          {{ item.text
          }}{{ hasChild(item) ? (open === item.value ? " = " : " + ") : "" }}
        </div>
        <div
          v-if="open === item.value"
          class="contextmenu contextmenu-child__accordion"
        >
          <div
            v-for="child in item.children"
            :key="child.value"
            @click.stop="onClickItem(item)"
          >
            <div class="contextmenu contextmenu-child__item">
              {{ child.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContextMenu",
  methods: {
    onClickOverlay() {
      this.$store.dispatch("contextmenu/off");
    },
    async onClickItem(item) {
      console.log("ContextMenu.onClickItem", typeof item);
      await item.callback();
      await this.$store.dispatch("contextmenu/off");
    },
    hasChild(item) {
      return item.children && item.children.length > 0;
    }
  },
  computed: {
    show() {
      return this.$store.getters["contextmenu/show"];
    },
    x() {
      return this.$store.getters["contextmenu/x"] ?? 0;
    },
    y() {
      return this.$store.getters["contextmenu/y"] ?? 0;
    },
    itemGroups() {
      return this.$store.getters["contextmenu/itemGroups"];
    },
    open: {
      get() {
        return this.$store.getters["contextmenu/open"];
      },
      set(open) {
        this.$store.dispatch("contextmenu/open", { open });
      }
    },
    itemList() {
      return this.itemGroups;
    }
  }
};
</script>

<style scoped lang="scss">
div.contextmenu {
  &.contextmenu-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.2);
  }
  &.contextmenu-parent__accordion {
    position: absolute;
    left: 0;
    top: 0;
    color: dimgray;
    box-shadow: 0.5px 0.5px 2px dimgray;
  }
  &.contextmenu-parent__divider {
    border-top: 1px lightgray dashed;
  }
  &.contextmenu-parent__item {
    cursor: pointer;
    width: 180px;
    height: 2rem;
    padding: 0.5rem;
    background-color: rgba(255, 255, 255, 0.96);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow-x: hidden;
    &:hover {
      background-color: lightgray;
    }
  }
  &.contextmenu-child__accordion {
    position: absolute;
    left: 180px;
    top: 0px;
    color: dimgray;
    box-shadow: 0.5px 0.5px 2px dimgray;
  }
  &.contextmenu-child__item {
    cursor: pointer;
    width: 180px;
    height: 2rem;
    padding: 0.5rem;
    background-color: rgba(255, 255, 255, 0.96);
    &:hover {
      background-color: lightgray;
    }
  }
}
</style>
