<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div v-if="show" :style="overlayStyle" @click.stop="onClickOverlay">
    <div :style="parentAccordionStyle">
      <div
        v-for="item in itemList"
        :key="item.value"
        @click.stop="onClickParent(item)"
      >
        <div
          v-if="item.divider"
          style="border-top: 1px lightgray dashed;"
        ></div>
        <div v-else :style="parentItemStyle">
          {{ item.text
          }}{{
            hasChild(item) ? (selected === item.value ? " = " : " + ") : ""
          }}
        </div>
        <div v-if="selected === item.value" :style="childAccordionStyle">
          <div
            v-for="child in item.children"
            :key="child.value"
            @click.stop="onClickChild(child)"
          >
            <div :style="childItemStyle">
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
  data() {
    return {
      show: false,
      selected: null
    };
  },
  methods: {
    onClickOverlay() {
      this.show = false;
    },
    onClickParent(item) {
      console.log(item); // @DELETEME
      if (item.divider) {
        return false;
      }
      this.selected = item.value;
      console.log(item.value); // @DELETEME
    },
    onClickChild(child) {
      this.selected = child.value;
      console.log(child.value); // @DELETEME
    },
    hasChild(item) {
      return item.children && item.children.length > 0;
    }
  },
  computed: {
    overlayStyle() {
      return {
        position: "fixed",
        top: "0px",
        left: "0px",
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.2)"
      };
    },
    parentAccordionStyle() {
      return {
        position: "absolute",
        left: "25vh",
        top: "25vh",
        color: "dimgray",
        boxShadow: "0.5px 0.5px 2px dimgray"
      };
    },
    parentItemStyle() {
      return {
        cursor: "pointer",
        width: "100px",
        height: "2rem",
        padding: ".5rem",
        backgroundColor: "rgba(255,255,255,0.96)"
      };
    },
    childAccordionStyle() {
      return {
        position: "absolute",
        left: "100px",
        top: "0px",
        color: "dimgray",
        boxShadow: "0.5px 0.5px 2px dimgray"
      };
    },
    childItemStyle() {
      return {
        cursor: "pointer",
        width: "100px",
        height: "2rem",
        padding: ".5rem",
        backgroundColor: "rgba(255,255,255,0.96)"
      };
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

<style scoped></style>
