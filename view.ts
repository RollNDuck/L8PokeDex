import { h } from "cs12251-mvu/src"
import { Array } from "effect"
import { Model, PokemonData } from "./model"
import { Msg, MsgInput, MsgSearch } from "./msg"

const viewPokemon = (pokemon: PokemonData) =>
    h(
        "div",
        {
            props: {
                style: "border: 1px solid; padding: 8px; border-radius: 8px;",
            },
        },
        [
            h("div", {
                props: {
                    style: "display: flex; align-items: center; gap: 0.5em;"
                }
            }, [
                h("img", {
                    props: {
                        src: pokemon.sprite,
                        alt: pokemon.pname,
                        style: "width: 96px; height: 96px;"
                    }
                }),

                h("div", [
                    h("h1", {
                        props: {
                            style: "font-family: 'Trebuchet MS'; font-weight: bold; font-size: 32px; margin: 5px 0;"
                        }
                    }, pokemon.pname),
                    h("code", pokemon.ptypes),
                    h("p", {
                        props: {
                            style: "font-family: 'Trebuchet MS'; font-size: 16px; margin: 3px 0;"
                        }
                    }, pokemon.heightText),
                    h("p", {
                        props: {
                            style: "font-family: 'Trebuchet MS'; font-size: 16px; margin: 3px 0;"
                        }
                    }, pokemon.weightText),
                ]),
            ]),
        ]
    )

export const view = (model: Model, dispatch: (msg: Msg) => void) => {
    console.log("Current model state:", model)

    return h("div", [
        h("div", {
            props: {
                style: "font-family: 'Courier New'; font-weight: bold; font-size: 18px; margin: 10px;"
            }
        }, [
            h("input", {
                props: {
                    type: "text",
                    value: model.input,
                    placeholder: "Pokemon"
                },
                on: {
                    input: (ev: Event) =>
                        dispatch(
                            MsgInput.make({
                                text: (ev.target as HTMLInputElement).value,
                            }),
                        ),
                },
            }),

            h(
                "button",
                {
                    on: {
                        click: () => dispatch(MsgSearch.make()),
                    },
                },
                "Search!",
            ),
        ]),

        model.isLoading
            ? h("div", "Loading...")
            : model.error.length > 0
            ? h("div", { props: { style: "color: red; font-weight: bold;" } }, model.error)
            : h(
                "div",
                {
                    props: {
                        style: "display: grid; grid-template-columns: repeat(4, 1fr); gap: 1em; margin-top: 20px;",
                    },
                },
                Array.map(model.pokemonList, viewPokemon)
            ),
    ])
}