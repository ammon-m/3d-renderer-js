import { Mesh, Transform } from "./Engine.js"
import { Matrix, Vector3, clamp, degToRad } from "./Math3d.js"

export class Renderer
{
    worldMatrix = Matrix.identity
    cameraTransform = new Transform({})

    constructor()
    {
        this.worldMatrix = Matrix.identity
        this.cameraTransform = new Transform({})
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
        const path = ctx.beginPath()

        const n = 0.01
        const f = Math.max(n, 100)

        const perspectiveMatrix = new Matrix([
                [  n,    0,    0,    0  ],
                [  0,    n,    0,    0  ],
                [  0,    0,   f+n, -f*n ], // tysm youtuber Brendan Galea <3
                [  0,    0,    1,    0  ]
        ])

        const b = (n * 16)/9 * Math.tan(degToRad(90)/2)
        const r = 9/16 * b
        const n2 = n
        const f2 = f

        const fov = Math.tan(degToRad(90)/2)

        const w = ctx.canvas.width / 2
        const h = ctx.canvas.height / 2

        const orthoProjectionMatrix = new Matrix([ // tsym x2
                [w/(16/9 * fov),   0,          0,          0      ],
                [      0,        h/fov,        0,          0      ],
                [      0,          0,      1/(f2-n2), -n2/(f2-n2) ],
                [      0,          0,          0,          1      ]
        ])

        // const perspectiveProjectionMatrix = Matrix.multiply(orthoProjectionMatrix, perspectiveMatrix)
        const perspectiveProjectionMatrix = orthoProjectionMatrix

        const viewRotMat = new Transform({rotation: this.cameraTransform.rotation.reversed}).toMatrix()
        const viewPosMat = new Transform({rotation: this.cameraTransform.position.reversed}).toMatrix()

        const transformationMatrix = Matrix.multiply(perspectiveProjectionMatrix, Matrix.multiply(viewRotMat, Matrix.multiply(viewPosMat, Matrix.multiply(this.worldMatrix, mesh.transform.toMatrix()))))

        for(var i = 0; i < mesh.vertices.length; i++)
        {
            const pos = mesh.vertices[i].position
            const cpos = mesh.vertices[i].screenPosition

            const position = Matrix.multiplyToColumn(transformationMatrix, [pos.x, pos.y, clamp(pos.z, n, f), 1])

            cpos.x = position[0] * ctx.canvas.width*ctx.canvas.width
            cpos.y = position[1] * ctx.canvas.height*ctx.canvas.height

            if(i == 0)
                ctx.moveTo(cpos.x, cpos.y)

            ctx.lineTo(cpos.x, cpos.y)

            ctx.fillStyle = "#404040"
            ctx.fillText(`${Math.round(pos.x * 100)/100}, ${Math.round(pos.y * 100)/100}, ${Math.round(pos.z * 100)/100}`, cpos.x, cpos.y)

            ctx.fillStyle = "#111111"
            ctx.fill()

            ctx.fillStyle = `rgb(
                ${Math.min(255, cpos.x / (ctx.canvas.width + 8) * 255)},
                ${Math.min(255, cpos.y / (ctx.canvas.height + 8) * 255)},
                ${Math.min(255, position[2] * 255)}
            )`
            ctx.fillRect(cpos.x - 4, cpos.y - 4, 8, 8)
        }

        ctx.closePath()
    }
}
