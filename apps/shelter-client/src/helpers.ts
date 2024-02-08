
/**
 * Return deshes instead of input string.
 * Example: halo -> ----
 */
export const deshCount = (string: string) => {
    const length: number  = string.split('').length
    const dashArr: string[] = []
    for (let i = 0; i < length; i++) {
        dashArr.push('-')
    }
    return  dashArr.join('')
}
