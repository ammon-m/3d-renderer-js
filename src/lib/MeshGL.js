export default class MeshGL
{
    /**@type {number[]}*/ v_raw = []
    /**@type {number[]}*/ vt_raw = []
    /**@type {number[]}*/ vn_raw = []

    /**
     * @param {number[][]} v
     * @param {number[][]} vt
     * @param {number[][]} vn
     * @param {number[][][]} f
     */
    constructor(v, vt, vn, f)
    {
        for(var i = 0; i < f.length; i++)
        {
            for(var j = 0; j < 3; j++)
            {
                // Position
                this.v_raw.push(v[f[i][j][0] - 1][0], v[f[i][j][0] - 1][1], v[f[i][j][0] - 1][2])

                // UV Texcoord
                this.vt_raw.push(vt[f[i][j][1] - 1][0], vt[f[i][j][1] - 1][1], 0)

                // Face normal
                this.vn_raw.push(vn[f[i][j][2] - 1][0], vn[f[i][j][2] - 1][1], vn[f[i][j][2] - 1][2])
            }
        }
    }
}
