import { Matrix, Vector2, Vector3 } from "./Math3d.js";

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
        this.rotation = rotation
        this.scale = scale
    }

    toMatrix()
    {
        const m = Matrix.Build({position: this.position, rotation: this.rotation, scale: this.scale})
        return m
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
