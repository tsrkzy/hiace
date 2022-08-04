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
        <div
          :class="{
            contextmenu: true,
            'contextmenu-parent__item': true,
            disabled: item.disabled
          }"
        >
          <span>{{ item.text }}</span
          ><span>{{
            hasChild(item) ? (open === item.value ? " ▼" : " ▶") : ""
          }}</span>
        </div>
        <div
          v-if="open === item.value"
          :class="{
            contextmenu: true,
            'contextmenu-child__accordion': true,
            disabled: item.disabled
          }"
        >
          <div
            v-for="child in item.children"
            :key="child.value"
            @click.stop="onClickItem(child)"
          >
            <div
              :class="{
                contextmenu: true,
                'contextmenu-child__item': true,
                disabled: child.disabled
              }"
            >
              {{ child.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ContextMenuChildItem,
  ContextMenuParentItem
} from "@/scripts/Contextmenu/ContextMenu";

export default {
  name: "ContextMenu",
  methods: {
    onClickOverlay() {
      this.$store.dispatch("contextmenu/off");
    },
    async onClickItem(item) {
      if (item.disabled) {
        console.log("contextmenu item is disabled"); // @DELETEME
        return false;
      }
      if (item instanceof ContextMenuChildItem) {
        await item.callback();
        await this.$store.dispatch("contextmenu/off");
      } else if (item instanceof ContextMenuParentItem) {
        await item.callback();
        await this.$store.dispatch("contextmenu/open", { open: item.value });
      }
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
    width: 150px;
    height: 2rem;
    padding: 0.5rem;
    background-color: ghostwhite;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow-x: hidden;
    &:hover {
      background-color: lightgray;
    }
    &.disabled {
      cursor: not-allowed;
      text-decoration-line: line-through;
      color: gray;
    }
  }
  &.contextmenu-child__accordion {
    position: absolute;
    left: 150px;
    top: 0px;
    color: dimgray;
    box-shadow: 0.5px 0.5px 2px dimgray;
  }
  &.contextmenu-child__item {
    cursor: pointer;
    width: 150px;
    height: 2rem;
    padding: 0.5rem;
    background-color: ghostwhite;
    &:hover {
      background-color: lightgray;
    }
    &.disabled {
      cursor: not-allowed;
      text-decoration-line: line-through;
      color: gray;
    }
  }
}
</style>
