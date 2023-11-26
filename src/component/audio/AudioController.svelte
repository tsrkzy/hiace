<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">
  import { useSounds } from "@/model/store/sounds";
  import { useRoom } from "@/model/store/room";

  const { sounds } = useSounds()
  const { room } = useRoom()

  let playing = false;

  $: sound = (() => {
    const s = $sounds.find(s => s.id === $room.music)
    if (!s) {
      console.log("s is null");
      pauseSound();
    }
    return s
  })();

  // BGMが設定されていてかつループ再生のとき、ローカルで再生中でないなら警告する
  $: isBroadcastPaused = sound?.loop && !playing

  $: isPlayingWithoutBroadcast = !sound && playing
  $: label = (() => {
    return `${sound?.loop ? "LOOP: " : ""}${sound?.name || ""}` || "再生中のBGMはありません"
  })()


  const pauseSound = () => {
    const audioEl = document.querySelector("audio#bgm") as HTMLAudioElement;
    if (!audioEl) {
      return;
    }
    audioEl.pause();
    audioEl.currentTime = 0;
  }

  const onEnded = async () => {
    console.log("AudioControler.onEnded");
    playing = false;
  }
  const onPause = async () => {
    console.log("AudioControler.onPause",);
    playing = false;
  }
  const onPlay = async () => {
    console.log("AudioControler.onPlay",);
    playing = true;
  }

</script>


<details class="audio-player__container">
  <summary class={`${(isBroadcastPaused||isPlayingWithoutBroadcast)? "error":""}`}>{label}</summary>
  {#if isBroadcastPaused}
    <p>部屋でBGMが放送されていますが、あなたのブラウザ上では再生が停止しています。</p>
    <p>BGM再生を再開するには、手動で再生ボタンを押してください。</p>
  {:else if isPlayingWithoutBroadcast}
    <p>あなたのブラウザ上でのみ音楽が再生されています。BGMを放送する場合はBGM管理機能を利用してください。</p>
  {/if}
  <p></p>
  <audio
      id="bgm"
      controls
      autoplay={!!sound}
      loop={sound?.loop}
      src={sound?.url}
      on:ended={()=>onEnded()}
      on:pause={()=>onPause()}
      on:play={()=>onPlay()}
  >
  </audio>
</details>

<style lang="scss">
  details.audio-player__container {
    margin: 0;

    summary.error {
      background-color: red;
      color: white
    }

  }
</style>