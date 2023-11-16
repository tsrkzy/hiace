<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">

  import { Pawn } from "../../../model/Pawn";
  import { useCharacters } from "../../../model/store/characters";
  import { useAliases } from "../../../model/store/aliases";
  import { usePawns } from "../../../model/store/pawns";
  import { useImageSources } from "../../../model/store/imageSources";
  import { useUsers } from "../../../model/store/users";
  import { DEFAULT_PAWN_IMAGE_URL } from "../../../constant";
  import { deletePawn } from "../../../model/service/PawnService";
  import Button from "../../button/Button.svelte";

  export let pawn: Pawn;

  const { characters } = useCharacters();
  const { aliases } = useAliases();
  const { pawns } = usePawns();
  const { imageSources } = useImageSources();
  const { users, } = useUsers()

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

  $: pawnImageUrl = (() => {
    const character = $characters.find(c => c.id === pawn?.character);
    const alias = $aliases.find(a => a.id === character?.activeAlias);
    const imgSrc = $imageSources.find(i => i.id === alias?.image);
    if (!imgSrc) {
      return DEFAULT_PAWN_IMAGE_URL;
    }
    return imgSrc.url
  })()

  const onClickResetPawn = async (pawnId: string) => {
    console.log("BoardManager.onClickResetPawn", pawnId);
  }
  const onClickDeletePawn = async (pawnId: string) => {
    console.log("BoardManager.onClickDeletePawn", pawnId);
    await deletePawn({ pawnId });
  }
</script>

<fieldset>
  <legend>コマ: { whoIsPawn(pawn.id) }({ whosePawn(pawn.owner) })</legend>
  <img src={ pawnImageUrl } class="pawn-image" alt="pawn"/>
  <Button handle={()=>onClickResetPawn(pawn.id)}>原点へ戻す</Button>
  <Button handle={()=>onClickDeletePawn(pawn.id)}>削除</Button>
</fieldset>

<style>
    .pawn-image {
        max-height: 48px;
    }
</style>