<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { Board } from "@/model/Board";
  import { createMapChip } from "@/model/service/MapChipService";
  import Button from "@/component/button/Button.svelte";
  import BoardMapChipManager from "./BoardMapChipManager.svelte";
  import BoardPawnManager from "./BoardPawnManager.svelte";
  import { useMapChips } from "@/model/store/mapChips";
  import { usePawns } from "@/model/store/pawns";
  import { useUsers } from "@/model/store/users";
  import { useRoom } from "@/model/store/room";

  export let board: Board;

  const { mapChips } = useMapChips();
  const { pawns } = usePawns();
  const { myUserId } = useUsers()
  const { room } = useRoom()

  $: mapChipsInBoard = $mapChips.filter(m => m.board === board.id);
  $: pawnsInBoard = $pawns.filter(p => p.board === board.id);


  const onClickAddMapChip = async (boardId: string) => {
    console.log("BoardManager.onClickAddMapChip", boardId);
    await createMapChip({
      roomId: $room.id,
      boardId,
      userId: $myUserId
    })
  }

  const onClickAddDice = async (boardId: string) => {
    console.log("BoardManager.onClickAddDice", boardId);
  }

</script>

<fieldset>
  <legend>ボード: { board.id }</legend>
  <Button handle={()=>onClickAddMapChip(board.id)}>マップを追加</Button>
  <Button handle={()=>onClickAddDice(board.id)}>ダイスを追加</Button>
  {#each mapChipsInBoard as m (m.id)}
    <BoardMapChipManager mapChip={m}/>
  {/each}
  {#each pawnsInBoard as p (p.id)}
    <BoardPawnManager pawn={p}/>
  {/each}
</fieldset>
