<template>
  <div class="container">
    <h3>部屋の作成</h3>
    <label>
      <span>部屋名</span>
      <input>
    </label>
    <label>
      <span>パスワード</span>
      <input type="password">
    </label>
    <label>
      <span>システム</span>
      <select>
        <option value="1">ソード・ワールド 2.0</option>
        <option value="2">ソード・ワールド 2.5</option>
      </select>
    </label>
    <button>作成</button>
  </div>
</template>

<script>
export default {
  name: "Room"
};
</script>

<style scoped>

</style>