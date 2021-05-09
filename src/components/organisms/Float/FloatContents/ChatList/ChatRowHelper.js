/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { DICE, DICE_SECRET, FSChat, SYSTEM } from "@/collections/Chat";
import { getName, maskByChannel } from "@/scripts/helper";
import store from "@/store";

function createChannelSpan(c, activeChannel) {
  const $ch = document.createElement("SPAN");
  const { type, channel } = c;
  if (type !== SYSTEM) {
    const dim = type !== SYSTEM && channel !== activeChannel;
    $ch.style.fontWeight = "normal";
    $ch.style.color = dim ? "lightgray" : "gray";

    const channelName = getName("channel", channel) || "全体";
    $ch.textContent = `(${channelName})`;
  }
  return $ch;
}

function createSpeakerSpan(c, activeChannel) {
  const $s = document.createElement("SPAN");
  const { type, character, owner, channel } = c;
  if (type === SYSTEM) {
    $s.textContent = "$ hiace > ";
  } else {
    const characterName = getName("character", character);
    const userName = getName("user", owner);
    const speakerName = characterName || userName;
    const s = maskByChannel(speakerName, channel, activeChannel);

    $s.textContent = `${s}: `;
  }
  return $s;
}

function createTextSpan(c, activeChannel) {
  const $t = document.createElement("SPAN");
  const {
    type,
    value: { result = "", text = "", secret = false },
    channel
  } = c;

  /* 公開前のシークレットダイスの場合 */
  if (type === DICE_SECRET) {
    if (secret) {
      const $tt = document.createElement("SPAN");
      $tt.textContent = "シークレットダイス";
      const userId = store.getters["auth/user"].id;
      const $a = document.createElement("BUTTON");
      $a.classList.add("ha");
      $a.textContent = "公開";
      $a.style.color = "dimgray";
      if (c.owner !== userId) {
        $a.setAttribute("disabled", "disabled");
        $a.style.color = "lightgray";
      } else {
        $a.addEventListener("click", openSecret, false);
        async function openSecret() {
          await FSChat.OpenSecret(c.id);
          $a.removeEventListener("click", openSecret);
          $a.remove();
        }
      }
      $t.append($tt);
      $t.append($a);

      return $t;
    }
  }

  const textList = [...text.split(/\n/)];
  if (type === DICE || type === DICE_SECRET) {
    textList.push(result);
  }

  if (textList.length === 1) {
    $t.textContent = maskByChannel(textList[0], channel, activeChannel);
  } else {
    for (let i = 0; i < textList.length; i++) {
      const t = textList[i];
      const $br = document.createElement("BR");
      const $tt = document.createElement("SPAN");
      $tt.style.marginLeft = "0.5rem";
      $tt.style.paddingLeft = "0.5rem";
      $tt.style.borderLeft = "1px solid lightgray";
      $tt.textContent = maskByChannel(t, channel, activeChannel);

      $t.append($br, $tt);
    }
  }
  return $t;
}

export function createChatRowDom(chat, activeChannel, floatId) {
  const $li = document.createElement("LI");
  const { type, color, id } = chat;
  const system = type === SYSTEM;

  const idString = generateChatRowId(floatId, id);
  $li.setAttribute("id", idString);
  $li.dataset.chatId = id;
  $li.style.margin = "0";
  $li.style.wordBreak = "break-word";
  $li.style.fontWeight = system ? "normal" : "bold";
  $li.style.fontStyle = system ? "italic" : "normal";
  $li.style.color = system ? "lightgray" : color;

  const $ch = createChannelSpan(chat, activeChannel);
  const $s = createSpeakerSpan(chat, activeChannel);
  const $t = createTextSpan(chat, activeChannel);
  $li.append($ch, $s, $t);

  return $li;
}
export function generateChatRowId(floatId, chatId) {
  return `chat-row__${floatId}_${chatId}`;
}
