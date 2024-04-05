import ShaderCompiler from "./ShaderCompiler.js";

export default class RendererGL
{
    /**
     * @private
     * @type {WebGL2RenderingContext}
     */
    gl = null;

    ready = false

    fallbackProgram = null

    constructor(ctx)
    {
        this.gl = ctx;
        this.sh = new ShaderCompiler(this.gl)

        this.init()
    }

    /**
     * @private
     */
    init()
    {
        this.sh.compileAllShaders()

        this.fallbackProgram = ShaderCompiler.createProgram(this.gl, this.sh.get("v/base"), this.sh.get("f/base"))
    }
}
