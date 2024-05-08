import pinyin from "pinyin";
import cnchar from "cnchar";
import trad from "cnchar-trad";
import fs from "fs";
import path from "path";

cnchar.use(trad);

import dictHanEmojiJson from "@/conf/codex/han_emoji_dict.json";
import dictEmojiHanJson from "@/conf/codex/emoji_han_dict.json";
import dictUniDiffJson from "@/conf/codex/unicode_diff.json";

const dictHanEmoji: Record<string, string[]> = dictHanEmojiJson;
const dictEmojiHan: Record<string, string> = dictEmojiHanJson;
const dictUniDiff: Record<string, string> = dictUniDiffJson;

// 1: Pinyin => Emoji

/**
 * Make text emojiful
 * @param text original text needs to be code or decode
 * @param dec true means decode
 * @returns Abstracted/undo codes
 */
function codexEmoji(text: string, dec: boolean): string {
  return dec ? decodeEmoji(text) : codeEmoji(text);
}

function codeEmoji(text: string): string {
  let result: string[] = [];
  for (let char of text) {
    let alt = dictHanEmoji[char];
    if (alt instanceof Array) {
      // in dict
      if (alt.length > 1) {
        let index = randomNumber(0, alt.length);
        result.push(alt[index]);
      } else {
        result.push(alt[0]);
      }
    } else {
      // Not in dict
      result.push(char);
    }
  }
  return result.join("");
}

function decodeEmoji(text: string): string {
  let result: string[] = [];
  for (let char of text) {
    let alt = dictEmojiHan[char];
    if (alt != undefined) {
      // in dict
      result.push(alt);
    } else {
      // Not in dict
      result.push(char);
    }
  }
  return result.join("");
}

// 2: By Unicode diff, credits to RimoChan/unvcode

function codexUnidiff(text: string): string {
  let result = "";
  for (let char of text) {
    let alt = dictUniDiff[char];
    if (alt) {
      result += alt;
    } else {
      result += char;
    }
  }
  return result;
}

// 3: Get traditional zh

function codexTrad(text: string, dec: boolean): string {
  return dec
    ? cnchar.convert.tradToSimple(text)
    : cnchar.convert.simpleToTrad(text);
}

// 4: Mars lang? chinese strange char replace

function codexSpark(text: string, dec: boolean): string {
  return dec
    ? cnchar.convert.sparkToSimple(text)
    : cnchar.convert.simpleToSpark(text);
}

// 000: Tools --- Return random digit in [min, max)
const randomNumber = (min: number, max: number): number =>
  Math.round(Math.random() * (max - min) + min);

export { codexEmoji, codexUnidiff, codexTrad, codexSpark };
