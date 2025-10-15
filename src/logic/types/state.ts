import type { Item } from './item';

export interface ItemState {
    items: { -readonly [key in keyof typeof Item]?: number }
    openRooms: string[]
}

export type CheckFn = (state: ItemState) => boolean;
