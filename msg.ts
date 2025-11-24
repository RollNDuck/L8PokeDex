import { Schema as S } from "effect"
import { PokemonData } from "./model"

export type Msg = typeof Msg.Type
export const Msg = S.Union(
    S.TaggedStruct("MsgInput", { text: S.String }),
    S.TaggedStruct("MsgSearch", {}),
    S.TaggedStruct("MsgGotData", {
        list: S.Array(PokemonData),
    }),
    S.TaggedStruct("MsgError", {
        error: S.String,
    })
)

export const [MsgInput, MsgSearch, MsgGotData, MsgError] = Msg.members
