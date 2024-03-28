import { Matrix, Vector2, Vector3, degToRad, mod } from "./Math3d.js";

export class Transform
{
    position;
    rotation;
    scale;

    /**
     * An object representing simple transformations in 3D space
     */
    constructor({position = Vector3.zero, rotation = Vector3.zero, scale = Vector3.one})
    {
        this.position = position
        this.rotation = new Vector3(mod(rotation.x + 180, 360) - 180, mod(rotation.y + 180, 360) - 180, mod(rotation.z + 180, 360) - 180)
        this.scale = scale
    }

    toMatrix()
    {
        const m = Matrix.Build({position: this.position, rotation: this.rotation, scale: this.scale})
        return m
    }

    /**
     * @TODO finish
     * @param {Vector3} rotationVector 
     */
    Rotate_(rotationVector)
    {
        // may need to mod() the angles
        const rx = degToRad(this.rotation.x), ry = degToRad(this.rotation.y), rz = degToRad(this.rotation.z);
        const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx), cz = Math.cos(rz), sz = Math.sin(rz);

        // the magic trig
        const axis = new Vector3(
            (cy*sx*cz + sy*sz) - (-sx),
            (sy*cx) - (cy*sx*sz - cz*sy),
            (cx*sz) - (sy*sx*cz - cy*sz)
        )
        const angle = Math.asin(axis.magnitude/2)
    }

    /**
     * @param {Vector3} rotVec xyz rotation in degrees
     */
    Rotate(rotVec)
    {
        this.rotation = new Vector3(
            mod(this.rotation.x + rotVec.x + 180, 360) - 180,
            mod(this.rotation.y + rotVec.y + 180, 360) - 180,
            mod(this.rotation.z + rotVec.z + 180, 360) - 180
        )
    }

    get rotationMatrix()
    {
        return Matrix.Build({position: Vector3.zero, rotation: this.rotation, scale: Vector3.one})
    }
}

/**
 * @overload
 * @param {...T} values
 * @returns {Array<T>}
 * 
 * @overload
 * @param {number} length
 * @returns {Array}
 */
export function FixedArray()
{
    const arr = Object.preventExtensions(Array.from(arguments))

    if(arr.length > 1)
        return arr
    else if(arr.length == 1)
        if(typeof arr[0] === "number" || typeof arr[0] === "bigint")
            return Object.preventExtensions(Array(Number(arr[0])))
}

export class Vertex
{
    position = Vector3.zero
    screenPosition = Vector2.zero

    constructor(position)
    {
        this.position = position
        this.screenPosition = new Vector2(position.x, position.y)
    }
}

export class Mesh
{
    /**
     * @param {Vertex[]} vertices 
     * @param {Transform} transform 
     * @param {string} color 
     */
    constructor(vertices, transform, color = "#ffffff")
    {
        this.vertices = vertices
        this.transform = transform
        this.color = color
    }
}
