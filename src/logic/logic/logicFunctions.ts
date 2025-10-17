import type { ItemState, CheckFn, Settings } from "../types/index";
import { Item } from "../types/index";

export const getFunctions = (settings: Settings) => {

    // Helper function to check if item exists in state
    const checkItem = (i: Item, s: ItemState): boolean => {
        const x = Item[i] as keyof typeof Item;
        return (s.items[x] || 0) > 0;
    };

    // Helper function to get item count
    const getItemCount = (item: Item, state: ItemState): number => {
        const x = Item[item] as keyof typeof Item;
        return state.items[x] || 0;
    };

    // Helper function to check if room is reachable
    const isRoomReached = (roomName: string, state: ItemState): boolean => {
        return state.openRooms.includes(roomName);
    };

    const CanChangeTime = (state: ItemState): boolean => {
        return checkItem(Item.Shadow_Crystal, state)
            || isRoomReached("South Faron Woods", state)
            || isRoomReached("South Faron Woods Behind Gate", state)
            || isRoomReached("South Faron Woods Coros Ledge", state)
            || isRoomReached("South Faron Woods Owl Statue Area", state)
            || isRoomReached("South Faron Woods Above Owl Statue", state)
            || isRoomReached("Mist Area Near Faron Woods Cave", state)
            || isRoomReached("Mist Area Inside Mist", state)
            || isRoomReached("Mist Area Under Owl Statue Chest", state)
            || isRoomReached("Mist Area Near Owl Statue Chest", state)
            || isRoomReached("Mist Area Center Stump", state)
            || isRoomReached("Mist Area Outside Faron Mist Cave", state)
            || isRoomReached("Mist Area Near North Faron Woods", state)
            || isRoomReached("North Faron Woods", state)
            || isRoomReached("Lost Woods", state)
            || isRoomReached("Lost Woods Lower Battle Arena", state)
            || isRoomReached("Lost Woods Upper Battle Arena", state)
            || isRoomReached("Sacred Grove Before Block", state)
            || isRoomReached("Sacred Grove Upper", state)
            || isRoomReached("Sacred Grove Lower", state)
            || isRoomReached("Faron Field", state)
            || isRoomReached("Faron Field Behind Boulder", state)
            || isRoomReached("Kakariko Gorge", state)
            || isRoomReached("Kakariko Gorge Behind Gate", state)
            || isRoomReached("Death Mountain Near Kakariko", state)
            || isRoomReached("Death Mountain Trail", state)
            || isRoomReached("Death Mountain Volcano", state)
            || isRoomReached("Death Mountain Outside Sumo Hall", state)
            || isRoomReached("Death Mountain Elevator Lower", state)
            || isRoomReached("Eldin Field", state)
            || isRoomReached("Eldin Field Near Castle Town", state)
            || isRoomReached("Eldin Field Lava Cave Ledge", state)
            || isRoomReached("Eldin Field From Lava Cave Lower", state)
            || isRoomReached("Eldin Field Grotto Platform", state)
            || isRoomReached("Eldin Field Outside Hidden Village", state)
            || isRoomReached("Lanayru Field", state)
            || isRoomReached("Lanayru Field Behind Boulder", state)
            || isRoomReached("Hyrule Field Near Spinner Rails", state)
            || isRoomReached("Upper Zoras River", state)
            || isRoomReached("Fishing Hole", state)
            || isRoomReached("Zoras Domain", state)
            || isRoomReached("Zoras Domain West Ledge", state)
            || isRoomReached("Zoras Throne Room", state)
            || isRoomReached("Snowpeak Climb Lower", state)
            || isRoomReached("Snowpeak Climb Upper", state)
            || isRoomReached("Snowpeak Summit Upper", state)
            || isRoomReached("Snowpeak Summit Lower", state)
            || isRoomReached("Outside Castle Town West", state)
            || isRoomReached("Outside Castle Town West Grotto Ledge", state)
            || isRoomReached("Castle Town West", state)
            || isRoomReached("Castle Town Center", state)
            || isRoomReached("Castle Town East", state)
            || isRoomReached("Castle Town Doctors Office Balcony", state)
            || isRoomReached("Outside Castle Town East", state)
            || isRoomReached("Castle Town South", state)
            || isRoomReached("Outside Castle Town South", state)
            || isRoomReached("Outside Castle Town South Inside Boulder", state)
            || isRoomReached("Lake Hylia Bridge", state)
            || isRoomReached("Lake Hylia Bridge Grotto Ledge", state)
            || isRoomReached("Lake Hylia", state)
            || isRoomReached("Gerudo Desert", state)
            || isRoomReached("Gerudo Desert Cave of Ordeals Plateau", state)
            || isRoomReached("Gerudo Desert Basin", state)
            || isRoomReached("Gerudo Desert North East Ledge", state)
            || isRoomReached("Gerudo Desert Outside Bulblin Camp", state)
            || isRoomReached("Bulblin Camp", state)
            || isRoomReached("Mirror Chamber Lower", state)
            || isRoomReached("Mirror Chamber Upper", state)
            || isRoomReached("Mirror Chamber Portal", state);
    };

    const canGetHotSpringWater = (state: ItemState): boolean => {
        return (
            isRoomReached("Lower Kakariko Village", state)
            || isRoomReached("Death Mountain Elevator Lower", state)
        ) && HasBottle(state);
    };

    const HasSword = (state: ItemState): boolean => {
        return getItemCount(Item.Progressive_Sword, state) >= 1;
    };

    const hasBombs = (state: ItemState): boolean => {
        return checkItem(Item.Filled_Bomb_Bag, state)
            && (
                isRoomReached("Kakariko Barnes Bomb Shop Lower", state)
                || (
                    isRoomReached("Eldin Field Water Bomb Fish Grotto", state)
                    && getItemCount(Item.Progressive_Fishing_Rod, state) >= 1
                )
                || isRoomReached("Castle Town Goron House", state)
                || isRoomReached("City in The Sky Entrance", state)
            );
    };

    const HasDamagingItem = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || hasBombs(state)
            || checkItem(Item.Iron_Boots, state)
            || checkItem(Item.Shadow_Crystal, state)
            || checkItem(Item.Spinner, state);
    };

    const CanDoNicheStuff = (state: ItemState): boolean => {
        return settings.logicRules === "Glitched";
    };

    const CanDoDifficultCombat = (state: ItemState): boolean => {
        return false; // TODO: Change to use setting once it's made
    };

    const CanUseBacksliceAsSword = (state: ItemState): boolean => {
        return CanDoNicheStuff(state) && getItemCount(Item.Progressive_Hidden_Skill, state) >= 3;
    };

    const CanDefeatAeralfos = (state: ItemState): boolean => {
        return (
            getItemCount(Item.Progressive_Clawshot, state) >= 1
            && (
                HasSword(state)
                || checkItem(Item.Ball_and_Chain, state)
                || checkItem(Item.Shadow_Crystal, state)
                || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            )
        );
    };

    const CanDefeatArmos = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Shadow_Crystal, state)
            || getItemCount(Item.Progressive_Clawshot, state) >= 1
            || hasBombs(state)
            || checkItem(Item.Spinner, state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatBabaSerpent = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatBabyGohma = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Slingshot, state)
            || getItemCount(Item.Progressive_Clawshot, state) >= 1
            || hasBombs(state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatBari = (state: ItemState): boolean => {
        return CanUseWaterBombs(state) || getItemCount(Item.Progressive_Clawshot, state) >= 1;
    };

    const CanDefeatBeamos = (state: ItemState): boolean => {
        return checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || hasBombs(state);
    };

    const CanGetArrows = (state: ItemState): boolean => {
        return canClearForest(state) || isRoomReached("Lost Woods", state);
    };

    const CanDefeatBigBaba = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || (getItemCount(Item.Progressive_Bow, state) >= 1 && CanGetArrows(state))
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Shadow_Crystal, state)
            || checkItem(Item.Spinner, state)
            || hasBombs(state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatChu = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state)
            || getItemCount(Item.Progressive_Clawshot, state) >= 1
            || hasBombs(state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatBokoblinRed = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || (getItemCount(Item.Progressive_Bow, state) >= 3 && CanGetArrows(state))
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state)
            || CanUseBacksliceAsSword(state)
            || (CanDoDifficultCombat(state) && (checkItem(Item.Iron_Boots, state) || checkItem(Item.Spinner, state)));
    };

    const hasShield = (state: ItemState): boolean => {
        return checkItem(Item.Hylian_Shield, state)
            || isRoomReached("Kakariko Malo Mart", state)
            || isRoomReached("Castle Town Goron House", state)
            || (
                isRoomReached("Death Mountain Volcano", state)
                && CanDefeatGoron(state)
            );
    };

    const CanDefeatBombfish = (state: ItemState): boolean => {
        return (
            (
                checkItem(Item.Iron_Boots, state)
                || (settings.logicRules === "Glitched" && checkItem(Item.Magic_Armor, state))
            )
            && (
                HasSword(state)
                || getItemCount(Item.Progressive_Clawshot, state) >= 1
                || (hasShield(state) && getItemCount(Item.Progressive_Hidden_Skill, state) >= 2)
            )
        );
    };

    const CanDefeatBombling = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || (getItemCount(Item.Progressive_Bow, state) >= 1 && CanGetArrows(state))
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state)
            || getItemCount(Item.Progressive_Clawshot, state) >= 1;
    };

    const CanDefeatBomskit = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state)
            || CanUseBacksliceAsSword(state)
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state));
    };

    const CanDefeatBubble = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatBulblin = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatChilfos = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Shadow_Crystal, state)
            || checkItem(Item.Spinner, state)
            || hasBombs(state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatChuWorm = (state: ItemState): boolean => {
        return (
            HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state)
            || CanUseBacksliceAsSword(state)
        ) && (hasBombs(state) || getItemCount(Item.Progressive_Clawshot, state) >= 1);
    };

    const CanDefeatDarknut = (state: ItemState): boolean => {
        return HasSword(state)
            || (CanDoDifficultCombat(state) && (hasBombs(state) || checkItem(Item.Ball_and_Chain, state)));
    };

    const CanDefeatDekuBaba = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || getItemCount(Item.Progressive_Hidden_Skill, state) >= 2
            || checkItem(Item.Slingshot, state)
            || getItemCount(Item.Progressive_Clawshot, state) >= 1
            || hasBombs(state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatDekuLike = (state: ItemState): boolean => {
        return hasBombs(state);
    };

    const CanDefeatDodongo = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatDinalfos = (state: ItemState): boolean => {
        return HasSword(state) || checkItem(Item.Ball_and_Chain, state) || checkItem(Item.Shadow_Crystal, state);
    };

    const CanDefeatFireBubble = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatFireKeese = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Slingshot, state)
            || checkItem(Item.Shadow_Crystal, state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatFireToadpoli = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (checkItem(Item.Hylian_Shield, state) && getItemCount(Item.Progressive_Hidden_Skill, state) >= 2)
            || (CanDoDifficultCombat(state) && checkItem(Item.Shadow_Crystal, state));
    };

    const CanDefeatFreezard = (state: ItemState): boolean => {
        return checkItem(Item.Ball_and_Chain, state);
    };

    const CanDefeatGoron = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || (hasShield(state) && getItemCount(Item.Progressive_Hidden_Skill, state) >= 2)
            || checkItem(Item.Slingshot, state)
            || (CanDoDifficultCombat(state) && checkItem(Item.Lantern, state))
            || getItemCount(Item.Progressive_Clawshot, state) >= 1
            || hasBombs(state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatGhoulRat = (state: ItemState): boolean => {
        return checkItem(Item.Shadow_Crystal, state);
    };

    const CanDefeatGuay = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || (CanDoDifficultCombat(state) && checkItem(Item.Spinner, state))
            || checkItem(Item.Shadow_Crystal, state)
            || checkItem(Item.Slingshot, state);
    };

    const CanDefeatHelmasaur = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatHelmasaurus = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatIceBubble = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatIceKeese = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Slingshot, state)
            || checkItem(Item.Shadow_Crystal, state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatPoe = (state: ItemState): boolean => {
        return checkItem(Item.Shadow_Crystal, state);
    };

    const CanDefeatKargarok = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatKeese = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Slingshot, state)
            || checkItem(Item.Shadow_Crystal, state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatLeever = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state);
    };

    const CanDefeatLizalfos = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatMiniFreezard = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatMoldorm = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state);
    };

    const CanDefeatPoisonMite = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || checkItem(Item.Lantern, state)
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state);
    };

    const CanDefeatPuppet = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatRat = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Slingshot, state)
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatRedeadKnight = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state)
            || CanUseBacksliceAsSword(state);
    };

    const CanCompleteMDH = (state: ItemState): boolean => {
        return settings.skipMdh === true
            || (
                canCompleteLakebedTemple(state)
                && isRoomReached("Castle Town South", state)
            );
    };

    const CanDefeatShadowBeast = (state: ItemState): boolean => {
        return HasSword(state) || (checkItem(Item.Shadow_Crystal, state) && CanCompleteMDH(state));
    };

    const CanDefeatShadowBulblin = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatShadowDekuBaba = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || getItemCount(Item.Progressive_Hidden_Skill, state) >= 2
            || checkItem(Item.Slingshot, state)
            || getItemCount(Item.Progressive_Clawshot, state) >= 1
            || hasBombs(state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatShadowInsect = (state: ItemState): boolean => {
        return checkItem(Item.Shadow_Crystal, state);
    };

    const CanDefeatShadowKargarok = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatShadowKeese = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Slingshot, state)
            || checkItem(Item.Shadow_Crystal, state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatShadowVermin = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatShellBlade = (state: ItemState): boolean => {
        return CanUseWaterBombs(state)
            || (
                HasSword(state)
                && (checkItem(Item.Iron_Boots, state) || (CanDoNicheStuff(state) && checkItem(Item.Magic_Armor, state)))
            );
    };

    const CanDefeatSkullfish = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state);
    };

    const CanDefeatSkulltula = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state)
            || CanUseBacksliceAsSword(state);
    };

    const canSmash = (state: ItemState): boolean => {
        return checkItem(Item.Ball_and_Chain, state) || hasBombs(state);
    };

    const CanDefeatStalfos = (state: ItemState): boolean => {
        return canSmash(state);
    };

    const CanDefeatStalhound = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatStalchild = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatTektite = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatTileWorm = (state: ItemState): boolean => {
        return (
            HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || checkItem(Item.Shadow_Crystal, state)
            || checkItem(Item.Spinner, state)
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || hasBombs(state)
            || CanUseBacksliceAsSword(state)
        ) && checkItem(Item.Boomerang, state);
    };

    const CanDefeatToado = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state);
    };

    const CanDefeatWaterToadpoli = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (hasShield(state) && getItemCount(Item.Progressive_Hidden_Skill, state) >= 2)
            || (CanDoDifficultCombat(state) && checkItem(Item.Shadow_Crystal, state));
    };

    const CanDefeatTorchSlug = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state);
    };

    const CanDefeatWalltula = (state: ItemState): boolean => {
        return checkItem(Item.Ball_and_Chain, state)
            || checkItem(Item.Slingshot, state)
            || (getItemCount(Item.Progressive_Bow, state) >= 1 && CanGetArrows(state))
            || checkItem(Item.Boomerang, state)
            || getItemCount(Item.Progressive_Clawshot, state) >= 1;
    };

    const CanDefeatWhiteWolfos = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state);
    };

    const CanDefeatYoungGohma = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state);
    };

    const CanDefeatZantHead = (state: ItemState): boolean => {
        return checkItem(Item.Shadow_Crystal, state) || HasSword(state) || CanUseBacksliceAsSword(state);
    };

    const CanDefeatOok = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || (getItemCount(Item.Progressive_Bow, state) >= 1 && CanGetArrows(state))
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatDangoro = (state: ItemState): boolean => {
        return (
            HasSword(state)
            || checkItem(Item.Shadow_Crystal, state)
            || (
                CanDoNicheStuff(state)
                && (
                    checkItem(Item.Ball_and_Chain, state)
                    || (getItemCount(Item.Progressive_Bow, state) >= 1 && hasBombs(state))
                )
            )
        ) && checkItem(Item.Iron_Boots, state);
    };

    const CanDefeatCarrierKargarok = (state: ItemState): boolean => {
        return checkItem(Item.Shadow_Crystal, state);
    };

    const CanDefeatTwilitBloat = (state: ItemState): boolean => {
        return checkItem(Item.Shadow_Crystal, state);
    };

    const CanDefeatDekuToad = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state)
            || CanUseBacksliceAsSword(state);
    };

    const CanDefeatSkullKid = (state: ItemState): boolean => {
        return getItemCount(Item.Progressive_Bow, state) >= 1;
    };

    const CanDefeatKingBulblinBridge = (state: ItemState): boolean => {
        return getItemCount(Item.Progressive_Bow, state) >= 1;
    };

    const CanDefeatKingBulblinDesert = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || checkItem(Item.Shadow_Crystal, state)
            || getItemCount(Item.Progressive_Bow, state) > 2
            || CanUseBacksliceAsSword(state)
            || (
                CanDoDifficultCombat(state)
                && (
                    checkItem(Item.Spinner, state)
                    || checkItem(Item.Iron_Boots, state)
                    || hasBombs(state)
                    || getItemCount(Item.Progressive_Bow, state) >= 2
                )
            );
    };

    const CanDefeatKingBulblinCastle = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || checkItem(Item.Shadow_Crystal, state)
            || getItemCount(Item.Progressive_Bow, state) > 2
            || (
                CanDoDifficultCombat(state)
                && (
                    checkItem(Item.Spinner, state)
                    || checkItem(Item.Iron_Boots, state)
                    || hasBombs(state)
                    || CanUseBacksliceAsSword(state)
                )
            );
    };

    const CanDefeatDeathSword = (state: ItemState): boolean => {
        return HasSword(state)
            && (
                checkItem(Item.Boomerang, state)
                || getItemCount(Item.Progressive_Bow, state) >= 1
                || getItemCount(Item.Progressive_Clawshot, state) >= 1
            )
            && checkItem(Item.Shadow_Crystal, state);
    };

    const CanDefeatDarkhammer = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state)
            || (CanDoDifficultCombat(state) && CanUseBacksliceAsSword(state));
    };

    const CanDefeatPhantomZant = (state: ItemState): boolean => {
        return checkItem(Item.Shadow_Crystal, state) || HasSword(state);
    };

    const canLaunchBombs = (state: ItemState): boolean => {
        return (checkItem(Item.Boomerang, state) || getItemCount(Item.Progressive_Bow, state) >= 1) && hasBombs(state);
    };

    const CanDefeatDiababa = (state: ItemState): boolean => {
        return canLaunchBombs(state)
            || (
                checkItem(Item.Boomerang, state)
                && (
                    HasSword(state)
                    || checkItem(Item.Ball_and_Chain, state)
                    || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
                    || checkItem(Item.Shadow_Crystal, state)
                    || hasBombs(state)
                    || (CanDoDifficultCombat(state) && CanUseBacksliceAsSword(state))
                )
            );
    };

    const CanDefeatFyrus = (state: ItemState): boolean => {
        return getItemCount(Item.Progressive_Bow, state) >= 1
            && checkItem(Item.Iron_Boots, state)
            && (HasSword(state) || (CanDoDifficultCombat(state) && CanUseBacksliceAsSword(state)));
    };

    const CanDoAirRefill = (state: ItemState): boolean => {
        return CanUseWaterBombs(state)
            && (
                checkItem(Item.Magic_Armor, state)
                || (checkItem(Item.Iron_Boots, state) && GetItemWheelSlotCount(state) >= 3)
            );
    };

    const CanDefeatMorpheel = (state: ItemState): boolean => {
        return (
            checkItem(Item.Zora_Armor, state)
            && checkItem(Item.Iron_Boots, state)
            && HasSword(state)
            && getItemCount(Item.Progressive_Clawshot, state) >= 1
        ) || (
            CanDoNicheStuff(state)
            && getItemCount(Item.Progressive_Clawshot, state) >= 1
            && CanDoAirRefill(state)
            && HasSword(state)
        );
    };

    const CanDefeatStallord = (state: ItemState): boolean => {
        return (checkItem(Item.Spinner, state) && HasSword(state))
            || (CanDoDifficultCombat(state) && checkItem(Item.Spinner, state));
    };

    const CanDefeatBlizzeta = (state: ItemState): boolean => {
        return checkItem(Item.Ball_and_Chain, state);
    };

    const CanDefeatArmogohma = (state: ItemState): boolean => {
        return getItemCount(Item.Progressive_Bow, state) >= 1
            && getItemCount(Item.Progressive_Dominion_Rod, state) >= 1;
    };

    const CanDefeatArgorok = (state: ItemState): boolean => {
        return getItemCount(Item.Progressive_Clawshot, state) >= 2
            && getItemCount(Item.Progressive_Sword, state) >= 2
            && (checkItem(Item.Iron_Boots, state) || (CanDoNicheStuff(state) && checkItem(Item.Magic_Armor, state)));
    };

    const CanDefeatZant = (state: ItemState): boolean => {
        return getItemCount(Item.Progressive_Sword, state) >= 3
            && checkItem(Item.Boomerang, state)
            && getItemCount(Item.Progressive_Clawshot, state) >= 1
            && checkItem(Item.Ball_and_Chain, state)
            && (checkItem(Item.Iron_Boots, state) || (CanDoNicheStuff(state) && checkItem(Item.Magic_Armor, state)))
            && (
                checkItem(Item.Zora_Armor, state)
                || (settings.logicRules === "Glitched" && CanDoAirRefill(state))
            );
    };

    const CanDefeatGanondorf = (state: ItemState): boolean => {
        return checkItem(Item.Shadow_Crystal, state)
            && getItemCount(Item.Progressive_Sword, state) >= 3
            && getItemCount(Item.Progressive_Hidden_Skill, state) >= 1;
    };

    const canBurnWebs = (state: ItemState): boolean => {
        return checkItem(Item.Lantern, state) || hasBombs(state) || checkItem(Item.Ball_and_Chain, state);
    };

    const hasRangedItem = (state: ItemState): boolean => {
        return checkItem(Item.Ball_and_Chain, state)
            || checkItem(Item.Slingshot, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || getItemCount(Item.Progressive_Clawshot, state) >= 1
            || checkItem(Item.Boomerang, state);
    };

    const HasBottle = (state: ItemState): boolean => {
        return (
            checkItem(Item.Empty_Bottle, state)
            || checkItem(Item.Sera_Bottle, state)
            || checkItem(Item.Jovani_Bottle, state)
            || checkItem(Item.Coro_Bottle, state)
        ) && checkItem(Item.Lantern, state);
    };

    const HasBottles = (state: ItemState): boolean => {
        let n = 0;
        if (checkItem(Item.Lantern, state)) {
            if (checkItem(Item.Empty_Bottle, state)) n++;
            if (checkItem(Item.Sera_Bottle, state)) n++;
            if (checkItem(Item.Jovani_Bottle, state)) n++;
            if (checkItem(Item.Coro_Bottle, state)) n++;
            if (n > 1) return true;
        }
        return false;
    };

    const CanUseBottledFairy = (state: ItemState): boolean => {
        return HasBottle(state) && isRoomReached("Lake Hylia", state);
    };

    const CanUseBottledFairies = (state: ItemState): boolean => {
        return HasBottles(state) && isRoomReached("Lake Hylia", state);
    };

    const CanUseOilBottle = (state: ItemState): boolean => {
        return checkItem(Item.Lantern, state) && checkItem(Item.Coro_Bottle, state);
    };

    const canCutHangingWeb = (state: ItemState): boolean => {
        return getItemCount(Item.Progressive_Clawshot, state) >= 1
            || (getItemCount(Item.Progressive_Bow, state) >= 1 && CanGetArrows(state))
            || checkItem(Item.Boomerang, state)
            || checkItem(Item.Ball_and_Chain, state);
    };

    const GetPlayerHealth = (state: ItemState): number => {
        let playerHealth = 3.0;
        playerHealth = playerHealth + (getItemCount(Item.Piece_of_Heart, state) * 0.2);
        playerHealth = playerHealth + getItemCount(Item.Heart_Container, state);
        return Math.floor(playerHealth);
    };

    const CanDoMoonBoots = (state: ItemState): boolean => {
        return HasSword(state)
            && (
                checkItem(Item.Magic_Armor, state)
                || (checkItem(Item.Iron_Boots, state) && GetItemWheelSlotCount(state) >= 3)
            );
    };

    const CanDoBSMoonBoots = (state: ItemState): boolean => {
        return getItemCount(Item.Progressive_Hidden_Skill, state) >= 3 && checkItem(Item.Magic_Armor, state);
    };

    const CanDoJSMoonBoots = (state: ItemState): boolean => {
        return CanDoMoonBoots(state) && getItemCount(Item.Progressive_Hidden_Skill, state) >= 6;
    };

    const canKnockDownHCPainting = (state: ItemState): boolean => {
        return getItemCount(Item.Progressive_Bow, state) >= 1
            || (
                CanDoNicheStuff(state)
                && (
                    hasBombs(state)
                    || (HasSword(state) && getItemCount(Item.Progressive_Hidden_Skill, state) >= 6)
                )
            )
            || (
                settings.logicRules === "Glitched"
                && ((HasSword(state) && CanDoMoonBoots(state)) || CanDoBSMoonBoots(state))
            );
    };

    const canBreakMonkeyCage = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Iron_Boots, state)
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Ball_and_Chain, state)
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state)
            || (getItemCount(Item.Progressive_Bow, state) >= 1 && CanGetArrows(state))
            || getItemCount(Item.Progressive_Clawshot, state) >= 1
            || (CanDoNicheStuff(state) && getItemCount(Item.Progressive_Hidden_Skill, state) >= 2);
    };

    const canPressMinesSwitch = (state: ItemState): boolean => {
        return checkItem(Item.Iron_Boots, state) || (CanDoNicheStuff(state) && checkItem(Item.Ball_and_Chain, state));
    };

    const CanDefeatBokoblin = (state: ItemState): boolean => {
        return HasSword(state)
            || checkItem(Item.Ball_and_Chain, state)
            || (getItemCount(Item.Progressive_Bow, state) >= 1 && CanGetArrows(state))
            || (CanDoNicheStuff(state) && checkItem(Item.Iron_Boots, state))
            || checkItem(Item.Spinner, state)
            || checkItem(Item.Slingshot, state)
            || checkItem(Item.Shadow_Crystal, state)
            || hasBombs(state)
            || CanUseBacksliceAsSword(state);
    };

    const canFreeAllMonkeys = (state: ItemState): boolean => {
        return canBreakMonkeyCage(state)
            && (
                checkItem(Item.Lantern, state)
                || (
                    settings.smallKeySettings === "Keysy"
                    && (hasBombs(state) || checkItem(Item.Iron_Boots, state))
                )
            )
            && canBurnWebs(state)
            && checkItem(Item.Boomerang, state)
            && CanDefeatBokoblin(state)
            && (
                getItemCount(Item.Forest_Temple_Small_Key, state) >= 4
                || settings.smallKeySettings === "Keysy"
            );
    };

    const canKnockDownHangingBaba = (state: ItemState): boolean => {
        return getItemCount(Item.Progressive_Bow, state) >= 1
            || getItemCount(Item.Progressive_Clawshot, state) >= 1
            || checkItem(Item.Boomerang, state)
            || checkItem(Item.Slingshot, state);
    };

    const canBreakWoodenDoor = (state: ItemState): boolean => {
        return checkItem(Item.Shadow_Crystal, state) || HasSword(state) || canSmash(state) || CanUseBacksliceAsSword(state);
    };

    const CanUseWaterBombs = (state: ItemState): boolean => {
        return checkItem(Item.Filled_Bomb_Bag, state)
            && (
                isRoomReached("Kakariko Barnes Bomb Shop Lower", state)
                || (
                    isRoomReached("Eldin Field Water Bomb Fish Grotto", state)
                    && getItemCount(Item.Progressive_Fishing_Rod, state) >= 1
                )
                || (
                    isRoomReached("Kakariko Barnes Bomb Shop Lower", state)
                    && isRoomReached("Castle Town Malo Mart", state)
                )
            );
    };

    const canCompletePrologue = (state: ItemState): boolean => {
        return (
            HasSword(state)
            && checkItem(Item.Slingshot, state)
            && (
                checkItem(Item.North_Faron_Woods_Gate_Key, state)
                || settings.smallKeySettings === "Keysy"
            )
        ) || settings.skipPrologue === true;
    };

    const canCompleteForestTemple = (state: ItemState): boolean => {
        return isRoomReached("Forest Temple Boss Room", state) && CanDefeatDiababa(state);
    };

    const canCompleteGoronMines = (state: ItemState): boolean => {
        return isRoomReached("Goron Mines Boss Room", state) && CanDefeatFyrus(state);
    };

    const canCompleteLakebedTemple = (state: ItemState): boolean => {
        return isRoomReached("Lakebed Temple Boss Room", state) && CanDefeatMorpheel(state);
    };

    const canCompleteArbitersGrounds = (state: ItemState): boolean => {
        return isRoomReached("Arbiters Grounds Boss Room", state) && CanDefeatStallord(state);
    };

    const canCompleteSnowpeakRuins = (state: ItemState): boolean => {
        return isRoomReached("Snowpeak Ruins Boss Room", state) && CanDefeatBlizzeta(state);
    };

    const canCompleteTempleofTime = (state: ItemState): boolean => {
        return isRoomReached("Temple of Time Boss Room", state) && CanDefeatArmogohma(state);
    };

    const canCompleteCityinTheSky = (state: ItemState): boolean => {
        return isRoomReached("City in The Sky Boss Room", state) && CanDefeatArgorok(state);
    };

    const canCompletePalaceofTwilight = (state: ItemState): boolean => {
        return isRoomReached("Palace of Twilight Boss Room", state) && CanDefeatZant(state);
    };

    const canCompleteAllDungeons = (state: ItemState): boolean => {
        return canCompleteForestTemple(state)
            && canCompleteGoronMines(state)
            && canCompleteLakebedTemple(state)
            && canCompleteArbitersGrounds(state)
            && canCompleteSnowpeakRuins(state)
            && canCompleteTempleofTime(state)
            && canCompleteCityinTheSky(state)
            && canCompletePalaceofTwilight(state);
    };

    const CanCompleteFaronTwilight = (state: ItemState): boolean => {
        return settings.faronTwilightCleared === true
            || (
                canCompletePrologue(state)
                && isRoomReached("South Faron Woods", state)
                && isRoomReached("Faron Woods Coros House Lower", state)
                && isRoomReached("Mist Area Near Faron Woods Cave", state)
                && isRoomReached("North Faron Woods", state)
                && isRoomReached("Ordon Sword House", state)
                && isRoomReached("Ordon Shield House", state)
                && (
                    !settings.bonksDoDamage
                    || (
                        settings.bonksDoDamage
                        && (
                            settings.damageMagnification !== "OHKO"
                            || CanUseBottledFairies(state)
                        )
                    )
                )
            );
    };

    const canClearForest = (state: ItemState): boolean => {
        return (
            canCompleteForestTemple(state)
            || settings.faronWoodsLogic === "Open"
        )
        && canCompletePrologue(state)
        && CanCompleteFaronTwilight(state);
    };

    const CanCompleteEldinTwilight = (state: ItemState): boolean => {
        return settings.eldinTwilightCleared === true
            || (
                canCompletePrologue(state)
                && canClearForest(state)
                && (
                    !settings.bonksDoDamage
                    || (
                        settings.bonksDoDamage
                        && (
                            settings.damageMagnification !== "OHKO"
                            || CanUseBottledFairies(state)
                        )
                    )
                )
            );
    };

    const CanCompleteLanayruTwilight = (state: ItemState): boolean => {
        return settings.lanayruTwilightCleared === true
            || (
                (
                    isRoomReached("North Eldin Field", state)
                    || checkItem(Item.Shadow_Crystal, state)
                )
                && isRoomReached("Zoras Domain", state)
                && isRoomReached("Zoras Throne Room", state)
                && isRoomReached("Upper Zoras River", state)
                && isRoomReached("Lake Hylia", state)
                && isRoomReached("Lake Hylia Lanayru Spring", state)
                && isRoomReached("Castle Town South", state)
                && (
                    !settings.bonksDoDamage
                    || (
                        settings.bonksDoDamage
                        && (
                            settings.damageMagnification !== "OHKO"
                            || CanUseBottledFairies(state)
                        )
                    )
                )
            );
    };

    const CanCompleteAllTwilight = (state: ItemState): boolean => {
        return CanCompleteFaronTwilight(state)
            && CanCompleteEldinTwilight(state)
            && CanCompleteLanayruTwilight(state);
    };

    const HasBug = (state: ItemState): boolean => {
        const goldenBugs = [
            Item.Male_Beetle, Item.Female_Beetle,
            Item.Male_Butterfly, Item.Female_Butterfly,
            Item.Male_Stag_Beetle, Item.Female_Stag_Beetle,
            Item.Male_Grasshopper, Item.Female_Grasshopper,
            Item.Male_Phasmid, Item.Female_Phasmid,
            Item.Male_Pill_Bug, Item.Female_Pill_Bug,
            Item.Male_Mantis, Item.Female_Mantis,
            Item.Male_Ladybug, Item.Female_Ladybug,
            Item.Male_Snail, Item.Female_Snail,
            Item.Male_Dragonfly, Item.Female_Dragonfly,
            Item.Male_Ant, Item.Female_Ant,
            Item.Male_Dayfly, Item.Female_Dayfly
        ];

        for (const bug of goldenBugs) {
            if (checkItem(bug, state)) {
                return true;
            }
        }
        return false;
    };

    const HasSwordOrBS = (state: ItemState): boolean => {
        return getItemCount(Item.Progressive_Sword, state) >= 1
            || getItemCount(Item.Progressive_Hidden_Skill, state) >= 3;
    };

    const HasHeavyMod = (state: ItemState): boolean => {
        return checkItem(Item.Iron_Boots, state) || checkItem(Item.Magic_Armor, state);
    };

    const HasCutsceneItem = (state: ItemState): boolean => {
        return getItemCount(Item.Progressive_Sky_Book, state) >= 1
            || HasBottle(state)
            || checkItem(Item.Horse_Call, state);
    };

    const CanDoLJA = (state: ItemState): boolean => {
        return HasSword(state) && checkItem(Item.Boomerang, state);
    };

    const CanDoJSLJA = (state: ItemState): boolean => {
        return HasSword(state)
            && checkItem(Item.Boomerang, state)
            && getItemCount(Item.Progressive_Hidden_Skill, state) >= 6;
    };

    const CanDoMapGlitch = (state: ItemState): boolean => {
        return checkItem(Item.Shadow_Crystal, state) && isRoomReached("Kakariko Gorge", state);
    };

    const HasOneHandedItem = (state: ItemState): boolean => {
        return HasSword(state)
            || HasBottle(state)
            || checkItem(Item.Boomerang, state)
            || getItemCount(Item.Progressive_Clawshot, state) >= 1
            || checkItem(Item.Lantern, state)
            || getItemCount(Item.Progressive_Bow, state) >= 1
            || checkItem(Item.Slingshot, state)
            || getItemCount(Item.Progressive_Dominion_Rod, state) >= 1;
    };

    const CanDoStorage = (state: ItemState): boolean => {
        return CanDoMapGlitch(state) && HasOneHandedItem(state);
    };

    const CanDoEBMoonBoots = (state: ItemState): boolean => {
        return CanDoMoonBoots(state)
            && getItemCount(Item.Progressive_Hidden_Skill, state) >= 1
            && getItemCount(Item.Progressive_Sword, state) >= 2;
    };

    const CanDoHSMoonBoots = (state: ItemState): boolean => {
        return CanDoMoonBoots(state)
            && getItemCount(Item.Progressive_Hidden_Skill, state) >= 4
            && HasSword(state)
            && hasShield(state);
    };

    const CanDoFlyGlitch = (state: ItemState): boolean => {
        return getItemCount(Item.Progressive_Fishing_Rod, state) >= 1 && HasHeavyMod(state);
    };

    const CanDoHiddenVillageGlitched = (state: ItemState): boolean => {
        return getItemCount(Item.Progressive_Bow, state) >= 1
            || checkItem(Item.Ball_and_Chain, state)
            || (
                checkItem(Item.Slingshot, state)
                && (
                    checkItem(Item.Shadow_Crystal, state)
                    || HasSword(state)
                    || hasBombs(state)
                    || checkItem(Item.Iron_Boots, state)
                    || checkItem(Item.Spinner, state)
                )
            );
    };

    const CanDoFTWindlessBridgeRoom = (state: ItemState): boolean => {
        return hasBombs(state) || CanDoBSMoonBoots(state) || CanDoJSMoonBoots(state);
    };

    const canClearForestGlitched = (state: ItemState): boolean => {
        return canCompletePrologue(state)
            && (
                settings.faronWoodsLogic === "Open"
                || canCompleteForestTemple(state)
                || CanDoLJA(state)
                || CanDoMapGlitch(state)
            );
    };

    const CanCompleteEldinTwilightGlitched = (state: ItemState): boolean => {
        return settings.eldinTwilightCleared === true || canClearForestGlitched(state);
    };

    const CanSkipKeyToDekuToad = (state: ItemState): boolean => {
        return settings.smallKeySettings === "Keysy"
            || getItemCount(Item.Progressive_Hidden_Skill, state) >= 3
            || CanDoBSMoonBoots(state)
            || CanDoJSMoonBoots(state)
            || CanDoLJA(state)
            || (
                hasBombs(state)
                && (HasHeavyMod(state) || getItemCount(Item.Progressive_Hidden_Skill, state) >= 6)
            );
    };

    const GetItemWheelSlotCount = (state: ItemState): number => {
        const itemWheelItems = [
            Item.Lantern,
            Item.Slingshot,
            Item.Progressive_Fishing_Rod,
            Item.Iron_Boots,
            Item.Progressive_Bow,
            Item.Boomerang,
            Item.Spinner,
            Item.Ball_and_Chain,
            Item.Progressive_Dominion_Rod,
            Item.Progressive_Clawshot
        ];

        let count = 0;
        for (const item of itemWheelItems) {
            if (checkItem(item, state)) {
                count++;
            }
        }
        return count;
    };

    const CanGetBugWithLantern = (state: ItemState): boolean => {
        return false;
    }

    // Export all logic functions as a single object

    const logicFunctions: {[key: string]: CheckFn} = {
        CanChangeTime,
        canGetHotSpringWater,
        HasSword,
        hasBombs,
        HasDamagingItem,
        CanDoNicheStuff,
        CanDoDifficultCombat,
        CanUseBacksliceAsSword,
        CanDefeatAeralfos,
        CanDefeatArmos,
        CanDefeatBabaSerpent,
        CanDefeatBabyGohma,
        CanDefeatBari,
        CanDefeatBeamos,
        CanGetArrows,
        CanDefeatBigBaba,
        CanDefeatChuWorm,
        CanDefeatChu,
        CanDefeatBokoblinRed,
        CanDefeatBokoblin,
        hasShield,
        CanDefeatBombfish,
        CanDefeatBombling,
        CanDefeatBomskit,
        CanDefeatBubble,
        CanDefeatBulblin,
        CanDefeatChilfos,
        CanDefeatDarknut,
        CanDefeatDekuBaba,
        CanDefeatDekuLike,
        CanDefeatDodongo,
        CanDefeatDinalfos,
        CanDefeatFireBubble,
        CanDefeatFireKeese,
        CanDefeatFireToadpoli,
        CanDefeatFreezard,
        CanDefeatGoron,
        CanDefeatGhoulRat,
        CanDefeatGuay,
        CanDefeatHelmasaur,
        CanDefeatHelmasaurus,
        CanDefeatIceBubble,
        CanDefeatIceKeese,
        CanDefeatPoe,
        CanDefeatKargarok,
        CanDefeatKeese,
        CanDefeatLeever,
        CanDefeatLizalfos,
        CanDefeatMiniFreezard,
        CanDefeatMoldorm,
        CanDefeatPoisonMite,
        CanDefeatPuppet,
        CanDefeatRat,
        CanDefeatRedeadKnight,
        CanCompleteMDH,
        CanDefeatShadowBeast,
        CanDefeatShadowBulblin,
        CanDefeatShadowDekuBaba,
        CanDefeatShadowInsect,
        CanDefeatShadowKargarok,
        CanDefeatShadowKeese,
        CanDefeatShadowVermin,
        CanDefeatShellBlade,
        CanDefeatSkullfish,
        CanDefeatSkulltula,
        canSmash,
        CanDefeatStalfos,
        CanDefeatStalhound,
        CanDefeatStalchild,
        CanDefeatTektite,
        CanDefeatTileWorm,
        CanDefeatToado,
        CanDefeatWaterToadpoli,
        CanDefeatTorchSlug,
        CanDefeatWalltula,
        CanDefeatWhiteWolfos,
        CanDefeatYoungGohma,
        CanDefeatZantHead,
        CanDefeatOok,
        CanDefeatDangoro,
        CanDefeatCarrierKargarok,
        CanDefeatTwilitBloat,
        CanDefeatDekuToad,
        CanDefeatSkullKid,
        CanDefeatKingBulblinBridge,
        CanDefeatKingBulblinDesert,
        CanDefeatKingBulblinCastle,
        CanDefeatDeathSword,
        CanDefeatDarkhammer,
        CanDefeatPhantomZant,
        canLaunchBombs,
        CanDefeatDiababa,
        CanDefeatFyrus,
        CanDoAirRefill,
        CanDefeatMorpheel,
        CanDefeatStallord,
        CanDefeatBlizzeta,
        CanDefeatArmogohma,
        CanDefeatArgorok,
        CanDefeatZant,
        CanDefeatGanondorf,
        canBurnWebs,
        hasRangedItem,
        HasBottle,
        HasBottles,
        CanUseBottledFairy,
        CanUseBottledFairies,
        CanUseOilBottle,
        canCutHangingWeb,
        // GetPlayerHealth,
        CanDoMoonBoots,
        CanDoBSMoonBoots,
        CanDoJSMoonBoots,
        canKnockDownHCPainting,
        canBreakMonkeyCage,
        canPressMinesSwitch,
        canFreeAllMonkeys,
        canKnockDownHangingBaba,
        canBreakWoodenDoor,
        CanUseWaterBombs,
        canCompletePrologue,
        canCompleteForestTemple,
        canCompleteGoronMines,
        canCompleteLakebedTemple,
        canCompleteArbitersGrounds,
        canCompleteSnowpeakRuins,
        canCompleteTempleofTime,
        canCompleteCityinTheSky,
        canCompletePalaceofTwilight,
        canCompleteAllDungeons,
        CanCompleteFaronTwilight,
        canClearForest,
        CanCompleteEldinTwilight,
        CanCompleteLanayruTwilight,
        CanCompleteAllTwilight,
        HasBug,
        HasSwordOrBS,
        HasHeavyMod,
        HasCutsceneItem,
        CanDoLJA,
        CanDoJSLJA,
        CanDoMapGlitch,
        HasOneHandedItem,
        CanDoStorage,
        CanDoEBMoonBoots,
        CanDoHSMoonBoots,
        CanDoFlyGlitch,
        CanDoHiddenVillageGlitched,
        CanDoFTWindlessBridgeRoom,
        canClearForestGlitched,
        CanCompleteEldinTwilightGlitched,
        CanSkipKeyToDekuToad,
        CanGetBugWithLantern,
        // GetItemWheelSlotCount
    };
    return logicFunctions;
}
