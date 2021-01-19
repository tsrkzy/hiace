/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { DICE, SYSTEM } from "@/collections/Chat";
import { getName } from "@/scripts/helper";

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

function createSpeakerSpan(c) {
  const $s = document.createElement("SPAN");
  const { type, character, owner } = c;
  if (type === SYSTEM) {
    $s.textContent = "$ hiace > ";
  } else {
    const characterName = getName("character", character);
    const userName = getName("user", owner);
    const speakerName = characterName || userName;
    $s.textContent = `${speakerName}: `;
  }
  return $s;
}

function createTextSpan(c) {
  const $t = document.createElement("SPAN");
  const {
    type,
    value: { result = "", text = "" }
  } = c;

  const textList = [...text.split(/\n/)];
  if (type === DICE) {
    textList.push(result);
  }

  if (textList.length === 1) {
    $t.textContent = textList[0];
  } else {
    for (let i = 0; i < textList.length; i++) {
      const t = textList[i];
      const $br = document.createElement("BR");
      const $tt = document.createElement("SPAN");
      $tt.style.marginLeft = "0.5rem";
      $tt.style.paddingLeft = "0.5rem";
      $tt.style.borderLeft = "1px solid lightgray";
      $tt.textContent = t;

      $t.append($br, $tt);
    }
  }
  return $t;
}

export function createChatRowDom(chat, activeChannel) {
  const $li = document.createElement("LI");
  const { type, color } = chat;
  const system = type === SYSTEM;
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
