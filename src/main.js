import { Mesh, Transform, Vertex } from "./lib/Engine.js";
import * as Math3d from "./lib/Math3d.js";
import { Vector3 } from "./lib/Math3d.js";
import { Renderer } from "./lib/Renderer.js"

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const View = {
    padding: 4,
    width: 0,
    height: 0
}

canvas.width = window.innerWidth - View.padding * 2
canvas.height = window.innerHeight - View.padding * 2

View.width = canvas.width
View.height = canvas.height

window.addEventListener("resize", event => {
    canvas.width = window.innerWidth - View.padding * 2
    canvas.height = window.innerHeight - View.padding * 2

    View.width = canvas.width
    View.height = canvas.height
}, true)

const renderer = new Renderer()

renderer.render(ctx, [
    new Mesh(
        [
            new Vertex(new Vector3(0, 0, 2)),
            new Vertex(new Vector3(1, 0, 2)),
            new Vertex(new Vector3(1, 1, 2))
        ],
        new Transform({})
    )
])
