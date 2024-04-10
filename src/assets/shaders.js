export const Vertex = {
    /**
     * basic vertex shader
     */
    base: /*glsl*/`

    // an attribute is an input (in) to a vertex shader.
    // It will receive data from a buffer
    in vec4 position;
    in vec2 texcoord;
    in vec4 normal;

    // all shaders have a main function
    void main()
    {
        // gl_Position is a special variable a vertex shader
        // is responsible for setting
        gl_Position = position;

    }`,

    /**
     * 
     */
    lit: /*glsl*/`

    // an attribute is an input (in) to a vertex shader.
    // It will receive data from a buffer
    in vec4 position;
    in vec2 texcoord;
    in vec4 normal;

    // all shaders have a main function
    void main()
    {
        // gl_Position is a special variable a vertex shader
        // is responsible for setting
        gl_Position = position;

    }`
}

export const Fragment = {
    /**
     * basic fragment shader
     */
    base: /*glsl*/`

    // fragment shaders don't have a default precision so we need
    // to pick one. highp is a good default. It means "high precision"
    precision highp float;

    // we need to declare an output for the fragment shader
    out vec4 outColor;

    void main()
    {
        outColor = vec4(1, 0, 1, 1);
    }`,

    lit: /*glsl*/`

    // fragment shaders don't have a default precision so we need
    // to pick one. highp is a good default. It means "high precision"
    precision highp float;

    // we need to declare an output for the fragment shader
    out vec4 outColor;

    void main()
    {
        outColor = vec4(1, 1, 0, 1);
    }`
}
