/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-02-07
 * @modifier yuan.ping
 * @modify date 2018-06-21
 *
 * 时间工具集
*/
/**
 * 格式化本地时间戳
 * 注：时间戳是从格林尼治时间1970年1月1日0时0分0秒开始的
 *
 * @param {number} timestamp 时间戳，单位毫秒
 * @param {string} [format="yyyy-MM-dd hh:mm:ss.S"] 格式，如"yyyy-MM-dd hh:mm:ss.S"
 * @returns {string} 格式化后的时间戳
 */
export function formatTimestamp(timestamp, format) {
    if (format === void 0) { format = "yyyy-MM-dd hh:mm:ss.S"; }
    var date = new Date(timestamp);
    return formatFromData({
        year: date.getFullYear(),
        quarter: Math.floor(date.getMonth() / 3) + 1,
        month: date.getMonth() + 1,
        date: date.getDate(),
        day: date.getDay(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
        millisecond: date.getMilliseconds()
    }, format);
}
/**
 * 格式化格林尼治时间戳
 * 注：时间戳是从格林尼治时间1970年1月1日0时0分0秒开始的
 *
 * @param {number} timestamp 时间戳，单位毫秒
 * @param {string} [format="yyyy-MM-dd hh:mm:ss.S"] 格式，如"yyyy-MM-dd hh:mm:ss.S"
 * @returns {string} 格式化后的格林尼治时间戳
 */
export function formatUTCTimestamp(timestamp, format) {
    if (format === void 0) { format = "yyyy-MM-dd hh:mm:ss.S"; }
    var date = new Date(timestamp);
    return formatFromData({
        year: date.getUTCFullYear(),
        quarter: Math.floor(date.getUTCMonth() / 3) + 1,
        month: date.getUTCMonth() + 1,
        date: date.getUTCDate(),
        day: date.getUTCDay(),
        hour: date.getUTCHours(),
        minute: date.getUTCMinutes(),
        second: date.getUTCSeconds(),
        millisecond: date.getUTCMilliseconds()
    }, format);
}
/**
 * 格式化时长，与时间戳不同，时长仅代表时间长度。因此仅支持显示d/h/m/s/S
 * 注：如果没有前一个时间维度，则当前维度不会取余，比如如果没有d，则h可能会超过24，以此类推
 *
 * @export
 * @param {number} duration 时长，单位毫秒
 * @param {string} [format="d hh:mm:ss"] 格式，如"d hh:mm:ss.S"
 * @returns {string}
 */
export function formatDuration(duration, format) {
    if (format === void 0) { format = "d hh:mm:ss.S"; }
    var data = {
        date: Math.floor(duration / 86400000),
        hour: Math.floor(duration / 3600000),
        minute: Math.floor(duration / 60000),
        second: Math.floor(duration / 1000),
        millisecond: duration
    };
    if (format.indexOf("d") >= 0)
        data.hour %= 24;
    if (format.indexOf("h") >= 0)
        data.minute %= 60;
    if (format.indexOf("m") >= 0)
        data.second %= 60;
    if (format.indexOf("s") >= 0)
        data.millisecond %= 1000;
    return formatFromData(data, format);
}
function formatFromData(data, format) {
    // 统一替换的不包含毫秒数
    var dict = {
        "y+": data.year,
        "q+": data.quarter,
        "M+": data.month,
        "d+": data.date,
        "D+": data.day,
        "h+": data.hour,
        "m+": data.minute,
        "s+": data.second
    };
    for (var key in dict) {
        var value = dict[key];
        // 负数不替换
        if (value >= 0) {
            var reg = new RegExp("(" + key + ")", "g");
            if (reg.test(format)) {
                format = format.replace(reg, numToStr(value, RegExp.$1.length));
            }
        }
    }
    // 替换毫秒数
    if (data.millisecond >= 0) {
        format = format.replace(/S+/g, data.millisecond + "");
    }
    return format;
}
function numToStr(num, len) {
    if (len === void 0) { len = 1; }
    var numStr = num + "";
    // 如果长度不大于1，则该多长就多长
    if (len <= 1)
        return numStr;
    // 否则截短或者在前面补0
    var numLen = numStr.length;
    if (len <= numLen) {
        return numStr.substr(numLen - len);
    }
    else {
        for (var i = 0, lenI = len - numLen; i < lenI; i++) {
            numStr = "0" + numStr;
        }
        return numStr;
    }
}
