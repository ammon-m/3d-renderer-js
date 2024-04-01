export function radToDeg(radians)
{
    return Number(radians) * (180/Math.PI);
}
export function degToRad(degrees)
{
    return Number(degrees) / (180/Math.PI);
}

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
export function clamp(value, min, max)
{
    return Math.min(Math.max(value, min), max)
}

/**
 * @template T
 * @param {number} n
 * @param {(i:number) => T} expr
 * 
 * @returns {T}
 */
export function summate(n, expr)
{
    let sum = undefined
    for(var i = 0; i < n; i++)
    {
        if(i == 0)
            sum = expr(i)
        else
            sum += expr(i)
    }
    return sum
}

export function mod(x, n)
{
    return ((x % n) + n) % n
}

export class Vector3
{
    x = 0
    y = 0
    z = 0

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
     * Shorthand for (1, 1, 1)
     * 
     * it is NOT normalized; the length is the square root of 3
     */
    static get one() {return new Vector3(0, 0, 0)}

    /**
     * Shorthand for (0, 1, 0)
     */
    static get down() {return new Vector3(0, 1, 0)}

    /**
     * Shorthand for (0, -1, 0)
     */
    static get up() {return new Vector3(0, -1, 0)}

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
            return new Vector3(this.x - value, this.y - value, this.z - value)
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

    /**
     * @param {Vector3} vector
     */
    equals(vector)
    {
        return (this.x == vector.x && this.y == vector.y && this.z == vector.z)
    }
}

export class Matrix
{
    _array = Object.preventExtensions([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]])

    constructor(array)
    {
        if(array !== undefined && array.length == 4)
        {
            if(typeof array[0] === "object" && array[0].length == 4)
            {
                this._array = Object.preventExtensions(array)
            }
        }
    }

    static Build({position = Vector3.zero, rotation = Vector3.zero, scale = Vector3.one})
    {
        // initialize with identity matrix
        const scaleMat = Matrix.identity, posMat = Matrix.identity
        scaleMat._array = Object.preventExtensions([
            [scale.x, 0, 0, 0],
            [0, scale.y, 0, 0],
            [0, 0, scale.z, 0],
            [0, 0, 0, 1]
        ])
        posMat._array = Object.preventExtensions([
            [1, 0, 0, position.x],
            [0, 1, 0, position.y],
            [0, 0, 1, position.z],
            [0, 0, 0, 1]
        ])

        const rx = degToRad(rotation.x), ry = degToRad(rotation.y), rz = degToRad(rotation.z);
        const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry), cz = Math.cos(rz), sz = Math.sin(rz);

        const rotMat = new Matrix([
            [      cy*cz,           -cy*sz,        sy,   0],
            [cx*sz + cz*sx*sy, cx*cz - sx*sy*sz, -cy*sx, 0],
            [sx*sz - cx*cz*sy, cz*sy + cx*sy*sz,  cx*cy, 0],
            [        0,                0,           0,   1]
        ])

        const mat = Matrix.multiply(scaleMat, Matrix.multiply(rotMat, posMat))
        return mat
    }

    get height()
    {
        return this._array.length
    }
    get width()
    {
        return this._array[0].length
    }

    trace(wh = 4)
    {
        return summate(clamp(wh, 1, 4), i => {
            return this._array[i][i]
        })
    }

    static get identity()
    {
        return new Matrix([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ])
    }

    static multiply(matrixA, matrixB)
    {
        const newMatrix = Matrix.identity
        const arr = newMatrix._array
        const a = matrixA._array
        const b = matrixB._array
        for(var i = 0; i < 4; i++)
        {
            for(var j = 0; j < 4; j++)
            {
                arr[i][j] = a[i][0] * b[0][j] + a[i][1] * b[1][j] + a[i][2] * b[2][j] + a[i][3] * b[3][j]
            }
        }
        return newMatrix;
    }

    /**
     * @param {Matrix} matrix 
     * @param {number[]} column 
     * @returns 
     */
    static multiplyToColumn(matrix, column)
    {
        const arr = [0, 0, 0, 0]
        const a = matrix._array
        const b = column
        for(var i = 0; i < 4; i++)
        {
            arr[i] = (a[i][0] * b[0] + a[i][1] * b[1] + a[i][2] * b[2] + a[i][3] * b[3])
        }
        return arr;
    }

    toString(s = " ")
    {
        return (
            `${this._array[0][0]}${s}${this._array[0][1]}${s}${this._array[0][2]}${s}${this._array[0][3]}` + "\n" +
            `${this._array[1][0]}${s}${this._array[1][1]}${s}${this._array[1][2]}${s}${this._array[1][3]}` + "\n" +
            `${this._array[2][0]}${s}${this._array[2][1]}${s}${this._array[2][2]}${s}${this._array[2][3]}` + "\n" +
            `${this._array[3][0]}${s}${this._array[3][1]}${s}${this._array[3][2]}${s}${this._array[3][3]}`
        )
    }

    get m11() {return this._array[0][0]} set m11(x) {this._array[0][0] = x}
    get m12() {return this._array[0][1]} set m12(x) {this._array[0][1] = x}
    get m13() {return this._array[0][2]} set m13(x) {this._array[0][2] = x}
    get m14() {return this._array[0][3]} set m14(x) {this._array[0][3] = x}
    get m21() {return this._array[1][0]} set m21(x) {this._array[1][0] = x}
    get m22() {return this._array[1][1]} set m22(x) {this._array[1][1] = x}
    get m23() {return this._array[1][2]} set m23(x) {this._array[1][2] = x}
    get m24() {return this._array[1][3]} set m24(x) {this._array[1][3] = x}
    get m31() {return this._array[2][0]} set m31(x) {this._array[2][0] = x}
    get m32() {return this._array[2][1]} set m32(x) {this._array[2][1] = x}
    get m33() {return this._array[2][2]} set m33(x) {this._array[2][2] = x}
    get m34() {return this._array[2][3]} set m34(x) {this._array[2][3] = x}
    get m41() {return this._array[3][0]} set m41(x) {this._array[3][0] = x}
    get m42() {return this._array[3][1]} set m42(x) {this._array[3][1] = x}
    get m43() {return this._array[3][2]} set m43(x) {this._array[3][2] = x}
    get m44() {return this._array[3][3]} set m44(x) {this._array[3][3] = x}
}

