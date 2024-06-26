import { Mesh, Transform } from "./Engine.js"
import { Matrix, Vector3, clamp, degToRad, mod } from "./Math3d.js"

export class Renderer
{
    worldMatrix = Matrix.identity
    cameraTransform = new Transform({})
    FOV = 90

    constructor()
    {
        this.worldMatrix = Matrix.identity
        this.cameraTransform = new Transform({})
        this.FOV = 90
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {Mesh[]} objects
     */
    render(ctx, objects)
    {
        const col = ctx.fillStyle

        for(var i = 0; i < objects.length; i++)
        {
            this.drawMesh(ctx, objects[i])
        }

        ctx.fillStyle = "#404040"
        const _rx = Math.round(this.cameraTransform.rotation.x * 100) / 100,
              _ry = Math.round(this.cameraTransform.rotation.y * 100) / 100,
              _rz = Math.round(this.cameraTransform.rotation.z * 100) / 100

        ctx.fillText(`${_rx}, ${_ry}, ${_rz}`, -ctx.canvas.width/2 + 10, -ctx.canvas.height/2 + 10)

        ctx.fillStyle = col
    }

    /**
     * @param {Matrix} matrix 
     */
    setWorldMatrix(matrix)
    {
        this.worldMatrix = matrix
    }

    /**
     * @param {Transform} transform 
     */
    setCameraTransform(transform)
    {
        this.cameraTransform = transform
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {Mesh} mesh
     */
    drawMesh(ctx, mesh)
    {
        switch(mesh.format)
        {
            case 0: this.drawMeshTriangleStrip(ctx, mesh); break;
            case 1: default: this.drawMeshTriangleList(ctx, mesh); break;
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {Mesh} mesh
     */
    drawMeshTriangleStrip(ctx, mesh)
    {
        ctx.beginPath()

        const n = 0.01
        const f = Math.max(n, 100)

        const fov = Math.tan(degToRad(this.FOV)/2)

        const perspectiveProjectionMatrix = new Matrix([ // tsym youtuber Brendan Galea <3
            [ 1/(16/9*fov),    0,          0,          0      ],
            [      0,        1/fov,        0,          0      ],
            [      0,          0,       f/(f-n), -(f*n)/(f-n) ],
            [      0,          0,          1,          0      ]
        ])

        const transformationMatrix = Matrix.multiply(
            perspectiveProjectionMatrix,
            Matrix.multiply(this.cameraTransform.toMatrix(),
                Matrix.multiply(this.worldMatrix, mesh.transform.toMatrix())
            )
        )

        for(var i = 0; i < mesh.vertices.length; i++)
        {
            const pos = mesh.vertices[i].position
            const cpos = mesh.vertices[i].screenPosition

            const position = Matrix.multiplyToColumn(transformationMatrix, [pos.x, pos.y, pos.z, n, f, 1])

            cpos.x = position[0] * ctx.canvas.width/2
            cpos.y = position[1] * ctx.canvas.height/2

            if(i == 0)
                ctx.moveTo(cpos.x, cpos.y)

            ctx.lineTo(cpos.x, cpos.y)

            ctx.fillStyle = "#404040"
            ctx.fillText(`${Math.round(pos.x * 100)/100}, ${Math.round(pos.y * 100)/100}, ${Math.round(pos.z * 100)/100}`, cpos.x, cpos.y)

            if(i > 1)
            {
                ctx.fillStyle = "#111111"
                ctx.fill()
            }

            ctx.fillStyle = `rgb(
                ${Math.min(255, cpos.x / (ctx.canvas.width + 8) * 255)},
                ${Math.min(255, cpos.y / (ctx.canvas.height + 8) * 255)},
                ${Math.min(255, position[2]/f * 255)}
            )`
            ctx.fillRect(cpos.x - 4, cpos.y - 4, 8, 8)
        }

        ctx.closePath()
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {Mesh} mesh
     */
    drawMeshTriangleList(ctx, mesh)
    {
        const n = 0.01
        const f = Math.max(n, 100)

        const fov = Math.tan(degToRad(this.FOV)/2)

        const perspectiveProjectionMatrix = new Matrix([ // tsym youtuber Brendan Galea <3
            [ 1/(16/9*fov),    0,          0,          0      ],
            [      0,        1/fov,        0,          0      ],
            [      0,          0,       f/(f-n), -(f*n)/(f-n) ],
            [      0,          0,          1,          0      ]
        ])

        const transformationMatrix = Matrix.multiply(
            perspectiveProjectionMatrix,
            Matrix.multiply(this.cameraTransform.toMatrix(),
                Matrix.multiply(this.worldMatrix, mesh.transform.toMatrix())
            )
        )

        let faceCol = ""

        for(var i = 0; i < mesh.vertices.length; i++)
        {
            const pos = mesh.vertices[i].position
            const cpos = mesh.vertices[i].screenPosition

            const position = Matrix.multiplyToColumn(transformationMatrix, [pos.x, pos.y, pos.z, 1])

            cpos.x = position[0] * ctx.canvas.width/2
            cpos.y = position[1] * ctx.canvas.height/2

            if(mod(i, 3) == 0)
            {
                ctx.beginPath()
                ctx.moveTo(cpos.x, cpos.y)
                faceCol = mesh.vertices[i].color
            }

            ctx.fillStyle = faceCol
            ctx.lineTo(cpos.x, cpos.y)

            if(mod(i, 3) == 2)
            {
                ctx.fill()
                ctx.closePath()
            }

            ctx.fillStyle = `rgb(
                ${Math.min(255, cpos.x / (ctx.canvas.width + 8) * 255)},
                ${Math.min(255, cpos.y / (ctx.canvas.height + 8) * 255)},
                ${Math.min(255, position[2]/f * 255)}
            )`
            ctx.fillRect(cpos.x - 4, cpos.y - 4, 8, 8)

            ctx.fillStyle = "#404040"
            ctx.fillText(`${Math.round(pos.x * 100)/100}, ${Math.round(pos.y * 100)/100}, ${Math.round(pos.z * 100)/100}`, cpos.x, cpos.y)
        }
    }
}
