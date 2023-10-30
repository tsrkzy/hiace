<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import Button from "./Button.svelte";
  import { authenticateWithPopUp } from "../../util/googleAuthProvider";
  import { createUser, fetchUserByEmail } from "../../model/service/UserService";
  import { useAuth } from "../../model/store/auth";
  import { useRoom } from "../../model/store/room";

  export let cb = ()=>{};

  const { setUserIdForRoomState } = useRoom()
  const { setAuth } = useAuth();

  export const handleClick = () => {
    return authenticateWithPopUp()
      .then(async (a) => {
        /* Googleログイン後 */
        setAuth(a)

        /* ユーザ情報があれば取得し、なければ作る */
        let user = await fetchUserByEmail(a.email)
        if (!user) {
          console.log("no user found by Email.");
          user = await createUser(a);
          console.log("user created.", user);
        }

        setUserIdForRoomState(user.id);
        return cb()
      })
      .catch(e => {
        console.error(e);
      })
  }
</script>

<Button handle={handleClick}>Google認証</Button>
