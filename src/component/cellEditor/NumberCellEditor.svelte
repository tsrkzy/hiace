<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { updateColumn } from "@/model/service/ColumnService";
  import { CELL_EDITOR_INPUT_ID } from "@/constant.js";
  import { useTables } from "@/model/store/tables";
  import { useColumns } from "@/model/store/columns";

  const { cellEditorTarget, setShowCellEditor } = useTables()
  const { columns } = useColumns()

  let v: number = isNaN(parseInt(`${$cellEditorTarget?.cellData.value}`, 10))
    ? 0
    : parseInt(`${$cellEditorTarget?.cellData.value}`, 10)

  let errorText = "";

  $: column = $columns.find(c => c.id === $cellEditorTarget?.cellData.columnId);
  $: diffText = (() => {
    const delta = v - parseInt(`${$cellEditorTarget?.cellData.value}`, 10);
    // マイナスは勝手につくので、プラスの場合のみ明示
    const sign = delta >= 0 ? "+" : "";
    return `${sign}${delta}`
  })();
  const onKeyDown = async (e: KeyboardEvent) => {
    console.log("NumberCellEditor.onKeyDown");
    if (!$cellEditorTarget) {
      return;
    }

    // 変換中は無視
    if (e.isComposing) {
      return
    }

    const target = e.target as HTMLInputElement;
    const value = target.value?.trim();

    // enterキーとnumpadEnterキーのみ受け付ける
    if (e.key !== "Enter" && e.key !== "NumpadEnter") {
      return;
    }

    await applyValue(value)
  }

  const applyValue = async (value: string) => {
    if (!column || !$cellEditorTarget) {
      return;
    }

    errorText = validateNumberString(value)
    if (errorText) {
      console.warn(errorText);
      return;
    }

    const num = parseInt(value, 10);

    const { dataMap = {} } = column;
    dataMap[$cellEditorTarget.cellData.characterId] = num;

    await updateColumn({
      columnId: $cellEditorTarget.cellData.columnId,
      criteria: { dataMap }
    })
    setShowCellEditor(false)
  }

  const onClickApplyButton = () => {
    const inputEl = document.getElementById(CELL_EDITOR_INPUT_ID) as HTMLInputElement;
    const value = inputEl.value?.trim();
    applyValue(value)
  }

  const validateNumberString = (_value: string): string => {
    const value = _value.trim();
    if (!value) {
      return "空文字は指定できません"
    }

    const num = parseInt(value, 10);
    if (isNaN(num)) {
      return "数値を入力してください"
    }

    // 少数は指定不可とする
    if (value.includes(".")) {
      return "小数は指定できません"
    }

    return "";
  }

  const onClickHalfUp = () => {
    v = v > 0 ? Math.ceil(v / 2) : Math.floor(v / 2);
    focusTextField();
  }
  const onClickHalfDown = () => {
    v = v > 0 ? Math.floor(v / 2) : Math.ceil(v / 2);
    focusTextField();
  }
  const onClickDouble = () => {
    v *= 2;
    focusTextField();
  }
  const onClickPower = () => {
    v = v ** 2;
    focusTextField();
  }
  const onClickSqrt = () => {
    v = v < 0 ? v : Math.floor(Math.sqrt(v));
    focusTextField();
  }
  const onClickNegate = () => {
    v = -v;
    focusTextField();
  }
  const onClick1D100 = () => {
    v = Math.floor(Math.random() * 100) + 1;
    focusTextField();
  }
  const onClickSet = (n: number) => {
    v = n;
    focusTextField();
  }
  const onClickReset = () => {
    v = isNaN(parseInt(`${$cellEditorTarget?.cellData.value}`, 10))
      ? 0
      : parseInt(`${$cellEditorTarget?.cellData.value}`, 10)
    focusTextField();
  }
  const onClickAdd = (n: number) => {
    v += n
    focusTextField();
  }
  const focusTextField = () => {
    const input = document.getElementById(CELL_EDITOR_INPUT_ID) as HTMLInputElement;
    input.select();
  }
</script>


<input
    id={CELL_EDITOR_INPUT_ID}
    type="number"
    value={v}
    on:keydown={e=>onKeyDown(e)}
/>
<button on:click={()=>onClickApplyButton()}>適用(Enter)</button>
<pre>{$cellEditorTarget?.cellData.value}&nbsp;→&nbsp;{v}(&nbsp;{diffText}&nbsp;)</pre>
{#if errorText}
  <pre class="error">正負の整数および0のみが指定できます</pre>
{/if}
<hr>
<div class="calc container">
  <button on:click={()=>onClickSet(0)}>0にする</button>
  <button on:click={()=>onClickReset()}>リセット</button>
  <br/>
  <button on:click={()=>onClickAdd(100)}>+100</button>
  <button on:click={()=>onClickAdd(50)}>+50</button>
  <button on:click={()=>onClickAdd(10)}>+10</button>
  <button on:click={()=>onClickAdd(1)}>+1</button>
  <br/>
  <button on:click={()=>onClickAdd(-100)}>-100</button>
  <button on:click={()=>onClickAdd(-50)}>-50</button>
  <button on:click={()=>onClickAdd(-10)}>-10</button>
  <button on:click={()=>onClickAdd(-1)}>-1</button>
  <br/>
  <button on:click={()=>onClickHalfUp()}>切り上げ半減</button>
  <button on:click={()=>onClickHalfDown()}>切り捨て半減</button>
  <button on:click={()=>onClickNegate()}>正負反転</button>
  <button on:click={()=>onClick1D100()}>1d100</button>
  <br/>
  <button on:click={()=>onClickPower()}>2乗</button>
  <button on:click={()=>onClickDouble()}>2倍</button>
  <button on:click={()=>onClickSqrt()}>平方根(切り捨て)</button>

</div>

<style lang="scss">
  pre {
    margin: 0;

    &.error {
      color: darkred;
    }
  }

  div.calc.container {
    button {
      min-width: 4rem;
    }
  }
</style>