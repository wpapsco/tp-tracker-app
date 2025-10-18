import type {Item} from "./item";

export interface Settings {
    // logicRules: string;
    // skipMdh: boolean;
    // skipPrologue: boolean;
    // smallKeySettings: string;
    // faronWoodsLogic: string;
    // faronTwilightCleared: boolean;
    // eldinTwilightCleared: boolean;
    // lanayruTwilightCleared: boolean;
    // bonksDoDamage: boolean;
    // damageMagnification: string;
    // startingItems: Item[];
    [settingName: string]: any
}



// export interface "settings" {
//     "logicRules": "Glitchless",
//     "castleRequirements": "Vanilla",
//     "palaceRequirements": "Vanilla",
//     "faronWoodsLogic": "Closed",
//     "shuffleGoldenBugs": false,
//     "shuffleSkyCharacters": false,
//     "shuffleNpcItems": false,
//     "shufflePoes": "Vanilla",
//     "shuffleShopItems": false,
//     "shuffleHiddenSkills": false,
//     "itemScarcity": "Vanilla",
//     "damageMagnification": "Vanilla",
//     "bonksDoDamage": false,
//     "shuffleRewards": false,
//     "smallKeySettings": "Vanilla",
//     "bigKeySettings": "Vanilla",
//     "mapAndCompassSettings": "Vanilla",
//     "skipPrologue": false,
//     "faronTwilightCleared": false,
//     "eldinTwilightCleared": false,
//     "lanayruTwilightCleared": false,
//     "skipMdh": false,
//     "skipMinorCutscenes": false,
//     "skipMajorCutscenes": false,
//     "fastIronBoots": false,
//     "quickTransform": false,
//     "transformAnywhere": false,
//     "increaseWallet": false,
//     "modifyShopModels": false,
//     "trapFrequency": "None",
//     "barrenDungeons": false,
//     "goronMinesEntrance": "Closed",
//     "skipLakebedEntrance": false,
//     "skipArbitersEntrance": false,
//     "skipSnowpeakEntrance": false,
//     "totEntrance": "Closed",
//     "skipCityEntrance": false,
//     "instantText": false,
//     "openMap": false,
//     "increaseSpinnerSpeed": false,
//     "openDot": false,
//     "noSmallKeysOnBosses": false,
//     "startingToD": "Noon",
//     "hintDistribution": "Balanced",
//     "startingItems": [],
//     "excludedChecks": []
//   },


export interface Checklist {
    [region: string]: {
        [room: string]: {
            [checkName: string]: {
                available: boolean,
                checked: boolean,
                category: string[]
            }
        }
    }
}

export interface SpoilerLog {
    settings: Settings;
    itemPlacements: {
        [checkName: string]: Item
    }
}
