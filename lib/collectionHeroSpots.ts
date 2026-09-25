import { allProducts } from "@/lib/catalogue";
import type { CollectionHeroSpot } from "@/components/ui/CollectionHero";

function resolve(defs: { id: string; xPct: number; yPct: number }[]): CollectionHeroSpot[] {
  return defs.flatMap(({ id, xPct, yPct }) => {
    const p = allProducts.find((pp) => pp.id === id);
    return p ? [{ id, xPct, yPct, name: p.name, price: p.price }] : [];
  });
}

export const wholeHeroSpots: CollectionHeroSpot[] = resolve([
  { id: "scare-wolf-woman", xPct: 19.5, yPct: 58 },
  { id: "halloween-pop-terror-clown", xPct: 48.5, yPct: 49 },
  { id: "scare-popping-pumpkin-man", xPct: 72, yPct: 52 },
  { id: "pro-nun-from-hell", xPct: 91.5, yPct: 49 },
]);

export const standardHeroSpots: CollectionHeroSpot[] = resolve([
  { id: "halloween-pop-horrible-pumpkin", xPct: 19, yPct: 49 },
  { id: "halloween-pop-evil-witch", xPct: 38, yPct: 58 },
  { id: "halloween-pop-psycho-clown", xPct: 61.5, yPct: 43 },
]);

export const professionalHeroSpots: CollectionHeroSpot[] = resolve([
  { id: "pro-bloodthirsty-werewolf", xPct: 31, yPct: 74 },
  { id: "pro-pumpkin-hollow-scarecrow", xPct: 35, yPct: 47 },
  { id: "pro-riding-dead", xPct: 64, yPct: 58 },
]);

export const scareHeroSpots: CollectionHeroSpot[] = resolve([
  { id: "scare-screaming-little-girl", xPct: 15, yPct: 58 },
  { id: "scare-rising-spirit", xPct: 41, yPct: 49 },
  { id: "scare-angel-of-dead", xPct: 66.5, yPct: 58 },
]);
