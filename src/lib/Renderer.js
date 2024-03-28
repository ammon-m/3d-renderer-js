import { Mesh, Transform } from "./Engine.js"
import { Matrix, Vector3, degToRad } from "./Math3d.js"

export class Renderer
{
    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {Mesh[]} objects
    */
    render(ctx, objects)
    {
        for(var i = 0; i < objects.length; i++)
        {
            this.drawMesh(ctx, objects[i])
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {Mesh} mesh
    */
    drawMesh(ctx, mesh)
    {
        const path = ctx.beginPath()

        for(var i = 0; i < mesh.vertices.length; i++)
        {
            const pos = mesh.vertices[i].position
            const mat = Matrix.identity
            mat._array[3][3] = 0
            mat._array[2][3] = 1

            const position = Matrix.multiplyToColumn(
                Matrix.multiply(mat, mesh.transform.toMatrix4x4()),
                [pos.x, pos.y, pos.z, 1]
            )

            let w = 120/Math.max(position[2] * 90/360, 0.01)

            if(i == 0)
                ctx.moveTo(position[0] * w, position[1] * w)

            ctx.fillStyle = `rgb(
                ${Math.min(255, (position[0] * w + ctx.canvas.width/2)/ctx.canvas.width * 255)},
                ${Math.min(255, (position[1] * w + ctx.canvas.height/2)/ctx.canvas.width * 255)},
                ${Math.min(255, 100/w * 255)}
            )`

            ctx.fillRect(position[0] * w - 4, position[1] * w - 4, 8, 8)

            ctx.lineTo(position[0] * w, position[1] * w)
        }

        ctx.fillStyle = "#111111"

        ctx.closePath()
        ctx.fill()
    }
}

export const ViewMatrix = Matrix.identity
