export function radToDeg(radians: number)
{
    return radians * (180/Math.PI);
}
export function degToRad(degrees: number)
{
    return degrees / (180/Math.PI);
}

export class Vector3
{
    /**
     * An object that represents a 3D position in space.
     */
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y === undefined ? x : y;
        this.z = z === undefined ? (y === undefined ? x : 0) : z;
    }

    /**
     * Shorthand for (0, 0, 0)
     */
    static readonly zero = new Vector3(0, 0, 0)

    /**
     * Shorthand for (0, 1, 0)
     */
    static readonly up = new Vector3(0, 1, 0)

    /**
     * Shorthand for (0, -1, 0)
     */
    static readonly down = new Vector3(0, -1, 0)

    /**
     * Shorthand for (1, 0, 0)
     */
    static readonly right = new Vector3(1, 0, 0)

    /**
     * Shorthand for (-1, 0, 0)
     */
    static readonly left = new Vector3(-1, 0, 0)

    /**
     * Shorthand for (0, 0, 1)
     */
    static readonly forward = new Vector3(0, 0, 1)

    /**
     * Shorthand for (0, 0, -1)
     */
    static readonly backward = new Vector3(0, 0, -1)

    /**
     * Returns the sum of two Vectors or a Vector and a number.
     */
    add(value: Vector3 | number) {
        if(value instanceof Vector3)
            return new Vector3(this.x + value.x, this.y + value.y, this.z + value.z)
        else if(typeof value === "number")
            return new Vector3(this.x + value, this.y + value, this.z + value)
        else
            throw new TypeError(`Cannot parse operands of 'Vector3' and '${typeof value}'`)
    }

    /**
     * Returns the difference of two Vectors or a Vector and a number.
     */
    sub(value: Vector3 | number) {
        if(value instanceof Vector3)
            return new Vector3(this.x - value.x, this.y - value.y, this.z - value.z)
        else if(typeof value === "number")
            return new Vector3(this.x + value, this.y + value, this.z + value)
        else
            throw new TypeError(`Cannot parse operands of 'Vector3' and '${typeof value}'`)
    }

    /**
     * Returns the product of a Vector and value.
     */
    mul(value: number) {
        return new Vector3(this.x * value, this.y * value, this.z * value)
    }

    /**
     * Returns the quotient of a Vector and value.
     */
    div(value: number) {
        return new Vector3(this.x / value, this.y / value, this.z / value)
    }

    /**
     * Returns the dot product of two Vectors.
     */
    dot(value: Vector3) {
        return this.x * value.x + this.y * value.y + this.z * value.z
    }

    /**
     * Returns a perfect clone of a Vector.
     */
    clone() {
        return new Vector3(this.x, this.y, this.z)
    }

    /**
     * Returns the distance between two vectors.
     */
    static distance(vec1: Vector3, vec2: Vector3) {
        return vec1.add(vec2.reversed()).magnitude
    }

    /**
     * Length of the Vector.
     * @type {number}
     */
    get magnitude() {
        return Math.sqrt(this.dot(this, this))
    }
    set magnitude(val) {
        var n = this.normalized
        this.x = n.x * val
        this.y = n.y * val
        this.z = n.z * val
    }

    /**
     * @returns `"(x, y, z)"`
     */
    toString() {
        return `(${this.x}, ${this.y}, ${this.z})`
    }

    /**
     * @returns `[x, y, z]`
     */
    toArray() {
        return [this.x, this.y, this.z]
    }

    /**
     * Returns a copy of the Vector with the transformation `(x, y, z) => (-x, -y, -z)`
     */
    reversed() {
        return new Vector3(-this.x, -this.y, -this.z)
    }

    /**
     * Returns a copy of the Vector with a length of 1.
     */
    get normalized() {
        var l = this.magnitude
        if(l != 0)
            return new Vector3(this.x / l, this.y / l, this.z / l)
        else
            return Vector3.zero;
    }

    /**
     * Normalizes the vector.
     */
    normalize() {
        var l = this.magnitude
        this.x /= l
        this.y /= l
        this.z /= l
    }
}
