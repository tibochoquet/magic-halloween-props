import type { Product } from "@/types";

const G = "from-[#1c0e0a] to-[#0a0505]";
const AC = "rgba(180,55,0,0.28)";
const D = "Professional grade animatronic for haunted attractions and events.";

export const professionalProducts: Product[] = [
  { id: "pro-bloodthirsty-werewolf", name: "Bloodthirsty Werewolf Professionele Halloween Animatronic", category: "monster", price: 1200, description: D, features: [], bgGradient: G, accentColor: AC, iconEmoji: "💀", image: "/products/bloodthirstywerewolf.png" },
  { id: "pro-clown-of-terror", name: "Clown of terror", category: "clown", price: 879, description: D, features: [], bgGradient: G, accentColor: AC, iconEmoji: "💀", image: "/products/clownofterror.png" },
  { id: "pro-clown-your-worse-nightmare", name: "Clown your worse Nightmare", category: "clown", price: 549, description: D, features: [], bgGradient: G, accentColor: AC, iconEmoji: "💀", image: "/products/clownyourworstnightmare.png" },
  { id: "pro-dark-evil-scarecrow", name: "Dark Evil Scarecrow", category: "monster", price: 279, originalPrice: 379, description: D, features: [], bgGradient: G, accentColor: AC, iconEmoji: "💀", image: "/products/darkevilscarecrow.png" },
  { id: "pro-elvira-animatronic", name: "Elvira animatronic", category: "witch", price: 275, description: D, features: [], bgGradient: G, accentColor: AC, iconEmoji: "💀", image: "/products/elviraanimatronic.png" },
  { id: "pro-evil-pumpkin-terror-monster", name: "Evil Pumkin Terror Monster mega grote animatronic", category: "monster", price: 879, soldOut: true, description: D, features: [], bgGradient: G, accentColor: AC, iconEmoji: "💀", image: "/products/evilpumpkinterrormonster.png" },
  { id: "pro-evil-witch-cooking", name: "Evil Witch cooking the little girl", category: "witch", price: 799, description: D, features: [], bgGradient: G, accentColor: AC, iconEmoji: "💀", image: "/products/evilwitchcookinglittlegirl.png" },
  { id: "pro-extreem-mean-witch", name: "Extreem Mean Witch ( Big size)!", category: "witch", price: 579, description: D, features: [], bgGradient: G, accentColor: AC, iconEmoji: "💀", image: "/products/extreemmeanwitch.png" },
  { id: "pro-lunging-reaper", name: "Lunging Reaper animatronic", category: "reaper", price: 479, description: D, features: [], bgGradient: G, accentColor: AC, iconEmoji: "💀", image: "/products/lungingreaper.png" },
  { id: "pro-nightmare-terror-zombie", name: "Nightmare terror zombie", category: "zombie", price: 649, soldOut: true, description: D, features: [], bgGradient: G, accentColor: AC, iconEmoji: "💀", image: "/products/nightmareterrorzombie.png" },
  { id: "pro-nun-from-hell", name: "Nun From Hell Animatronic", category: "ghost", price: 275, soldOut: true, description: D, features: [], bgGradient: G, accentColor: AC, iconEmoji: "💀", image: "/products/nunfromhell.png" },
  { id: "pro-peekaboo-little-girl", name: "Peek a Boo Little Girl Animatronic – groot horror-effect", category: "ghost", price: 175, description: D, features: [], bgGradient: G, accentColor: AC, iconEmoji: "💀", image: "/products/peekaboolittlegirl.png" },
  { id: "pro-pumpkin-hollow-ghoul", name: "Pumpkin Hollow Smoldering Ghoul animatronic", category: "ghost", price: 699, description: D, features: [], bgGradient: G, accentColor: AC, iconEmoji: "💀", image: "/products/pumpkinhollowsmolderingghoul.png" },
  { id: "pro-pumpkin-hollow-scarecrow", name: "Pumpkin Hollow Smoldering Ghoul Scarecrow", category: "ghost", price: 479, description: D, features: [], bgGradient: G, accentColor: AC, iconEmoji: "💀", image: "/products/pumpkinhollowsmolderingghoulscarecrow.png" },
  { id: "pro-riding-dead", name: "Riding dead Animatronic", category: "zombie", price: 1250, description: D, features: [], bgGradient: G, accentColor: AC, iconEmoji: "💀", image: "/products/ridingdead.png" },
  { id: "pro-rotting-reaper", name: "Rotting Reaper from Hell", category: "reaper", price: 379, description: D, features: [], bgGradient: G, accentColor: AC, iconEmoji: "💀", image: "/products/rottingreaperfromhell.png" },
  { id: "pro-screaming-angel", name: "Screeming Angel of the dark animatronic", category: "ghost", price: 479, soldOut: true, description: D, features: [], bgGradient: G, accentColor: AC, iconEmoji: "💀", image: "/products/screamingangelofthedark.png" },
  { id: "pro-skalet-animatronic", name: "Skalet Animatronic", category: "skeleton", price: 275, soldOut: true, description: D, features: [], bgGradient: G, accentColor: AC, iconEmoji: "💀", image: "/products/skaletanimatronic.png" },
  { id: "pro-old-mean-witch", name: "The old mean witch from the dark forest", category: "witch", price: 750, description: D, features: [], bgGradient: G, accentColor: AC, iconEmoji: "💀", image: "/products/oldmeanwitchdarkforest.png" },
  { id: "pro-wailing-ghost", name: "Wailing Ghost of Terror", category: "ghost", price: 799, description: D, features: [], bgGradient: G, accentColor: AC, iconEmoji: "💀", image: "/products/wailingghostofterror.png" },
  { id: "pro-weerwolf-xxl", name: "Weerwolf XXL animatronic halloween pop", category: "monster", price: 479, description: D, features: [], bgGradient: G, accentColor: AC, iconEmoji: "💀", image: "/products/weerwolfxxl.png" },
  { id: "pro-zombie-attack", name: "Zombie attack", category: "zombie", price: 379, description: D, features: [], bgGradient: G, accentColor: AC, iconEmoji: "💀", image: "/products/zombieattack.png" },
  { id: "pro-zombie-skeleton-cauldron", name: "Zombie Skeleton with Cauldron Animatronic", category: "zombie", price: 479, description: D, features: [], bgGradient: G, accentColor: AC, iconEmoji: "💀", image: "/products/zombieskeletonwithcauldron.png" },
];

export const previewProProducts = professionalProducts.filter((p) =>
  ["pro-bloodthirsty-werewolf", "pro-riding-dead", "pro-wailing-ghost"].includes(p.id)
);
