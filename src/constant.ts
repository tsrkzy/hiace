/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export const DEFAULT_PAWN_IMAGE_URL = "../assets/images/default_pawn.png";
export const DEFAULT_PAWN_IMAGE_WIDTH = 256;
export const DEFAULT_PAWN_IMAGE_HEIGHT = 256;

export const DEFAULT_MAP_IMAGE_URL = "../assets/images/default_map.jpg";
export const DEFAULT_MAP_IMAGE_WIDTH = 1109;
export const DEFAULT_MAP_IMAGE_HEIGHT = 840;

export const CHARACTER_ID_NULL = "NULL";
export const ALIAS_ID_NULL = "NULL";
export const CHANNEL_ID_NULL = "NULL";

export const ALIAS_DISPLAY_HEIGHT = 200;

export const DICE_SIZE = 100;

/* dice color */
export const DiceColors = {
  DICE_BLACK: "DICE_BLACK",
  DICE_RED: "DICE_RED",
  DICE_WHITE: "DICE_WHITE",
  DICE_HALLOWEEN: "DICE_HALLOWEEN",
} as const;
export type DiceColor = (typeof DiceColors)[keyof typeof DiceColors];

export const DiceBaseColors = {
  DICE_BLACK: "black",
  DICE_RED: "red",
  DICE_WHITE: "white",
  DICE_HALLOWEEN: "black",
} as const;
export type DiceBaseColor =
  (typeof DiceBaseColors)[keyof typeof DiceBaseColors];

export const DiceEyeColors = {
  DICE_BLACK: "white",
  DICE_RED: "white",
  DICE_WHITE: "black",
  DICE_HALLOWEEN: "orangered",
} as const;
export type DiceEyeColor = (typeof DiceEyeColors)[keyof typeof DiceEyeColors];

/* die */

export const DiceValues = {
  ONE: "ONE",
  TWO: "TWO",
  THREE: "THREE",
  FOUR: "FOUR",
  FIVE: "FIVE",
  SIX: "SIX",
  ASTER: "ASTER",
} as const;
export type DiceValue = (typeof DiceValues)[keyof typeof DiceValues];

export const DiceLabels = {
  ONE: "1",
  TWO: "2",
  THREE: "3",
  FOUR: "4",
  FIVE: "5",
  SIX: "6",
  ASTER: "*",
} as const;
export type DiceLabel = (typeof DiceLabels)[keyof typeof DiceLabels];

export const CELL_EDITOR_INPUT_ID = "cell-editor-input";
