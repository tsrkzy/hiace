<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%;height: 100%;overflow-y: scroll;">
    <ha-button @click="onCreateChannel">新規作成</ha-button>
    <ul>
      <li v-for="c in channels" :key="c.id">
        <ha-input-form
          :value="c.name"
          @change="onChangeName($event, c.id)"
        ></ha-input-form>
        <ha-button @click="onDeleteChannel(c.id)">削除</ha-button>
      </li>
    </ul>
  </div>
</template>

<script>
import { FSChannel, SYSTEM_CHANNEL_TYPE } from "@/collections/Channel";
import HaButton from "@/components/atoms/HaButton";
import HaInputForm from "@/components/atoms/HaInputForm";
export default {
  name: "ChannelList",
  components: { HaButton, HaInputForm },
  props: {
    floatId: {
      type: Number,
      require: true
    }
  },
  methods: {
    async onChangeName(name, channelId) {
      console.log("ChannelList.onChangeName", name, channelId); // @DELETEME
      await FSChannel.Update(channelId, { name });
    },
    async onCreateChannel() {
      console.log("ChannelList.onCreateChannel"); // @DELETEME
      const type = SYSTEM_CHANNEL_TYPE;
      const name = "新しいチャンネル";
      const room = this.room.id;
      await FSChannel.Create({ type, name, room });
    },
    async onDeleteChannel(channelId) {
      console.log("ChannelList.onClickDelete", channelId); // @DELETEME
      await FSChannel.Delete(channelId);
    }
  },
  computed: {
    room() {
      return this.$store.getters["room/info"];
    },
    channels() {
      return this.$store.getters["channel/info"];
    }
  },
  data() {
    return {};
  }
};
</script>

<style scoped></style>
