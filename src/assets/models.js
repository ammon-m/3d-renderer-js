import MeshGL from "../lib/MeshGL.js"
import cube from "./models/cube.json" assert { type: "json" }

export default {
    cube,
    cube: importOBJ(cube)
}

/**
 * @param {{v: number[][], vt: number[][], vn: number[][], f: string[][]}} json 
 */
function importOBJ(json) {
    const f = []
    for(var i = 0; i < f.length; i++)
    {
        f.push([])
        for(var j = 0; j < 3; j++)
        {
            f[i].push(json.f[i][j].split("/"))
        }
    }
    return new MeshGL(json.v, json.vt, json.vn, f)
}
