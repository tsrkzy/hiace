/*-----------------------------------------------------------------------------
 - Copyright (c) 2020.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

/**
 * 連続して発生するスクロール処理などを間引くクラス。
 * constructorにms単位で間隔を指定して使用する。
 * 前回の処理から指定した時間が経過しない限り、doのpromiseはresolveしない。
 *
 * delayの時間内には1回以上処理は実行されず、
 * 最後にキューに積んだ処理は遅延されるものの必ず実行される。
 *
 * 処理は即時では間引かず、delayをかけて一旦キューに積む
 * 再実行待ちの処理があるタイミングでまたdoが呼ばれた場合、キューに積んだ処理を間引き、
 * 新しいdoについて再実行の判定を行い、delayが過ぎていれば実行、過ぎていなければ再実行(待ち)する
 *
 * @class
 * @example
 * const t = new Throttle(1000);
 * window.setInterval(()=>{
 *   t.do()
 *     .then(()=>console.log("hello!"))
 *     .catch(()=>{});
 * }, 10);
 * 10ms毎にt.do()を呼び出すが、1000msごとにしかthenのコールバックは実行されない
 */
export class Throttle {
  delay = 0;
  retryDelay = 0;
  before = 0;
  rejectPending = null;
  pendingTimeoutId = null;

  id = 0;

  constructor(delay) {
    this.delay = delay;
    this.retryDelay = 10 * delay;
  }

  isReady() {
    const { before, delay } = this;
    const now = Date.now();
    return now - before >= delay;
  }

  done() {
    this.before = Date.now();
  }

  async do(pendingId) {
    if (this.isReady()) {
      /* 前回実行時刻からdelay[ms]経過している場合はresolve */
      this.done();
      return;
    }

    /* 延期中のpromiseをreject */
    if (
      pendingId !== this.pendingTimeoutId &&
      typeof this.rejectPending === "function"
    ) {
      this.rejectPending();
    }

    return new Promise(async (resolve, reject) => {
      this.rejectPending = reject;
      const pendingTimeoutId = window.setTimeout(() => {
        /* timeout後、timeoutIdが上書きされていなければ延期して再実行 */
        if (this.pendingTimeoutId === pendingTimeoutId) {
          this.do(this.pendingTimeoutId)
            .then(resolve)
            .catch(reject);
        } else {
          reject();
        }
      }, this.retryDelay);

      this.pendingTimeoutId = pendingTimeoutId;
    });
  }
}
