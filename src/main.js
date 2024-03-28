import { Mesh, Transform, Vertex } from "./lib/Engine.js";
import { Vector3 } from "./lib/Math3d.js";
import { Renderer } from "./lib/Renderer.js";

export let ticker = null

export const renderer = new Renderer()

const View = {
    padding: 4,
    width: 0,
    height: 0
}

let ctx = null

/**
* @param {HTMLCanvasElement} canvas
*/
export function main(canvas)
{
    ctx = canvas.getContext("2d")

    clearInterval(ticker)
    ticker = null

    canvas.height = Math.min(window.innerHeight - View.padding * 2, (window.innerWidth - View.padding * 2) * 9/16)
    canvas.width = canvas.height * 16/9

    View.width = canvas.width
    View.height = canvas.height

    ctx.setTransform(1, 0, 0, 1, View.width / 2, View.height / 2)

    window.addEventListener("resize", event => {
        canvas.height = Math.min(window.innerHeight - View.padding * 2, (window.innerWidth - View.padding * 2) * 9/16)
        canvas.width = canvas.height * 16/9

        View.width = canvas.width
        View.height = canvas.height

        ctx.setTransform(1, 0, 0, 1, View.width / 2, View.height / 2)
    }, true)

    ticker = setInterval(tick, 1/60 * 1000)

    return 1
}

function _resetCtx()
{
    ctx.reset()
    ctx.setTransform(1, 0, 0, 1, View.width / 2, View.height / 2)
}

let elapsedTime = 0

const sceneObjects = [
    new Mesh(
        [
            new Vertex(new Vector3(0, 0, 1)),
            new Vertex(new Vector3(1, 0, 1)),
            new Vertex(new Vector3(1, 0, 0)),
            new Vertex(new Vector3(0, 0, 0))
        ],
        new Transform({
            position: new Vector3(0.5, 0.5, 1),
            rotation: new Vector3(0, 0, 0),
            scale: new Vector3(1, 1, 1)
        })
    ),
    new Mesh(
        [
            new Vertex(new Vector3(0, 0, 1)),
            new Vertex(new Vector3(1, 0, 1)),
            new Vertex(new Vector3(1, 0, 0)),
            new Vertex(new Vector3(0, 0, 0))
        ],
        new Transform({
            position: new Vector3(0.5, 0.5, 1),
            rotation: new Vector3(0, 0, 90),
            scale: new Vector3(1, 1, 1)
        })
    ),
    new Mesh(
        [
            new Vertex(new Vector3(0, 0, 1)),
            new Vertex(new Vector3(1, 0, 1)),
            new Vertex(new Vector3(1, 0, 0)),
            new Vertex(new Vector3(0, 0, 0))
        ],
        new Transform({
            position: new Vector3(0.5, 0.5, 1),
            rotation: new Vector3(-90, 0, 0),
            scale: new Vector3(1, 1, 1)
        })
    )
]

export function tick()
{
    _resetCtx()

    const cubeFaces = [sceneObjects[0], sceneObjects[1], sceneObjects[2]]

    cubeFaces[0].transform.position.x = 0.5 + Math.cos((elapsedTime * Math.PI) / 120)
    cubeFaces[0].transform.position.y = 0.5 + Math.sin((elapsedTime * Math.PI) / 120)
    cubeFaces[1].transform.position.x = 0.5 + Math.cos((elapsedTime * Math.PI) / 120)
    cubeFaces[1].transform.position.y = 0.5 + Math.sin((elapsedTime * Math.PI) / 120)
    cubeFaces[2].transform.position.x = 0.5 + Math.cos((elapsedTime * Math.PI) / 120)
    cubeFaces[2].transform.position.y = 0.5 + Math.sin((elapsedTime * Math.PI) / 120)

    renderer.render(ctx, sceneObjects)

    elapsedTime++
}
