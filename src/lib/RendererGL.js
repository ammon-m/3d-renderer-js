import ShaderCompiler from "./ShaderCompiler.js";

export default class RendererGL
{
    /**
     * @private
     * @type {WebGL2RenderingContext}
     */
    gl = null

    programs = {
        base: null,
        lit: null
    }

    ready = false

    constructor(ctx)
    {
        this.gl = ctx;
        this.sh = new ShaderCompiler(this.gl)
    }

    init()
    {
        this.sh.compileAllShaders()

        const _programs = ["base", "lit"]

        for(const shader of _programs)
        {
            this.programs.base = ShaderCompiler.createProgram(this.gl, this.sh.get("v/base"), this.sh.get("f/base"))
        }

        this.ready = true
    }

    main()
    {
        if(!this.ready) return;

        
    }
}
