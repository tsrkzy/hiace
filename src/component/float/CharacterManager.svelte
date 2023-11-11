<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { useCharacters } from "../../model/store/characters";
  import { ContentId, Float } from "../../model/Float";
  import Button from "../button/Button.svelte";
  import { cloneCharacter, createCharacter, deleteCharacter } from "../../model/service/CharacterService";
  import { useUsers } from "../../model/store/users";
  import { useRoom } from "../../model/store/room";
  import { openFloat } from "../../model/service/FloatService";
  import { createPawn } from "../../model/service/PawnService";
  import InputText from "../input/InputText.svelte";

  export const float = {} as Float

  const { characters } = useCharacters();
  const { myUserId } = useUsers()
  const { room } = useRoom()

  let characterName = "";

  const onInputCharacterName = async (e: Event) => {
    console.log("CharacterManager.onInputCharacterName");
    const { value = "" } = e.currentTarget as HTMLInputElement;
    characterName = value;
  }
  const onAddCharacter = async () => {
    console.log("CharacterManager.onAddCharacter");
    if (characterName === "") {
      return;
    }
    await createCharacter({
      owner: $myUserId,
      name: characterName,
      roomId: $room.id,
    })
    characterName = "";
  }


  const onClickEditHandler = (characterId: string) => {
    console.log("CharacterManager.onClickEditHandler");
    console.log(characterId);
    openFloat(ContentId.CHARACTER_EDIT, { args: { characterId } })
  }
  const onClickCloneHandler = async (characterId: string) => {
    console.log("CharacterManager.onClickCloneHandler");
    console.log(characterId);
    await cloneCharacter({ characterId, userId: $myUserId })

  }
  const onClickAddPawnHandler = async (characterId: string) => {
    console.log("CharacterManager.onClickAddPawnHandler");
    console.log(characterId);
    await createPawn({
      characterId
      , userId: $myUserId
      , roomId: $room.id
      , boardId: $room.activeBoard
    })
  }
  const onClickArchiveHandler = (characterId: string) => {
    console.log("CharacterManager.onClickArchiveHandler");
    console.log(characterId);
  }

  const onClickDeleteHandler  = async (characterId:string) => {
    console.log("CharacterManager.onClickDeleteHandler");
    console.log(characterId);
    await deleteCharacter({characterId})
  }
</script>
<ul>
  <InputText
      value={characterName}
      placeholder="キャラクター名"
      onBlur={(e)=>onInputCharacterName(e)}
  ></InputText>
  <Button disabled={!(characterName.trim())} handle={()=>onAddCharacter()}>キャラクター追加</Button>
  {#each $characters as c (c.id)}
    <li>{c.name} (#{c.id})
      <Button handle={()=>onClickEditHandler(c.id)}>編集</Button>
      <Button handle={()=>onClickCloneHandler(c.id)}>複製</Button>
      <Button handle={()=>onClickAddPawnHandler(c.id)}>コマ追加</Button>
      <Button handle={()=>onClickArchiveHandler(c.id)}>控室に入れる</Button>
      <Button handle={()=>onClickDeleteHandler(c.id)}>キャラクターの削除</Button>
    </li>
  {/each}
</ul>
