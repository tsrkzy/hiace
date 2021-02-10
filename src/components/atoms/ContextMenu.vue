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
  >
    <div
      class="contextmenu contextmenu-parent__accordion"
      :style="{
        top: `${y}px`,
        left: `${x}px`
      }"
    >
      <div
        v-for="item in itemList"
        :key="item.value"
        @click.stop="onClickParent(item)"
      >
        <div
          v-if="item.divider"
          class="contextmenu contextmenu-parent__divider"
        ></div>
        <div v-else class="contextmenu contextmenu-parent__item">
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
            @click.stop="onClickChild(child)"
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
    onClickParent(item) {
      console.log(item); // @DELETEME
      if (item.divider) {
        return false;
      }
      this.open = item.value;
      console.log(item.value); // @DELETEME
    },
    onClickChild(child) {
      this.open = child.value;
      console.log(child.value); // @DELETEME
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
    open: {
      get() {
        return this.$store.getters["contextmenu/open"];
      },
      set(open) {
        this.$store.dispatch("contextmenu/open", { open });
      }
    },
    itemList() {
      const itemList = [];
      const divider = i => ({ value: `divider_${i}`, divider: true });
      const items = this.items;
      for (let i = 0; i < items.length; i++) {
        const g = items[i];
        if (i !== items.length - 1) {
          itemList.push(...g, divider(i));
        } else {
          itemList.push(...g);
        }
      }
      return itemList;
    },
    items() {
      return [
        [
          {
            value: 1,
            text: "メニュー_1",
            disabled: false,
            children: [
              { value: "1-2", text: "メニュー_1_2", disabled: false },
              { value: "1-3", text: "メニュー_1_3", disabled: false }
            ]
          },
          { value: 2, text: "メニュー_2", children: [], disabled: false }
        ],
        [
          {
            value: 3,
            text: "メニュー_3",
            children: [
              { value: "3-1", text: "メニュー_3_1", disabled: false },
              { value: "3-2", text: "メニュー_3_2", disabled: false }
            ],
            disabled: false
          }
        ],
        [
          { value: 4, text: "メニュー_4", children: [], disabled: false },
          {
            value: 5,
            text: "メニュー_5",
            children: [
              { value: "5-1", text: "メニュー_5_1", disabled: false },
              { value: "5-2", text: "メニュー_5_2", disabled: false },
              { value: "5-3", text: "メニュー_5_3", disabled: false },
              { value: "5-4", text: "メニュー_5_4", disabled: false },
              { value: "5-5", text: "メニュー_5_5", disabled: false },
              { value: "5-6", text: "メニュー_5_6", disabled: false },
              { value: "5-7", text: "メニュー_5_7", disabled: false },
              { value: "5-8", text: "メニュー_5_8", disabled: false },
              { value: "5-9", text: "メニュー_5_9", disabled: false },
              { value: "5-10", text: "メニュー_5_10", disabled: false },
              { value: "5-11", text: "メニュー_5_11", disabled: false },
              { value: "5-12", text: "メニュー_5_12", disabled: false }
            ],
            disabled: false
          },
          { value: 6, text: "メニュー_6", children: [], disabled: false }
        ]
      ];
    }
  }
};
</script>

<style scoped lang="scss">
div.contextmenu {
  &.contextmenu-overlay {
    position: fixed;
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
    width: 100px;
    height: 2rem;
    padding: 0.5rem;
    background-color: rgba(255, 255, 255, 0.96);
    &:hover {
      background-color: lightgray;
    }
  }
  &.contextmenu-child__accordion {
    position: absolute;
    left: 100px;
    top: 0px;
    color: dimgray;
    box-shadow: 0.5px 0.5px 2px dimgray;
  }
  &.contextmenu-child__item {
    cursor: pointer;
    width: 100px;
    height: 2rem;
    padding: 0.5rem;
    background-color: rgba(255, 255, 255, 0.96);
    &:hover {
      background-color: lightgray;
    }
  }
}
</style>
