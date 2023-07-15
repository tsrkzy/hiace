<script lang="ts">

  import { useAuth } from "./store/auth";
  import { authenticateWithPopUp } from "./util/googleAuthProvider";
  import { db } from "./util/firestore"
  import { collection, query, where, getDocs } from "firebase/firestore"

  const { setAuth, authorized, name } = useAuth();


  export const handleClick = () => {
    return authenticateWithPopUp()
      .then(async (a) => {
        setAuth(a)
        const userRef = collection(db, "user");
        const q = query(userRef, where("email", "==", a.Email))
        const querySnapshot = await getDocs(q);

        // 存在チェック
        if (querySnapshot.empty) {
          return false;
        }

        let result = null;
        querySnapshot.forEach((doc) => {
          result = doc.data();
          result.id = doc.id;
        })

        console.log(result);
      })
      .catch(e => {
        console.error(e);
      })

  }
</script>

<main>
  <h1>Auth</h1>
  <button on:click={handleClick}>loggin</button>
  <p>authorized: {$authorized}</p>
  {#if $authorized}
    <p>name: {$name}</p>
  {/if}

</main>

<style>
</style>
