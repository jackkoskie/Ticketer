/**
 * @description Returns the current time without the date
 * 
 * @param milliseconsds - Weather or not to return milliseconsds
 * @returns hh:mm:ss(:ms)
 */
const time = (milliseconsds: Boolean = false) => {
    const date = new Date();
    let hh = date.getHours();
    let mm = date.getMinutes();
    let ss = date.getSeconds();
    let ms = date.getMilliseconds();

    let time = `${hh}:${mm}:${ss}${milliseconsds ? `:${ms}` : ''}`;

    return time;
}

export { time };