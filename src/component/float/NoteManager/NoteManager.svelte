<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { useNotes } from "@/model/store/notes";
  import Button from "@/component/button/Button.svelte";
  import { yyyymmdd } from "@/util/helper";
  import { createNote, updateNote } from "@/model/service/NoteService";
  import { useRoom } from "@/model/store/room";

  const { notes } = useNotes()
  const { room } = useRoom()

  let noteId = $notes[0]?.id;

  $: note = $notes.find((note) => note.id === noteId)

  const onChangeSelect = (e: Event) => {
    const target = e.target as HTMLSelectElement
    noteId = target.value
  }

  const onClickCreateNote = async () => {
    console.log("NoteManager.onClickCreateNote");
    const t = yyyymmdd()
    const { id: newNoteId } = await createNote({
      room: $room.id,
      name: `新しい共有メモ_${t}`,
      text: ""
    })
    noteId = newNoteId
  }
  const onBlurNoteName = async (e: Event) => {
    console.log("NoteManager.onBlurNoteName");
    const target = e.target as HTMLInputElement
    const name = (target.value || "").trim();

    if (name === note?.name) {
      console.log("no changes");
      return
    }

    await updateNote({
      noteId,
      criteria: { name }
    })
  }
  const onBlurNoteText = async (e: Event) => {
    console.log("NoteManager.onBlurNoteText",);
    const target = e.target as HTMLTextAreaElement
    const text = target.value

    if (text === note?.text) {
      console.log("no changes");
      return
    }

    await updateNote({
      noteId,
      criteria: { text }
    })
  }
</script>

<select on:change={onChangeSelect}>
  <option selected={!noteId} disabled>選択してください</option>
  {#each $notes as note}
    <option value={note.id} selected={noteId === note.id}>{note.name}</option>
  {/each}
</select>
<Button handle={()=>onClickCreateNote()}>新規作成</Button>
<hr>
<input type="text" value={note?.name} on:blur={e=>onBlurNoteName(e)}>
<textarea value={note?.text} on:blur={e=>onBlurNoteText(e)}></textarea>

<style lang="scss">
  textarea {
    width: calc(100% - 1.0rem);
    height: 300px;
  }
</style>