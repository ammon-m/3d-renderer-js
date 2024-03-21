export function radToDeg(radians)
{
    return radians * (180/Math.PI);
}
export function degToRad(degrees)
{
    return degrees / (180/Math.PI);
}

export class Vector3
{
    /**
     * @description An object that represents a 3D position in space.
     * 
     * @overload
     * @param {number} x x value.
     * @param {number} y y value.
     * @param {number} z z value.
     * 
     * @overload
     * @param {number} x x value.
     * @param {number} y y and z value.
     * 
     * @overload
     * @param {number} x x, y, and z value.
     */
    constructor(x:number, y:number = null, z:number = null)
    {
        this.x = x
        this.z = (z === null ? (y === null ? x : y) : z)
        this.y = (y === null ? x : y)
    }

    /**
     * @description Creates a 2D Vector with a length and an angle.
     * 
     * @param {number} len magnitude of Vector.
     * @param {number} dir direction of Vector.
     * 
     * @returns {Vector3}
     */
    static fromLen(len, dir) {
        var v = new Vector3(Math.cos(degToRad(dir)) * len, Math.sin(degToRad(dir)) * len)
        v.magnitude = len
        v.angle = dir
        return v
    }

    /**
     * @description Shorthand for (0, 0, 0)
     */
    static get zero() {
        return new Vector3()
    }
    static set zero(value) {}

    /**
     * @description Shorthand for (0, 1, 0)
     */
    static get up() {
        return new Vector3(0, 1, 0)
    }
    static set up(value) {}

    /**
     * @description Shorthand for (0, -1, 0)
     */
    static get down() {
        return new Vector3(0, -1, 0)
    }
    static set down(value) {}

    /**
     * @description Shorthand for (1, 0, 0)
     */
    static get right() {
        return new Vector3(1, 0, 0)
    }
    static set right(value) {}

    /**
     * @description Shorthand for (-1, 0, 0)
     */
    static get left() {
        return new Vector3(-1, 0, 0)
    }
    static set left(value) {}

    /**
     * @description Shorthand for (0, 0, 1)
     */
    static get forward() {
        return new Vector3(0, 0, 1)
    }
    static set forward(value) {}

    /**
     * @description Shorthand for (0, 0, -1)
     */
    static get backward() {
        return new Vector3(0, 0, -1)
    }
    static set backward(value) {}

    /**
     * @overload
     * @description Returns the sum of two Vectors.
     * @param v2 Second Vector.
     */
    add(v2:Vector3) {
        return new Vector3(this.x + v2.x, this.y + v2.y, this.z + v2.z)
    }

    /**
     * @overload
     * @description Returns this vector with `value` added
     * @param value Value
     */
    add(value:number) {
        return new Vector3(this.x + value, this.y + value, this.z + value)
    }

    /**
     * @overload
     * @description Returns the difference of two Vectors.
     * @param v2 Second Vector.
     */
    sub(v2:Vector3) {
        return new Vector3(this.x - v2.x, this.y - v2.y, this.z - v2.z)
    }

    /**
     * @overload
     * @description Returns this vector with `value` subtracted
     * @param value Value
     */
    sub(value:number) {
        return new Vector3(this.x - value, this.y - value, this.z - value)
    }

    /**
     * @description Returns this vector muliplied by `value` 
     * @param value Value
     */
    mul(value:number) {
        return new Vector3(this.x * value, this.y * value, this.z * value)
    }

    /**
     * @description Returns this vector divided by `value` 
     * @param value Value
     */
    div(value:number) {
        return new Vector3(this.x / value, this.y / value, this.z / value)
    }

    /**
     * @description Returns the dot product of two Vectors.
     * @param {Vector3} v2 Second Vector.
     */
    dot(v2:Vector3) {
        return this.x * v2.x + this.y * v2.y + this.z * v2.z
    }

    /**
     * @description Returns the cross product of two Vectors.
     * @param {Vector3} v2 Second Vector.
     */
    cross(v2:Vector3) {
        return this.magnitude * v2.magnitude
    }

    /**
     * @description Returns a perfect clone of a Vector.
     * @param {Vector3} v - The Vector to copy.
     * @returns {Vector3}
     */
    static copy(v) {
        return new Vector3(v.x, v.y, v.z)
    }

    /**
     * @description Returns a new Vector with a length that is clamped between the min and max.
     * @param {Vector3} v The vector to be clamped.
     * @param {number} min Minimum length.
     * @param {number} max Maximum length.
     * @returns {Vector3}
     */
    static clampLength(v, min, max) {
        var r = Vector3.copy(v)
        var _min = Math.min(min, max)
        var _max = Math.max(min, max)
        var l = Math.min(Math.max(r.magnitude, _min), _max) / r.magnitude
        return new Vector3(v.x * l, v.y * l, v.z * l)
    }

    /**
     * @description Returns the distance between two vectors.
     * @param {Vector3} v1 First position.
     * @param {Vector3} v2 Second position.
     * @returns {number}
     */
    static distance(v1, v2) {
        return v1.add(v2.reversed()).magnitude
    }

    /**
     * @description Returns the angle pointing from one vector to another.
     * @param {Vector3} v1 First position.
     * @param {Vector3} v2 Second position.
     * @returns {number}
     */
    static direction(v1, v2) {
        return v1.add(v2.reversed()).angle
    }

    /**
     * @description Length of the Vector.
     * @type {number}
     */
    get magnitude() {
        return Math.sqrt(Vector3.dot(this, this))
    }
    set magnitude(val) {
        var n = this.normalized()
        this.x = n.x * val
        this.y = n.y * val
        this.z = n.z * val
    }

    /**
     * @description Direction (in degrees) of the Vector.
     * @type {number}
     */
    get angle() {
        return radToDeg(Math.atan(this.y / this.x))
    }
    set angle(val) {
        var v = Vector3.fromLen(this.magnitude, val)
        this.x = v.x
        this.y = v.y
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
     * @description Returns a copy of the Vector with the transformation `(x, y, z) => (-x, -y, -z)`
     * @returns {Vector3}
     */
    reversed() {
        return new Vector3(-this.x, -this.y, -this.z)
    }

    /**
     * @description Returns a copy of the Vector with a length of 1.
     * @returns {Vector3}
     */
    normalized() {
        var l = this.magnitude
        return new Vector3(this.x / l, this.y / l, this.z / l)
    }
}
