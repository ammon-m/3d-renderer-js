import { Vector3, Matrix } from "./Math3d";

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

    toMatrix4x4()
    {
        return Matrix.Build({position: this.position, rotation: this.rotation, scale: this.scale})
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
    constructor(position)
    {
        this.position = position
    }
}

export class Mesh
{
    constructor(vertices, color = "#ffffff")
    {
        this.vertices = vertices
        this.color = color
    }
}
