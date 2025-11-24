import { Cmd } from "cs12251-mvu/src"
import { Match, Array, Order, Number } from "effect"
import { Msg, MsgGotData, MsgError } from "./msg"
import { Model, PokemonData } from "./model"

const apiRoot = "https://pokeapi.upd-dcs.work/api/v2/"

const capitalize = (str: string): string => {
    if (str.length === 0) return str
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export const update = (msg: Msg, model: Model) =>
    Match.value(msg).pipe(
        Match.tag("MsgInput", ({ text }) =>
            Model.make({
                ...model,
                input: text,
            }),
        ),

        Match.tag("MsgSearch", () => {
            const searchInput = model.input.toLowerCase().trim()

            return {
                model: Model.make({
                    ...model,
                    isLoading: true,
                    error: "",
                    pokemonList: [],
                }),
                cmd: Cmd.ofSub(async (dispatch: (msg: Msg) => void) => {
                    try {
                        const genResp = await fetch(apiRoot + "generation/1")
                        const genData = await genResp.json()

                        const allSpecies = genData.pokemon_species
                        const matchingSpecies = Array.filter(allSpecies, (species: any) =>
                            species.name.toLowerCase().startsWith(searchInput)
                        )

                        if (Array.length(matchingSpecies) === 0 && searchInput !== "") {
                            dispatch(
                                MsgGotData.make({
                                    list: [],
                                })
                            )
                            return
                        }

                        const promises = Array.map(matchingSpecies, (species: any) => {
                            const urlParts = species.url.split("/")
                            const filtered = Array.filter(urlParts, (part: string) => part !== "")
                            const lastPart = Array.reduce(filtered, "", (acc: string, cur: string) => cur)
                            const id = parseInt(lastPart, 10)

                            return fetch(apiRoot + "pokemon/" + id).then((resp) => {
                                return resp.json()
                            })
                        })

                        const allData = await Promise.all(promises)

                        const processedList = Array.map(allData, (data: any) => {
                            const typesList = Array.map(data.types, (t: any) => capitalize(t.type.name))
                            const typesString = Array.join(typesList, " | ")

                            const heightMeters = data.height / 10
                            const weightKg = data.weight / 10

                            return PokemonData.make({
                                id: data.id,
                                sprite: data.sprites.front_default,
                                pname: capitalize(data.name),
                                ptypes: typesString,
                                heightText: `Height: ${heightMeters} m`,
                                weightText: `Weight: ${weightKg} kg`,
                            })
                        })

                        const sorted = Array.sort(
                            processedList,
                            Order.mapInput(Number.Order, (pokemon: typeof PokemonData.Type) => pokemon.id)
                        )

                        dispatch(
                            MsgGotData.make({
                                list: sorted,
                            })
                        )
                    } catch (e) {
                        console.log("Error caught:", e)
                        dispatch(
                            MsgError.make({
                                error: "Failed to fetch data",
                            })
                        )
                    }
                }),
            }
        }),

        Match.tag("MsgGotData", ({ list }) =>
            Model.make({
                ...model,
                isLoading: false,
                pokemonList: list,
            }),
        ),

        Match.tag("MsgError", ({ error }) =>
            Model.make({
                ...model,
                isLoading: false,
                error: error,
            }),
        ),

        Match.exhaustive,
    )
