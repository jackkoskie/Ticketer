/**
 * Rounds a number to a specified amound of places
 * @param number The number to be rounded
 * @param places The number of places to round the number to
 * @returns The rounded number
 */
const round = (number: number, places: number) => {
    return Math.round((number + Number.EPSILON) * (places * 10)) / 100
}

export { round }