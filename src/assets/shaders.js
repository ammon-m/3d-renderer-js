import { Enum } from "../lib/util.js";

let _export = {
    /**
     * @description retrieve a vertex or fragment shader string
     * 
     * @param {string} name pattern: `/(?<=^(?:v|f)\/)(?![0-9])\w+$/`
     * 
     * examples: `"v/base"`, `"f/trippy"`
     */
    get: (name) => {
        const e = /(?<=^(?:v|f)\/)(?![0-9])\w+$/.exec(name)
        if(e !== null)
        {
            switch(name.charAt(0))
            {
                case "v": return "#version 300 es\n" + Vertex[e[0]];
                case "f": return "#version 300 es\n" + Fragment[e[0]];
            }
        }

        throw new SyntaxError("Invalid shader path")
    },

    /**
     * @private
     * @param {WebGL2RenderingContext} gl
     * @param {number} type
     * @param {string} source
     */
    compile: (gl, type, source) =>
    {
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
    },

    /**
     * Compile all shaders asynchronously
     * @param {WebGL2RenderingContext} gl
     */
    async compileAllShaders(gl) {
        console.log("[Shader Compiler] compiling shaders...")
        for(const vsh in Vertex)
        {
            const v = _export.compile(gl, gl.VERTEX_SHADER, Vertex[vsh])
            if(v !== null)
                Vertex[vsh] = v
            else
                return Promise.reject(new ShaderCompilerError(ShaderCompilerErrorType.Vertex))
        }
        for(const fsh in Fragment)
        {
            const f = _export.compile(gl, gl.FRAGMENT_SHADER, Fragment[fsh])
            if(f !== null)
                Fragment[fsh] = f
            else
                return Promise.reject(new ShaderCompilerError(ShaderCompilerErrorType.Fragment))
        }

        return Promise.resolve()
    }
}

export const ShaderCompilerErrorType = Enum({
    Vertex: 0,
    Fragment: 1
})

export class ShaderCompilerError extends Error
{
    /**
     * @param {symbol} type
     */
    constructor(type)
    {
        this.name = "ShaderCompileError"
        this.message = `Failed to compile 1 or more shaders (in ${type.description})`
        this.type = type
    }
}

_export.compileAllShaders().then(() => { // success
    
}, (reason) => { // error
    console.error(reason)
})

export default _export

const Vertex = {
    /**
    * @description basic vertex shader
    */
    base: (/*glsl*/`

    // an attribute is an input (in) to a vertex shader.
    // It will receive data from a buffer
    in vec4 a_position;

    // all shaders have a main function
    void main()
    {
        // gl_Position is a special variable a vertex shader
        // is responsible for setting
        gl_Position = a_position;

    }`)
}

const Fragment = {
    /**
    * @description basic fragment shader
    */
    base: /*glsl*/`

    // fragment shaders don't have a default precision so we need
    // to pick one. highp is a good default. It means "high precision"
    precision highp float;
    
    // we need to declare an output for the fragment shader
    out vec4 outColor;
    
    void main()
    {
        // Just set the output to a constant reddish-purple
        outColor = vec4(1, 0, 1, 1);

    }`
}
