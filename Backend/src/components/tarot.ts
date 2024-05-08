import { joinUrl } from "@/bin/server";
import { shuffle } from "lodash";
import axios, { AxiosError } from "axios";

class Card {
  index!: number;
  name!: string;
  local!: string;
  mean!: {
    upright: string;
    reversed: string;
  };
  img!: string;
  desc!: string[];
  constructor(
    index: number,
    name: string,
    local: string,
    upright: string,
    reversed: string,
    desc: string[]
  ) {
    this.index = index;
    this.name = name;
    this.local = local;
    this.mean = {
      upright: upright,
      reversed: reversed,
    };
    this.desc = desc;
  }
}

class CardPick {
  card!: Card;
  rev!: boolean;
  constructor(card: Card, img: string, rev: boolean) {
    this.card = card;
    this.rev = rev;
    this.card.img = img;
  }
}

class Deck {
  name!: string;
  type!: string;
  imgr!: string;
  deck!: Card[];
  constructor(name: string, type: string, imgr: string, deck: Card[]) {
    this.name = name;
    this.type = type;
    this.imgr = imgr;
    this.deck = deck;
  }
}

var deckSet: Record<string, Deck> = {};

const initTarot = async (map: Record<string, string>) => {
  let endpoint: string = map.tarot;
  try {
    let { mappings } = (
      await axios.get(joinUrl(endpoint, "conf", "_conf.json"))
    ).data;
    for (let key in mappings) {
      let temp: Deck = (
        await axios.get(joinUrl(endpoint, "conf", mappings[key]))
      ).data;
      let { type } = temp;
      let imgEndpoint = joinUrl(endpoint, "img");
      temp.imgr = imgEndpoint;
      if (type === "full") {
        let { name, deck } = temp;
        let alt = `${name}_main`;
        let main = new Deck(alt, "main", imgEndpoint, deck.slice(0, 22));
        deckSet[alt] = main;
      }
      deckSet[key] = temp;
    }
    console.log("Loaded All Decks:");
    for (let n in deckSet) {
      let { name, type, deck } = deckSet[n];
      console.log(`${name} (${type}, ${deck.length})`);
    }
  } catch (e) {
    let { code, config } = e as AxiosError;
    console.log(`Caught unexpected error on requesting ${config?.url}`);
    console.log(code);
    process.exit(1);
  }
};

/**
 * Pick cards based on deck
 * @param deck deck name, refer to conf/tarot
 * @param mode full or main
 * @param count less than deck length
 * @returns picked cards
 */
function drawTarot(deck: string, count: number): CardPick[] {
  let picked = drawCard(deckSet[deck], true, count, []);
  console.log(`Picked ${picked.length} cards: `);
  console.log(picked.map((obj) => obj.card.local));
  return picked;
}

function drawCard(deck: Deck, shuf: boolean, num: number, indexes: number[]) {
  let drawn = new Array<CardPick>();
  let cards = deck.deck;

  if (shuf) {
    cards = shuffle(cards);
  }
  console.log(`Deck should be ${cards.length} cards:`);
  console.log(cards.map((obj) => obj.local));
  num = Math.min(num, cards.length);
  let indexRaw = indexes;

  let indexSet = new Set<number>();
  if (indexRaw.length > 0) {
    indexRaw = indexRaw.slice(0, num);
    for (let i = 0; i < indexRaw.length; i++) {
      let index = indexRaw[i];
      if (index >= cards.length) {
        do {
          index = Math.floor(Math.random() * cards.length);
        } while (indexSet.has(index));
      }
      if (!indexSet.has(index)) {
        indexSet.add(index);
      }
    }
  }
  while (indexSet.size < num) {
    let index;
    do {
      index = Math.floor(Math.random() * cards.length);
    } while (indexSet.has(index));
    indexSet.add(index);
  }

  console.log(`Going to pick ${Array.from(indexSet).join("-")} of deck.`);
  indexSet.forEach((index) =>
    drawn.push(
      new CardPick(
        cards[index],
        joinUrl(deck.imgr, cards[index].img),
        randomBoolean()
      )
    )
  );

  return drawn;
}

const randomBoolean = () => Math.random() >= 0.5;

export { initTarot, drawTarot, CardPick };