export class Vector2
{
    x = 0
    y = 0

    /**
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
     */
    static fromLen(len, dir) {
        return new Vector2(Math.cos(degToRad(dir)) * len, Math.sin(degToRad(dir)) * len)
    }

    /**
     * Shorthand for (0, 0)
     */
    static get zero() {
        return new Vector2(0, 0)
    }
    /**
     * Shorthand for (1, 1)
     */
    static get one() {
        return new Vector2(1, 1)
    }
    /**
     * Shorthand for (1, 0)
     */
    static get right() {
        return new Vector2(1, 0)
    }
    /**
     * Shorthand for (-1, 0)
     */
    static get left() {
        return new Vector2(-1, 0)
    }
    /**
     * Shorthand for (0, 1)
     */
    static get down() {
        return new Vector2(0, 1)
    }
    /**
     * Shorthand for (0, -1)
     */
    static get up() {
        return new Vector2(0, -1)
    }

    /**
     * Returns the sum of two Vectors or a Vector and a number.
     * @overload
     * @param {number} value
     * @overload
     * @param {Vector2} value
     */
    add(value) {
        if(value instanceof Vector2)
            return new Vector2(this.x + value.x, this.y + value.y)
        else if(typeof value === "number")
            return new Vector2(this.x + value, this.y + value)
        else
            throw new TypeError(`Cannot parse operands of 'Vector2' and '${typeof value}'`)
    }

    /**
     * Returns the difference of two Vectors or a Vector and a number.
     * @overload
     * @param {number} value
     * @overload
     * @param {Vector2} value
     */
    sub(value) {
        if(value instanceof Vector2)
            return new Vector2(this.x - value.x, this.y - value.y)
        else if(typeof value === "number")
            return new Vector2(this.x - value, this.y - value)
        else
            throw new TypeError(`Cannot parse operands of 'Vector2' and '${typeof value}'`)
    }

    /**
     * Returns the product of a Vector and value.
     * @param {number} value
     */
    mul(value) {
        return new Vector2(this.x * value, this.y * value)
    }

    /**
     * Returns the quotient of a Vector and value.
     * @param {number} value
     */
    div(value) {
        return new Vector2(this.x / value, this.y / value)
    }

    /**
     * Returns the dot product of two Vectors.
     * @param {Vector2} v Value
     * @returns {number}
     */
    dot(v) {
        return this.x * v.x + this.y * v.y
    }

    /**
     * Returns a perfect clone of a Vector.
     */
    clone() {
        return new Vector2(this.x, this.y)
    }

    /**
     * Returns a new Vector with a length that is clamped between the min and max.
     * @param {Vector2} v The vector to be clamped.
     * @param {number} min Minimum length.
     * @param {number} max Maximum length.
     * @returns {Vector2}
     */
    static clampLength(v, min, max) {
        var r = Vector2.clone(v)
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
        return v1.add(v2.reversed).magnitude
    }

    /**
     * Returns the angle pointing from one vector to another.
     * @param {Vector2} v1 First position.
     * @param {Vector2} v2 Second position.
     * @returns {number}
     */
    static direction(v1, v2) {
        return v1.add(v2.reversed).angle
    }

    /**
     * Length of the Vector.
     * @type {number}
     */
    get magnitude() {
        return Math.sqrt(this.x*this.x + this.y*this.y)
    }
    set magnitude(val) {
        var n = this.normalized
        this.x = n.x * val
        this.y = n.y * val
    }

    /**
     * Direction (in degrees) of the Vector.
     * @type {number}
     */
    get angle() {
        return radToDeg(Math.atan(this.y / this.x))
    }
    set angle(val) {
        const mag = this.magnitude
        this.x = Math.cos(degToRad(val)) * mag
        this.y = Math.sin(degToRad(val)) * mag
    }

    /**
     * @returns {"(x, y)"}
     */
    toString() {
        return `(${this.x}, ${this.y})`
    }

    /**
     * @returns {[x, y]}
     */
    toArray() {
        return [this.x, this.y]
    }

    /**
     * Returns a copy of the Vector with the following transformation applied: (x, y) => (-x, -y)
     */
    get reversed() {
        return new Vector2(-this.x, -this.y)
    }

    /**
     * Returns a copy of the Vector with a length of 1.
     */
    get normalized() {
        var l = this.magnitude
        return new Vector2(this.x / l, this.y / l)
    }

    /**
     * @param {Vector2} vector
     */
    equals(vector)
    {
        return (this.x == vector.x && this.y == vector.y)
    }
}
