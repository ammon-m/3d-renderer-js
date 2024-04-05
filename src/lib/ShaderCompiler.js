import { Vertex, Fragment } from "../assets/shaders.js"

export default class ShaderCompiler
{
    /** @private @type {WebGL2RenderingContextBase} */
    gl = null

    /**
     * @param {WebGL2RenderingContext} ctx
     */
    constructor(ctx)
    {
        this.gl = ctx
    }

    vert = {}
    frag = {}

    /**
     * Does *not* store the compiled shader in a compiler instance.
     * 
     * @param {WebGL2RenderingContext} gl
     * @param {number} type
     * @param {string} source
     */
    static compileShader(gl, type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }

        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null
    }

    /**
     * Create a program with a pair of compiled Vertex and Fragment shaders
     * 
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLShader} vertexShader
     * @param {WebGLShader} fragmentShader
     */
    static createProgram(gl, vertexShader, fragmentShader) {
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }

        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null
    }

    /**
     * Compile all shaders from `src/assets/shaders.js` asynchronously and store them in the compiler instance.
     * 
     * You can access them with the `get()` instance method.
     */
    compileAllShaders() {
        console.log("[Shader Compiler] compiling shaders...")

        let count = 0
        const totalCount = Object.keys(Vertex).length + Object.keys(Fragment).length

        for(const vsh in Vertex)
        {
            const v = ShaderCompiler.compileShader(this.gl, this.gl.VERTEX_SHADER, "#version 300 es\n" + Vertex[vsh])
            if(v !== null)
                this.vert[vsh] = v
            else
                throw new Error(`ShaderCompilerError: Failed to compile shader 'v/${vsh}'`)

            count++
        }

        for(const fsh in Fragment)
        {
            const f = ShaderCompiler.compileShader(this.gl, this.gl.FRAGMENT_SHADER, "#version 300 es\n" + Fragment[fsh])
            if(f !== null)
                this.frag[fsh] = f
            else
                throw new Error(`ShaderCompilerError: Failed to compile shader 'f/${fsh}'`)

            count++
        }

        console.log(`[Shader Compiler] successfully compiled ${count} / ${totalCount} shaders`)
    }

    /**
     * Retrieve a vertex or fragment shader
     * 
     * Throws a `SyntaxError` if the `path` does not match the pattern.
     * @returns {WebGLShader}
     * 
     * @param {string} path pattern: `/(?<=^(?:v|f)\/)(?![0-9])\w+$/`
     * 
     * examples: `"v/base"`, `"f/trippy"`
     */
    get(path) {
        const e = /(?<=^(?:v|f)\/)(?![0-9])\w+$/.exec(path)
        if(e !== null)
        {
            switch(path.charAt(e.index))
            {
                case "v": return this.vert[e[0]];
                case "f": return this.frag[e[0]];
            }
        }

        throw new SyntaxError("Invalid shader path")
    }
}
