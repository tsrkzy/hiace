<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @ tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { useBoards } from "../model/store/boards";
  import { useMapChips } from "../model/store/mapChips";
  import { useAuth } from "../model/store/auth";
  import { useRoom } from "../model/store/room";
  import { createBoard, deleteBoard } from "../model/service/BoardService";
  import { createMapChip, deleteMapChip } from "../model/service/MapChipService";
  import { usePawns } from "../model/store/pawns";
  import { useUsers } from "../model/store/users";
  import { useCharacters } from "../model/store/characters";
  import { createPawn, deletePawn } from "../model/service/PawnService";

  export let open = false;

  const { boards, } = useBoards()
  const { mapChips, } = useMapChips()
  const { pawns, } = usePawns()
  const { myUserId } = useUsers()
  const { myCharacters } = useCharacters()
  const { isLoggedIn, } = useAuth()
  const { roomId } = useRoom();

  const handleAddBoard = async () => {
    console.log("BoardList.handleAddBoard");
    await createBoard({ roomId: $roomId })
  }
  const handleAddMapChip = async (boardId: string) => {
    console.log("BoardList.handleAddMapChip");
    await createMapChip({ roomId: $roomId, boardId })
  }
  const handleAddPawn = async (boardId: string, characterId: string) => {
    console.log("BoardList.handleAddPawn");
    await createPawn({
      roomId: $roomId,
      boardId,
      characterId,
      userId: $myUserId,
      imageId: "imageId",
      transform: "transform",
    })
  }

  const handleDeleteBoard = async (boardId: string) => {
    console.log("BoardList.handleDeleteBoard");
    await deleteBoard({ boardId })
  }
  const handleDeleteMapChip = async (mapChipId: string) => {
    console.log("BoardList.handleDeleteMapChip");
    await deleteMapChip({ mapChipId })
  }
  const handleDeletePawn = async (pawnId: string) => {
    console.log("BoardList.handleDeletePawn");
    await deletePawn({ pawnId })
  }

</script>

<main>
  <details {open}>
    <summary>Board</summary>
    {#each $boards as b}
      <ul>
        <li>
          <button on:click={()=>handleDeleteBoard(b.id)}>delete</button>
          board: {b.id}
        </li>
        <ul>
          {#each $mapChips as m}
            {#if m.board === b.id}
              <li>
                <button on:click={()=>handleDeleteMapChip(m.id)}>delete</button>
                map: {m.id}
              </li>
            {/if}
          {/each}
        </ul>
        {#if $isLoggedIn}
          <button on:click={()=>handleAddMapChip(b.id)}>add map_chip</button>
        {/if}
        <ul>
          {#each $pawns as p}
            {#if p.board === b.id}
              <li><button on:click={()=>handleDeletePawn(p.id)}>delete</button>pawn: {p.id}(c:{p.character})</li>
            {/if}
          {/each}
        </ul>
        {#if $isLoggedIn}
          {#each $myCharacters as c}
            <button on:click={()=>handleAddPawn(b.id, c.id)}>add pawn:{c.name}</button>
          {/each}
        {/if}
      </ul>
    {/each}
    {#if $isLoggedIn}
      <button on:click={handleAddBoard}>add board</button>
    {/if}
  </details>
</main>