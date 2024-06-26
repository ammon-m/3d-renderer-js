import { Mesh, Transform, Vertex, VerticesFaces } from "./lib/Engine.js";
import { KeyboardListener } from "./lib/Input.js";
import { Vector2, Vector3, clamp } from "./lib/Math3d.js";
import { Renderer } from "./lib/Renderer.js";
import RendererGL from "./lib/RendererGL.js";
import { Enum } from "./lib/util.js";

export let ticker = null
export let drawTicker = null

export const renderer = new Renderer()
/** @type {RendererGL} */
export let renderer3D = null

const RendererMode = Enum({
    Canvas2D: 0,
    WebGL: 1
})
let mode = RendererMode.WebGL

let mouseLocked = false
let mouseSensitivity = 0.2

export const View = {
    padding: 4,
    width: 0,
    height: 0
}

const Keyboard = {
    space: new KeyboardListener(32),
    w: new KeyboardListener(87),
    a: new KeyboardListener(65),
    s: new KeyboardListener(83),
    d: new KeyboardListener(68),
}

/**
 * @type {CanvasRenderingContext2D}
 */
let ctx = null
/**
 * @type {WebGL2RenderingContext}
 */
let gl = null

const cameraTransform = new Transform({
    position: Vector3.zero,
    rotation: Vector3.zero,
    scale: Vector3.one
})
const cameraVelocity = Vector3.zero
let cameraPitch = 0
let cameraYaw = 0

/**
 * @param {HTMLCanvasElement} canvas
 */
export function main(canvas)
{
    clearInterval(ticker)
    ticker = null
    clearInterval(drawTicker)
    drawTicker = null

    canvas.height = Math.round(Math.min(window.innerHeight - View.padding * 2, (window.innerWidth - View.padding * 2) * 9/16))
    canvas.width = Math.round(canvas.height * 16/9)

    View.width = canvas.width
    View.height = canvas.height

    window.addEventListener("resize", event => {
        canvas.height = Math.round(Math.min(window.innerHeight - View.padding * 2, (window.innerWidth - View.padding * 2) * 9/16))
        canvas.width = Math.round(canvas.height * 16/9)

        View.width = canvas.width
        View.height = canvas.height

        if(mode == RendererMode.Canvas2D)
            ctx.setTransform(1, 0, 0, 1, View.width/2, View.height/2)
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

    switch(mode)
    {
        case RendererMode.Canvas2D: default:
        {
            ctx = canvas.getContext("2d")
            ctx.setTransform(1, 0, 0, 1, View.width/2, View.height/2)
            break;
        }
        case RendererMode.WebGL:
        {
            gl = canvas.getContext("webgl2")

            if(!gl)
            {
                console.error(new Error("WebGL2 is unavailable! switching to Canvas2D"))
                ctx = canvas.getContext("2d")
                ctx.setTransform(1, 0, 0, 1, View.width/2, View.height/2)
                return 3
            }

            ctx = gl

            renderer3D = new RendererGL(gl)
            break;
        }
    }
    return 1
}

function _resetCtx()
{
    switch(mode)
    {
        case RendererMode.Canvas2D: default:
        {
            ctx.reset()
            ctx.setTransform(1, 0, 0, 1, View.width / 2, View.height / 2)
            break;
        }
        case RendererMode.WebGL:
        {
            gl.clearColor(0, 0, 0, 0)
            gl.clear(gl.COLOR_BUFFER_BIT);
            break;
        }
    }
}

let elapsedTime = 0

const sceneObjects = [
    new Mesh(1,
    VerticesFaces(
        [
            [-0.5, -0.5, -0.5 ],
            [-0.5,  0.5, -0.5 ],
            [ 0.5,  0.5, -0.5 ],
            [ 0.5, -0.5, -0.5 ],
            [-0.5, -0.5,  0.5 ],
            [-0.5,  0.5,  0.5 ],
            [ 0.5,  0.5,  0.5 ],
            [ 0.5, -0.5,  0.5 ]
        ],
        [
            [3, 7, 8],
            [3, 8, 4],
            [1, 5, 6],
            [1, 6, 2],
            [7, 3, 2],
            [7, 2, 6],
            [4, 8, 5],
            [4, 5, 1],
            [8, 7, 6],
            [8, 6, 5],
            [3, 4, 1],
            [3, 1, 2]
        ]
    ),
    new Transform({
        position: new Vector3(0.5, 0.5, 1),
        rotation: Vector3.zero,
        scale: Vector3.one
    }))
]

export function update()
{
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

    switch(mode)
    {
        case RendererMode.Canvas2D: default:
        {
            renderer.setCameraTransform(cameraTransform)
            renderer.FOV = 100

            renderer.render(ctx, sceneObjects)
            break;
        }
        case RendererMode.WebGL:
        {
            renderer3D.main()
            break;
        }
    }
}
