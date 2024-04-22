// 辅助函数，用于补齐零
const padZero = (num: number) => num.toString().padStart(2, '0');

// 默认导出的函数
const caculateTimeList = (start: number, interval: number): string[] => {
    const time_list: string[] = [];
    let i = 0;
    for(;i < 1000; i++){
        const date = new Date(start + i * interval);
        const year = date.getUTCFullYear(); // 获取年份
        const month = date.getUTCMonth() + 1; // 获取月份（注意月份从 0 开始，需要加 1）
        const day = date.getUTCDate(); // 获取日期
        const hour = date.getUTCHours() + 8; // 获取小时（加 8 是为了转换为北京时间）
        const minute = date.getUTCMinutes(); // 获取分钟
        const second = date.getUTCSeconds(); // 获取秒钟

        // const beijingTimeString = `${year}-${padZero(month)}-${padZero(day)}${padZero(hour)}:${padZero(minute)}:${padZero(second)}`;
        const beijingTimeString = `${padZero(hour)}:${padZero(minute)}:${padZero(second)}`;
        time_list.push(beijingTimeString);
    }
    return time_list;
}

// 导出默认
export default caculateTimeList;
