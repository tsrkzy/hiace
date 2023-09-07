<script lang="ts">
  import { useAuth } from "../store/auth";
  import { authenticateWithPopUp } from "../util/googleAuthProvider";
  import { UserCollectionService } from "../service/collection/UserCollectionService";

  const { authorized, setAuth } = useAuth();
  const { fetchUserByEmail, createUser } = UserCollectionService()

  export const handleClick = () => {
    return authenticateWithPopUp()
      .then(async (a) => {
        /* Googleログイン後 */
        setAuth(a)

        /* ユーザ情報があれば取得し、なければ作る */
        let user = await fetchUserByEmail(a.Email)
        if (!user) {
          console.log("no user found by Email.");
          user = await createUser(a);
          console.log("user created.", user);
        }

        /* 部屋の作成 */
      })
      .catch(e => {
        console.error(e);
      })

  }

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
            on:click={handleClick}
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
