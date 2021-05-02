/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import { FSSound } from "@/collections/Sound";
import store from "@/store";
export class Sound {
  id;
  $el = document.createElement("AUDIO");
  $src = document.createElement("SOURCE");
  url;
  loaded = false;
  playing = false;
  static Map = new Map();
  static Instances = [];
  retry = true;
  _loop = false;
  _volume = 0.1;
  static _Volume = 0.1;
  _muted = false;

  /* get/set */
  get volume() {
    return this._volume;
  }
  set volume(v) {
    this._volume = parseFloat(v);
    this.$el.volume = this._volume;
  }

  static get Volume() {
    return Sound._Volume;
  }
  static set Volume(vol) {
    const v = parseFloat(vol);
    Sound._Volume = vol;
    const sounds = Sound.Instances;
    for (let i = 0; i < sounds.length; i++) {
      const s = sounds[i];
      s.$el.volume = vol;
    }
  }

  get muted() {
    return this._muted;
  }
  set muted(v) {
    this._muted = v;
    this.$el.muted = this._muted;
  }

  get loop() {
    return this._loop;
  }
  set loop(v) {
    this._loop = v;
    this.$el.loop = this._loop;
  }

  constructor(id) {
    this.id = id;
    if (Sound.Map.has(id)) {
      return this;
    }
    Sound.Map.set(id, this);
    Sound.Instances.push(this);

    this.$el.setAttribute("preload", "auto");
    this.$el.removeAttribute("loop");
    this.$el.appendChild(this.$src);
  }

  static GetById(id) {
    return Sound.Map.get(id) || new Sound(id);
  }

  static Dispose() {
    const sounds = Array.from(Sound.Map.values());
    for (let i = 0; i < sounds.length; i++) {
      const sound = sounds[i];
      sound.dispose();
    }
  }

  dispose() {
    const { $el } = this;
    $el.volume = 0;
    this.pause();
    this.$src = null;
    this.$el.remove();
    this.$el = null;
    const index = Sound.Instances.findIndex(i => i === this);
    Sound.Instances.splice(index, 1);
  }

  async load(url) {
    if (this.loaded) {
      return;
    }

    return new Promise((resolve, reject) => {
      const { $el, $src } = this;
      $el.volume = this.volume;
      $el.oncanplaythrough = () => {
        /* 読み込み → 再生準備完了 */
        this.loaded = true;
        $el.oncanplaythrough = null;
        console.log(`sound ready for play: ${this.id}`);
        resolve();
      };

      $el.onerror = e => {
        console.error(`failed to load sound: ${this.id}`);
        reject(e);
      };

      $src.src = url;
      this.url = url;
      $el.load();
    });
  }

  async play(testPlay = false) {
    if (!this.loaded) {
      console.log(`sound still not loaded yet: ${this.id}`);
      if (!this.retry) {
        throw new Error("loading failed.");
      }
      this.retry = false;
      console.log("attempt to load and play...");
      const { url } = await FSSound.GetById({ id: this.id });
      await this.load(url);
      await this.play(testPlay);
      return;
    }

    const { $el } = this;

    if (!$el.paused) {
      $el.currentTime = 0;
      return;
    }

    $el.onpause = () => {
      if (!testPlay) {
        store.dispatch("sound/unsetPlaying");
      }
      this.playing = false;
      $el.onpause = null;
    };

    $el.onended = () => {
      if (!testPlay) {
        store.dispatch("sound/unsetPlaying");
      }
      this.playing = false;
      $el.onended = null;
    };

    await $el.play();
    this.playing = true;
    const { loop } = store.getters["sound/info"].find(s => s.id === this.id);
    this.loop = loop;
    if (!testPlay) {
      await store.dispatch("sound/setPlaying", { playing: this.id });
    }
  }

  pause() {
    const $el = this.$el;
    if ($el.paused) {
      return;
    }

    $el.pause();
    $el.currentTime = 0;
  }
}
