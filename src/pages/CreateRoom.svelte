<script lang="ts">
  import { useAuth } from "../store/auth";

  const { authorized } = useAuth();
</script>

<main>
  <div class="container">
    "$authorized: "{$authorized}
    <fieldset class="create-room__fieldset">
      <legend>部屋の作成</legend>
      <div>
        <label>
          <span>部屋名</span>
          <input
              type="text"
              value=""
              placeholder="必須"
          >
        </label>
      </div>
      <div>
        <button
            disabled="{$authorized}"
        >作成
        </button>
      </div>
      {#if !$authorized}
        <p>Googleアカウントでのログインが必要です</p>
      {/if}
    </fieldset>
  </div>

</main>

<style>
</style>
