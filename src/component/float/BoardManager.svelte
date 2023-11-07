<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">
  import Button from "../button/Button.svelte";
  import { useBoards } from "../../model/store/boards";
  import { useMapChips } from "../../model/store/mapChips";
  import { usePawns } from "../../model/store/pawns";
  import { useRoom } from "../../model/store/room";
  import { ContentId, Float } from "../../model/Float";
  import { createMapChip, deleteMapChip } from "../../model/service/MapChipService";
  import { useUsers } from "../../model/store/users";
  import { openFloat } from "../../model/service/FloatService";

  export const float = {} as Float;

  const { room } = useRoom();
  const { boards } = useBoards();
  const { mapChips } = useMapChips()
  const { pawns } = usePawns();
  const { myUserId } = useUsers();

  $: activeBoard = $boards.find(b => b.id === $room.activeBoard);
  $: mapChipsInBoard = $mapChips.filter(m => m.board === activeBoard?.id);
  $: pawnsInBoard = $pawns.filter(p => p.board === activeBoard?.id);

  const onClickAddMapChip = async (boardId: string) => {
    console.log("BoardManager.onClickAddMapChip", boardId);
    await createMapChip(
      {
        roomId: $room.id,
        boardId,
        userId: $myUserId
      })
  }
  const onClickAddDice = async (boardId: string) => {
    console.log("BoardManager.onClickAddDice", boardId);
  }
  const onClickMapEdit = async (mapChipId: string) => {
    console.log("BoardManager.onClickMapEdit", mapChipId);
    openFloat(ContentId.MAP_EDIT, {args: {mapChipId}});
  }
  const onClickDeleteMapChip = async (mapChipId: string) => {
    console.log("BoardManager.onClickDeleteMapChip", mapChipId);
    await deleteMapChip({ mapChipId })
  }
  const onClickResetPawn = async (pawnId: string) => {
    console.log("BoardManager.onClickResetPawn", pawnId);
  }
  const onClickDeletePawn = async (pawnId: string) => {
    console.log("BoardManager.onClickDeletePawn", pawnId);
  }

  const whoIsPawn = (pawnId: string) => {
    console.log("BoardManager.whoIsPawn", pawnId);
    return pawnId
  }

  const whosePawn = (ownerId: string) => {
    console.log("BoardManager.whosePawn", ownerId);
    return ownerId
  }
</script>


{#each $boards as b (b.id)}
  <fieldset>
    <legend>ボード: { b.id }</legend>
    <Button handle={()=>onClickAddMapChip(b.id)}>マップを追加</Button>
    <Button handle={()=>onClickAddDice(b.id)}>ダイスを追加</Button>
    {#each mapChipsInBoard as m (m.id)}
      <fieldset>
        <legend>マップ: { m.id }{ m.image ? "" : "(no image)" }</legend>
        <Button handle={()=>onClickMapEdit(m.id)}>編集</Button>
        <Button handle={()=>onClickDeleteMapChip(m.id)}>削除</Button>
      </fieldset>
    {/each}
    {#each pawnsInBoard as p (p.id)}
      <fieldset>
        <legend>コマ: { whoIsPawn(p.id) }({ whosePawn(p.owner) })</legend>
        <Button handle={()=>onClickResetPawn(p.id)}>原点へ戻す</Button>
        <Button handle={()=>onClickDeletePawn(p.id)}>削除</Button>
      </fieldset>
    {/each}
  </fieldset>
{/each}
