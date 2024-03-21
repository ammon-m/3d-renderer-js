export class Vector2
{
    /**
     * @constructor
     * An object that represents a 2D position in space.
     * 
     * @overload
     * @param {number} x x value.
     * @param {number} y y value.
     * @returns {Vector2} (x, y)
     * 
     * @overload
     * @param {number} x x and y value.
     * @returns {Vector2} (x, x)
     * 
     * @overload
     * @returns {Vector2} (0, 0)
     */
    constructor(x = 0, y = null)
    {
        this.x = x
        this.y = (y === null ? x : y)
    }

    /**
     * Creates a Vector with a length and an angle.
     * 
     * @param {number} len magnitude of Vector.
     * @param {number} dir direction of Vector.
     * 
     * @returns {Vector2}
     */
    static fromLen(len, dir) {
        var v = new Vector2() // new Vec2(Math.cos(degToRad(dir)) * len, Math.sin(degToRad(dir)) * len)
        v.magnitude = len
        v.angle = dir
        return v
    }

    /**
     * Shorthand for (0, 0)
     */
    static get zero() {
        return new Vector2(0, 0)
    }
    static set zero(value) {}

    /**
     * Returns the summed Vector of two Vectors.
     * @param {Vector2} v1 First Vector.
     * @param {Vector2} v2 Second Vector.
     * @returns {Vector2}
     */
    static add(v1, v2) {
        return new Vector2(v1.x + v2.x, v1.y + v2.y)
    }

    /**
     * Returns the dot product of two Vectors.
     * @param {Vector2} v1 First Vector.
     * @param {Vector2} v2 Second Vector.
     * @returns {number}
     */
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y
    }

    /**
     * Returns a perfect clone of a Vector.
     * @param {Vector2} v - The Vector to copy.
     * @returns {Vector2}
     */
    static copy(v) {
        return Object.assign(new Vector2(), v)
    }

    /**
     * Returns a new Vector with a length that is clamped between the min and max.
     * @param {Vector2} v The vector to be clamped.
     * @param {number} min Minimum length.
     * @param {number} max Maximum length.
     * @returns {Vector2}
     */
    static clampLength(v, min, max) {
        var r = Vector2.copy(v)
        var _min = Math.min(min, max)
        var _max = Math.max(min, max)
        var l = Math.min(Math.max(r.magnitude, _min), _max) / r.magnitude
        return new Vector2(v.x * l, v.y * l)
    }

    /**
     * Returns the distance between two vectors.
     * @param {Vector2} v1 First position.
     * @param {Vector2} v2 Second position.
     * @returns {number}
     */
    static distance(v1, v2) {
        return Vector2.add(v1, v2.reversed()).magnitude
    }

    /**
     * Returns the angle pointing from one vector to another.
     * @param {Vector2} v1 First position.
     * @param {Vector2} v2 Second position.
     * @returns {number}
     */
    static direction(v1, v2) {
        return Vector2.add(v1, v2.reversed()).angle
    }

    /**
     * Length of the Vector.
     * @type {number}
     */
    get magnitude() {
        return Math.sqrt(this.x*this.x + this.y*this.y)
    }
    set magnitude(val) {
        var n = this.normalized()
        this.x = n.x * val
        this.y = n.y * val
    }

    /**
     * Direction (in degrees) of the Vector.
     * @type {number}
     */
    get angle() {
        return Util.radToDeg(Math.atan(this.y / this.x))
    }
    set angle(val) {
        var v = Vector2.fromLen(this.magnitude, val)
        this.x = v.x
        this.y = v.y
    }

    /**
     * @returns {"(x: number, y: number)"}
     */
    toString() {
        return `(x: ${this.x}, y: ${this.y})`
    }

    /**
     * @returns {[x, y]}
     */
    toArray() {
        return [this.x, this.y]
    }

    /**
     * Returns a copy of the Vector with the following transformation applied: (x, y) => (-x, -y)
     * @returns {Vector2}
     */
    reversed() {
        return new Vector2(-this.x, -this.y)
    }

    /**
     * Returns a copy of the Vector with a length of 1.
     * @returns {Vector2}
     */
    normalized() {
        var l = this.magnitude
        return new Vector2(this.x / l, this.y / l)
    }
}
