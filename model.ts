import { Schema as S } from "effect"

// Pokemon data structure
export type PokemonData = typeof PokemonData.Type
export const PokemonData = S.Struct({
    id: S.Number,
    sprite: S.String,
    pname: S.String,
    ptypes: S.String,
    heightText: S.String,
    weightText: S.String,
})

// Model
export type Model = typeof Model.Type
export const Model = S.Struct({
    input: S.String,
    isLoading: S.Boolean,
    error: S.String,
    pokemonList: S.Array(PokemonData),
})

export const initModel: Model = Model.make({
    input: "",
    isLoading: false,
    error: "",
    pokemonList: [],
})
