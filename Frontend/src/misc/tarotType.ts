type Card = {
  index: number;
  name: string;
  local: string;
  mean: {
    upright: string;
    reversed: string;
  };
  img: string;
  desc: string[];
};

type CardPick = {
  card: Card;
  rev: boolean;
  showImg: boolean;
  showDesc: boolean;
};

export type { Card, CardPick };
