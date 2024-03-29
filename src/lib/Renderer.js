import { Mesh, Transform } from "./Engine.js"
import { Matrix, Vector3, degToRad } from "./Math3d.js"

export class Renderer
{
    worldMatrix = Matrix.identity
    cameraMatrix = Matrix.identity

    constructor()
    {
        this.worldMatrix = Matrix.identity
        this.cameraMatrix = Matrix.identity
    }

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
     * @param {Matrix} matrix 
     */
    setWorldMatrix(matrix)
    {
        this.worldMatrix = matrix
    }

    /**
     * @param {Matrix} matrix 
     */
    setCameraMatrix(matrix)
    {
        this.cameraMatrix = matrix
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {Mesh} mesh
     */
    drawMesh(ctx, mesh)
    {
        const path = ctx.beginPath()
        const col = ctx.fillStyle

        for(var i = 0; i < mesh.vertices.length; i++)
        {
            const pos = mesh.vertices[i].position
            const cpos = mesh.vertices[i].screenPosition
            const mat = Matrix.identity
            mat._array[3][3] = 0
            mat._array[3][2] = 1

            const position = Matrix.multiplyToColumn(
                Matrix.multiply(mat,
                    Matrix.multiply(this.cameraMatrix,
                        Matrix.multiply(this.worldMatrix, mesh.transform.toMatrix()))),
                [pos.x, pos.y, pos.z, 1]
            )

            let w = 120/Math.max(position[2] * 90/360, 0.01)

            cpos.x = position[0] * w
            cpos.y = position[1] * w

            if(i == 0)
                ctx.moveTo(cpos.x, cpos.y)

            ctx.lineTo(cpos.x, cpos.y)

            ctx.fillStyle = "#111111"
            ctx.fill()

            ctx.fillStyle = `rgb(
                ${Math.min(255, cpos.x / (ctx.canvas.width + 8) * 255)},
                ${Math.min(255, cpos.y / (ctx.canvas.height + 8) * 255)},
                ${Math.min(255, 100/w * 255)}
            )`
            ctx.fillRect(cpos.x - 4, cpos.y - 4, 8, 8)
        }

        ctx.closePath()

        ctx.fillStyle = col
    }
}
