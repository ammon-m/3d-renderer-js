import * as Math3d from "./lib/Math3d.ts";

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

document.addEventListener("resize", event => {
    canvas.width = window.innerWidth - View.padding * 2
    canvas.height = window.innerHeight - View.padding * 2

    View.width = canvas.width
    View.height = canvas.height
})

let v1 = new Math3d.Vector3(1, 5, 2)
let v2 = new Math3d.Vector3(3, 4, 7)

console.log(v1 + v2)
