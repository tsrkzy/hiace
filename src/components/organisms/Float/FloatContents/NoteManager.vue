<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%;height: 100%;overflow-y: scroll;">
    <div>
      <ha-select
        :items="noteItems"
        mandatory
        :value="noteId"
        @change="onChangeNote($event)"
      ></ha-select>
      <ha-button @click="onCreateNote">追加</ha-button>
    </div>
    <div>
      <ha-input-form
        :value="name"
        :disabled="!noteId"
        @change="onChangeName($event)"
      ></ha-input-form>
    </div>
    <div>
      <ha-textarea
        class="note-manager__textarea-wrapper"
        :value="text"
        :disabled="!noteId"
        @change="onChangeText($event)"
        rows="10"
        resizeable
      ></ha-textarea>
    </div>
  </div>
</template>

<script>
import { FSNote } from "@/collections/Note";
import HaButton from "@/components/atoms/HaButton";
import HaInputForm from "@/components/atoms/HaInputForm";
import HaSelect from "@/components/atoms/HaSelect";
import HaTextarea from "@/components/atoms/HaTextarea";
export default {
  name: "NoteManager",
  components: { HaButton, HaInputForm, HaTextarea, HaSelect },
  props: {
    floatId: {
      type: Number,
      require: true
    }
  },
  data() {
    return {
      noteId: null,
      name: "",
      text: ""
    };
  },
  methods: {
    async onCreateNote() {
      const roomId = this.room?.id;
      const name = "新しいメモ";
      const text = "";
      const note = await FSNote.Create({ roomId, name, text });
      this.reloadNoteContent(note.id);
    },
    reloadNoteContent(noteId) {
      this.noteId = noteId;
      const { name, text } = this.notes.find(n => n.id === noteId);
      this.name = name;
      this.text = text;
    },
    onChangeNote(noteId) {
      this.reloadNoteContent(noteId);
    },
    async onChangeName(name) {
      this.name = name;
      await FSNote.Update(this.noteId, { name });
    },
    async onChangeText(text) {
      this.text = text;
      await FSNote.Update(this.noteId, { text });
    }
  },
  computed: {
    room() {
      return this.$store.getters["room/info"];
    },
    notes() {
      return this.$store.getters["note/info"];
    },
    noteItems() {
      return this.notes.map(n => ({ value: n.id, text: n.name }));
    }
  }
};
</script>

<style scoped></style>
