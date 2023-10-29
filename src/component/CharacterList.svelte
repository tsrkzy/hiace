<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { useCharacters } from "../model/store/characters";
  import { useAliases } from "../model/store/aliases";
  import { createCharacter, deleteCharacter } from "../model/service/CharacterService";
  import { useAuth } from "../model/store/auth";
  import { useUsers } from "../model/store/users";
  import { useRoom } from "../model/store/room";

  const { characters, } = useCharacters()
  const { aliases, } = useAliases()
  const { isLoggedIn } = useAuth()
  const { myUserId } = useUsers()
  const { roomId } = useRoom()

  const handleAddCharacter = async () => {
    console.log("CharacterList.handleAddCharacter");
    await createCharacter({
      owner: $myUserId,
      name: `character_${Date.now()}`,
      roomId: $roomId,
      text: "",
      activeAlias: "",
      imageId: "",
      showOnInitiative: true,
    })
  }

  const handleDeleteCharacter = async (characterId:string) => {
    console.log("CharacterList.handleDeleteCharacter");
    await deleteCharacter({
      characterId
    })
  }
</script>

<main>
  <h2>Character</h2>
  {#each $characters as c}
    <ul>
      <li>
      <button on:click={()=>{handleDeleteCharacter(c.id)}}>delete</button>
        {c.id},{c.name}</li>
    </ul>
  {/each}
  {#if $isLoggedIn}
    <button on:click={handleAddCharacter}>add character</button>
  {/if}
  <h2>Alias</h2>
  {#each $aliases as a}
    <ul>
      <li>{a.id},{a.name}</li>
    </ul>
  {/each}
</main>