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
     * Shorthand for (1, 1, 1)
     * 
     * it is NOT normalized; the length is the square root of 3
     */
    static get one() {return new Vector3(0, 0, 0)}

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

        const rotx = Matrix.identity, roty = Matrix.identity, rotz = Matrix.identity
        rotx._array = Object.preventExtensions([
            [1, 0, 0, 0],
            [0,  Math.acos(rotation.x), Math.asin(rotation.x), 0],
            [0, -Math.asin(rotation.x), Math.acos(rotation.x), 0],
            [0, 0, 0, 1]
        ])
        roty._array = Object.preventExtensions([
            [Math.acos(rotation.y), 0, -Math.asin(rotation.y), 0],
            [0, 1, 0, 0],
            [Math.asin(rotation.y), 0,  Math.acos(rotation.y), 0],
            [0, 0, 0, 1]
        ])
        rotz._array = Object.preventExtensions([
            [Math.acos(rotation.z), -Math.asin(rotation.z), 0, 0],
            [Math.asin(rotation.z),  Math.acos(rotation.z), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ])

        const mat = Matrix.multiply(Matrix.multiply(rotz, Matrix.multiply(rotx, Matrix.multiply(roty, Matrix.identity)), scaleMat), posMat)
        console.log(mat.toString())
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
        console.log(arr.join(" "))
        return arr;
    }

    toString()
    {
        return (
            `${this._array[0][0]} ${this._array[0][1]} ${this._array[0][2]} ${this._array[0][3]}` + "\n" +
            `${this._array[1][0]} ${this._array[1][1]} ${this._array[1][2]} ${this._array[1][3]}` + "\n" +
            `${this._array[2][0]} ${this._array[2][1]} ${this._array[2][2]} ${this._array[2][3]}` + "\n" +
            `${this._array[3][0]} ${this._array[3][1]} ${this._array[3][2]} ${this._array[3][3]}`
        )
    }
}
