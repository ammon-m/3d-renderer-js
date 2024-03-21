import * as Math3d from "./lib/Math3d.js";

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
