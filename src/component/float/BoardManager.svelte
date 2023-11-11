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
  import { deletePawn } from "../../model/service/PawnService";
  import { useCharacters } from "../../model/store/characters";
  import { useImageSources } from "../../model/store/imageSources";
  import { DEFAULT_MAP_IMAGE_URL, DEFAULT_PAWN_IMAGE_URL } from "../../constant";
  import { useAliases } from "../../model/store/aliases";

  export const float = {} as Float;

  const { room } = useRoom();
  const { boards } = useBoards();
  const { mapChips } = useMapChips()
  const { pawns } = usePawns();
  const { myUserId } = useUsers();
  const { characters } = useCharacters();
  const { users } = useUsers();
  const { imageSources } = useImageSources();
  const { aliases } = useAliases();

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
    openFloat(ContentId.MAP_EDIT, { args: { mapChipId } });
  }
  const onClickDeleteMapChip = async (mapChipId: string) => {
    console.log("BoardManager.onClickDeleteMapChip", mapChipId);
    await deleteMapChip({ mapChipId })
  }
  const onClickResetPawn = async (pawnId: string) => {
    console.log("BoardManager.onClickResetPawn", pawnId);
    // await resetPawnTransform({ pawnId });
  }
  const onClickDeletePawn = async (pawnId: string) => {
    console.log("BoardManager.onClickDeletePawn", pawnId);
    await deletePawn({ pawnId });
  }

  const whoIsPawn = (pawnId: string) => {
    console.log("BoardManager.whoIsPawn", pawnId);
    const pawn = $pawns.find(p => p.id === pawnId);
    const characterId = pawn?.character;
    const character = $characters.find(c => c.id === characterId);
    return character?.name;
  }

  const whosePawn = (ownerId: string) => {
    console.log("BoardManager.whosePawn", ownerId);
    const user = $users.find(u => u.id === ownerId);
    return user?.email
  }

  const getMapChipImgSrc = (mapChipId: string) => {
    const mapChip = $mapChips.find(m => m.id === mapChipId);
    const imgSrc = $imageSources.find(i => i.id === mapChip?.image);
    if (!imgSrc) {
      return DEFAULT_MAP_IMAGE_URL;
    }
    return imgSrc.url
  }

  const getPawnImgSrc = (pawnId: string) => {
    const pawn = $pawns.find(p => p.id === pawnId);
    const character = $characters.find(c => c.id === pawn?.character);
    const alias = $aliases.find(a => a.id === character?.activeAlias);
    const imgSrc = $imageSources.find(i => i.id === alias?.image);
    if (!imgSrc) {
      return DEFAULT_PAWN_IMAGE_URL;
    }
    return imgSrc.url
  }
</script>


{#each $boards as b (b.id)}
  <fieldset>
    <legend>ボード: { b.id }</legend>
    <Button handle={()=>onClickAddMapChip(b.id)}>マップを追加</Button>
    <Button handle={()=>onClickAddDice(b.id)}>ダイスを追加</Button>
    {#each mapChipsInBoard as m (m.id)}
      <fieldset>
        <legend>マップ: { m.id }</legend>
        <img src={ getMapChipImgSrc(m.id) } class="map-chip-image" alt="map"/>
        <Button handle={()=>onClickMapEdit(m.id)}>編集</Button>
        <Button handle={()=>onClickDeleteMapChip(m.id)}>削除</Button>
      </fieldset>
    {/each}
    {#each pawnsInBoard as p (p.id)}
      <fieldset>
        <legend>コマ: { whoIsPawn(p.id) }({ whosePawn(p.owner) })</legend>
        <img src={ getPawnImgSrc(p.id) } class="pawn-image" alt="pawn"/>
        <Button handle={()=>onClickResetPawn(p.id)}>原点へ戻す</Button>
        <Button handle={()=>onClickDeletePawn(p.id)}>削除</Button>
      </fieldset>
    {/each}
  </fieldset>
{/each}

<style>
    .map-chip-image {
        max-height: 100px;
    }

    .pawn-image {
        max-height: 48px;
    }
</style>