import { Mesh, Transform, Vertex } from "./lib/Engine.js";
import { KeyboardListener } from "./lib/Input.js";
import { Vector2, Vector3, clamp } from "./lib/Math3d.js";
import { Renderer } from "./lib/Renderer.js";

export let ticker = null
export let drawTicker = null

export const renderer = new Renderer()

let mouseLocked = false
let mouseSensitivity = 0.15

const View = {
    padding: 4,
    width: 0,
    height: 0
}

const Keyboard = {
    space: new KeyboardListener(32),
    // z: new KeyboardListener(90),
    // x: new KeyboardListener(88),
    w: new KeyboardListener(87),
    a: new KeyboardListener(65),
    s: new KeyboardListener(83),
    d: new KeyboardListener(68),
}

let ctx = null

const cameraTransform = new Transform({
    position: Vector3.zero,
    rotation: Vector3.zero,
    scale: new Vector3(1, 1, 1)
})
const cameraVelocity = Vector3.zero
let cameraPitch = 0
let cameraYaw = 0

/**
* @param {HTMLCanvasElement} canvas
*/
export function main(canvas)
{
    ctx = canvas.getContext("2d")

    clearInterval(ticker)
    ticker = null
    clearInterval(drawTicker)
    drawTicker = null

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

    window.addEventListener("mousemove", event => {
        if(!mouseLocked)
            return;

        const delta = new Vector2(event.movementX, event.movementY)

        cameraPitch += delta.y * mouseSensitivity
        cameraPitch = clamp(cameraPitch, -90, 90)

        cameraTransform.rotation.x = cameraPitch
        cameraTransform.Rotate(Vector3.up.mul(delta.x * mouseSensitivity))
    })

    canvas.addEventListener("click", event => {
        mouseLocked = !mouseLocked
        event.preventDefault();
    }, true)

    ticker = setInterval(update, 1/60 * 1000) // 1/60s = ~16.67ms
    drawTicker = setInterval(draw, 10/1000) // supposedly chrome's limit is 10ms

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

export function update()
{
    const cubeFaces = [sceneObjects[0], sceneObjects[1], sceneObjects[2]]

    cubeFaces[0].transform.position.x = 0.5 + Math.cos((elapsedTime / 120) * Math.PI)
    cubeFaces[0].transform.position.y = 0.5 + Math.sin((elapsedTime / 120) * Math.PI)

    cubeFaces[1].transform.position.x = 0.5 + Math.cos((elapsedTime / 120) * Math.PI)
    cubeFaces[1].transform.position.y = 0.5 + Math.sin((elapsedTime / 120) * Math.PI)

    cubeFaces[2].transform.position.x = 0.5 + Math.cos((elapsedTime / 120) * Math.PI)
    cubeFaces[2].transform.position.y = 0.5 + Math.sin((elapsedTime / 120) * Math.PI)

    cameraTransform.position.add(cameraVelocity)

    for(let key in Keyboard)
    {
        Keyboard[key].pressed = 0
        Keyboard[key].released = 0
    }

    elapsedTime++
}

export function draw()
{
    _resetCtx()

    /**
     * @TODO finish this
     */
    renderer.setCameraMatrix(cameraTransform.toMatrix())

    renderer.render(ctx, sceneObjects)
}
