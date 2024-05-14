
import { format, differenceInMilliseconds, differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays } from "date-fns";


const MILLIS = 1;
const SECOND = 1000
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;


export function timeTransform(str : string) {
    return format(str, 'yyyy-MM-dd hh:mm');
}

export function test(str : string){
    const currentDate = new Date();
    const targetDate = new Date(str);
    const diffMilliseconds = differenceInMilliseconds(currentDate, targetDate);
    const diffSeconds = differenceInSeconds(currentDate, targetDate);
    const diffMinutes = differenceInMinutes(currentDate, targetDate);
    const diffHours = differenceInHours(currentDate, targetDate);
    const diffDays = differenceInDays(currentDate, targetDate);

    if (diffMilliseconds < MINUTE) {
        return `${Math.round(diffSeconds / SECOND)}秒前`;
    } else if (diffSeconds < HOUR) {
        return `${Math.round(diffMinutes)}分钟前`;
    } else if (diffSeconds < DAY) {
        return `${Math.round(diffHours)}小时前`;
    } else if (diffDays < 30) {
        return `${diffDays}天前`;
    } else {
        return format(targetDate, 'yyyy-MM-dd hh:mm');
    }
}