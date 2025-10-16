import { anyStringOf, anyCharOf, int, whitespace, string, noCharOf } from "parjs";
import { map, between, then, thenq, flatten, or, later, many, recover } from "parjs/combinators";
import type { Parjser } from "parjs";
import { getFunctions } from "../logic/logicFunctions";
import type { ItemState, CheckFn } from "../types/index";
import { Item } from "../types/index";
import type { Rooms, Settings } from "../types/index";

const sortedLongestToShortest = (xs: string[]):string[] => {
    return xs.sort((a, b) => b.length - a.length)
}

const checkItemInState = (i: Item, s: ItemState): boolean => {
    const x = Item[i] as keyof typeof Item;
    return (s.items[x] || 0) > 0;
}

const checkProgressiveItemInState = (i: Item, n: number, s: ItemState): boolean => {
    const x = Item[i] as keyof typeof Item;
    return (s.items[x] || 0) >= n;
}

const getParser = (settings: Settings, rooms: Rooms): Parjser<CheckFn> => {
    const allItemNames = Object.keys(Item).filter((item) => {
        return isNaN(Number(item));
    });

    const settingOps: {[opName: string]: ((a: string, b:string) => boolean)} = {
        "equals": (a, b) => a == b,
        "not_equal": (a, b) => a != b
    }

    function t<T>(parser: Parjser<T>): Parjser<T> {
        return parser.pipe(thenq(string(" ").pipe(many())));
    }

    const itemParser: Parjser<Item> = anyStringOf(...allItemNames).pipe(map(s => Item[s as keyof typeof Item])).expects("item name");
    const itemCheckParser: Parjser<CheckFn> = itemParser.pipe(map(i => state => checkItemInState(i, state)));
    const progressiveItemParser: Parjser<[Item, number]> = t(itemParser).pipe(
        then(t(anyCharOf(","))),
        then(t(int())),
        between("(", ")"),
        map(([[i, _], n]) => [i, n])
    );
    const progressiveItemCheckParser: Parjser<CheckFn> = progressiveItemParser
        .pipe(map(([i, n]) => state => checkProgressiveItemInState(i, n, state)))
    const parseCheck = later<CheckFn>();

    const parseParenthetical: Parjser<CheckFn> = parseCheck.pipe(between("(", ")"));

    const mapParser = <b>(m: ({[key: string]: b})) => anyStringOf(...sortedLongestToShortest(Object.keys(m))).pipe(map(key => m[key] as b));

    const settingOpParser: Parjser<(settingA: string, settingB: string) => boolean> = mapParser(settingOps)

    const aWord: Parjser<string> = noCharOf(" \n)").pipe(many(), map(n => n.join("")))

    const booleanLiteral: Parjser<CheckFn> = mapParser({"true": true, "false": false, "True": true, "False": false}).pipe(map(b => _ => b))

    const capitalizeBool = (b: any) => {
        if (b === true) return "True"
        if (b === false) return "False"
        return String(b)
    }

    const settingParser: Parjser<CheckFn> = string("Setting.").pipe(
        then(
            // t(mapParser(settings)),
            t(aWord).pipe(map(w => settings[w])),
            t(settingOpParser),
            aWord
        ),
        map(([_, lhs, settingOp, rhs]) => state => {
            // console.log("checking setting", lhs, rhs)
            return settingOp(capitalizeBool(lhs), rhs)
        })
    );

    const roomParser: Parjser<CheckFn> = string("Room.").pipe(
        then(anyStringOf(...sortedLongestToShortest(Object.keys(rooms).map(e => e.replaceAll(" ", "_"))))),
        map(([_, roomName]) => s => {
            // console.log(roomName.replaceAll("_", " "), s.openRooms)
            return s.openRooms.includes(roomName.replaceAll("_", " "))
        })
    )

    const logicFunctions = getFunctions(settings)

    const logicFunctionParser: Parjser<CheckFn> = mapParser(logicFunctions);

    const singularParser: Parjser<CheckFn> = t(itemCheckParser.pipe(or(
        booleanLiteral,
        settingParser,
        roomParser,
        logicFunctionParser,
        progressiveItemCheckParser.pipe(recover(_ => ({"kind": "Soft"}))),
        parseParenthetical
    )).expects("singular item"))

    const parseAnd2: Parjser<CheckFn> = singularParser.pipe(
        then(t(string("and")).pipe(then(singularParser), many())),
        map(([fa, fb]) => fb.reduce((fx, [_, fy]) => s => fx(s) && fy(s), fa))
    ).expects("and expression");

    const parseOr2 : Parjser<CheckFn> = parseAnd2.pipe(
        then(t(string("or")).pipe(then(parseAnd2), many())),
        map(([fa, fb]) => fb.reduce((fx, [_, fy]) => s => fx(s) || fy(s), fa))
    ).expects("or expression");

    parseCheck.init(whitespace().pipe(then(parseOr2), map(([_, f]) => f)));
    return parseCheck
}

export { getParser };
