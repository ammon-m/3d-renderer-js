export function radToDeg(radians)
{
    return Number(radians) * (180/Math.PI);
}
export function degToRad(degrees)
{
    return Number(degrees) / (180/Math.PI);
}

export class Vector3
{
    /**
     * An object that represents a 3D position in space.
     * 
     * @overload
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * 
     * @overload
     * @param {number} x
     * @param {number} y
     * 
     * @overload
     * @param {number} x
     */
    constructor(x, y, z) {
        this.x = x;
        this.y = y === undefined ? x : y;
        this.z = z === undefined ? (y === undefined ? x : 0) : z;
    }

    /**
     * Shorthand for (0, 0, 0)
     */
    static get zero() {return new Vector3(0, 0, 0)}

    /**
     * Shorthand for (0, 1, 0)
     */
    static get up() {return new Vector3(0, 1, 0)}

    /**
     * Shorthand for (0, -1, 0)
     */
    static get down() {return new Vector3(0, -1, 0)}

    /**
     * Shorthand for (1, 0, 0)
     */
    static get right() {return new Vector3(1, 0, 0)}

    /**
     * Shorthand for (-1, 0, 0)
     */
    static get left() {return new Vector3(-1, 0, 0)}

    /**
     * Shorthand for (0, 0, 1)
     */
    static get forward() {return new Vector3(0, 0, 0)}

    /**
     * Shorthand for (0, 0, -1)
     */
    static get backward() {return new Vector3(0, 0, 0)}

    /**
     * Returns the sum of two Vectors or a Vector and a number.
     * @overload
     * @param {number} value
     * @overload
     * @param {Vector3} value
     */
    add(value) {
        if(value instanceof Vector3)
            return new Vector3(this.x + value.x, this.y + value.y, this.z + value.z)
        else if(typeof value === "number")
            return new Vector3(this.x + value, this.y + value, this.z + value)
        else
            throw new TypeError(`Cannot parse operands of 'Vector3' and '${typeof value}'`)
    }

    /**
     * Returns the difference of two Vectors or a Vector and a number.
     * @overload
     * @param {number} value
     * @overload
     * @param {Vector3} value
     */
    sub(value) {
        if(value instanceof Vector3)
            return new Vector3(this.x - value.x, this.y - value.y, this.z - value.z)
        else if(typeof value === "number")
            return new Vector3(this.x + value, this.y + value, this.z + value)
        else
            throw new TypeError(`Cannot parse operands of 'Vector3' and '${typeof value}'`)
    }

    /**
     * Returns the product of a Vector and value.
     * @param {number} value
     */
    mul(value) {
        return new Vector3(this.x * value, this.y * value, this.z * value)
    }

    /**
     * Returns the quotient of a Vector and value.
     * @param {number} value
     */
    div(value) {
        return new Vector3(this.x / value, this.y / value, this.z / value)
    }

    /**
     * Returns the dot product of two Vectors.
     * @param {Vector3} value
     */
    dot(value) {
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
     * @param {Vector3} vec1
     * @param {Vector3} vec2
     */
    static distance(vec1, vec2) {
        return vec1.add(vec2.reversed).magnitude
    }

    /**
     * Length of the Vector.
     */
    get magnitude() {
        return Math.sqrt(this.dot(this, this))
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
    get reversed() {
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
