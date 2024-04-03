/**
 * @template {{[x: string]: number | undefined}} T
 * @param {T} obj
 * @returns {Readonly<{[P in keyof T]: symbol}>}
 */
export function Enum(obj)
{
    Object.keys(obj).forEach(value => {
        obj[value] = Symbol(value)
    })
    return Object.freeze(obj)
}
