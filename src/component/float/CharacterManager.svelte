<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { useCharacters } from "../../model/store/characters";
  import { Float } from "../../model/Float";
  import Button from "../button/Button.svelte";
  import { createCharacter } from "../../model/service/CharacterService";
  import { useUsers } from "../../model/store/users";
  import { useRoom } from "../../model/store/room";

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
  }


  const onClickEditHandler = (characterId:string)=>{
    console.log("CharacterManager.onClickEditHandler");
    console.log(characterId);
  }
  const onClickDuplicateHandler = (characterId:string)=>{
    console.log("CharacterManager.onClickDuplicateHandler");
    console.log(characterId);
  }
  const onClickAddPawnHandler = (characterId:string)=>{
    console.log("CharacterManager.onClickAddPawnHandler");
    console.log(characterId);
  }
  const onClickArchiveHandler = (characterId:string)=>{
    console.log("CharacterManager.onClickArchiveHandler");
    console.log(characterId);
  }
</script>
<ul>
  <input type="text" placeholder="キャラクター名" on:input={(e)=>onInputCharacterName(e)}/>
  <Button disabled={!(characterName.trim())} handle={()=>onAddCharacter()}>キャラクター追加</Button>
  {#each $characters as c (c.id)}
    <li>{c.name} (#{c.id})
      <Button handle={()=>onClickEditHandler(c.id)}>編集</Button>
      <Button handle={()=>onClickDuplicateHandler(c.id)}>複製</Button>
      <Button handle={()=>onClickAddPawnHandler(c.id)}>コマ追加</Button>
      <Button handle={()=>onClickArchiveHandler(c.id)}>控室に入れる</Button>
    </li>
    <!--    <ul>-->
    <!--      {#each $aliases as a (a.id)}-->
    <!--        {#if a.character === c.id}-->
    <!--          <li>{a.name} (#{a.id})</li>-->
    <!--        {/if}-->
    <!--      {/each}-->
    <!--    </ul>-->
  {/each}
</ul>
