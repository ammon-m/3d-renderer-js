import { Matrix } from "./Math3d.js"
import { Mesh, Transform } from "./Engine.js"

export class Renderer
{
    constructor()
    {
        
    }

    render(ctx, objects = [])
    {
        for(var i = 0; i < objects.length; i++)
        {
            this.drawMesh(ctx, objects[i])
        }
    }

    drawMesh(ctx, mesh)
    {
        ctx.fillStyle = '#ff0000'
        ctx.beginPath()

        for(var i = 0; i < mesh.vertices.length; i++)
        {
            const pos = mesh.vertices[i].position
            const mat = Matrix.identity
            mat._array[2][3] = 1
            mat._array[3][3] = 0

            const position = Matrix.multiplyToColumn(
                Matrix.multiply(mat, Matrix.multiply(mesh.transform.toMatrix4x4(), new Transform({position: pos}).toMatrix4x4())),
                [pos.x, pos.y, pos.z, 1]
            )

            if(i == 0)
                ctx.moveTo(position.x, position.y)

            ctx.lineTo(position.x, position.y)
        }

        ctx.closePath()
        ctx.fill()
    }
}
