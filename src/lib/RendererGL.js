import shaders from "../assets/shaders.js";

export default class RendererGL {
    /**
     * @type {WebGL2RenderingContext}
     */
    gl = null;

    constructor(ctx)
    {
        this.gl = ctx;
    }
}
