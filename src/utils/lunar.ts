import { Solar, Lunar, HolidayUtil } from 'lunar-typescript';

export interface LunarResult {
    date: string;          // 2024-02-10
    lunarDate: string;     // 正月初一
    lunarMonth: string;    // 正月
    lunarDay: string;      // 初一
    animal: string;        // 龙
    ganzhiYear: string;    // 甲辰
    term: string | null;   // 节气 (如：立春)
    festival: string[];    // 节日列表
    isHoliday: boolean;    // 是否是法定节假日
}

export class LunarUtils {
    /**
     * 获取指定日期的完整农历信息
     * @param date JS Date 对象或日期字符串
     */
    static getFullInfo(date: Date | string = new Date()): LunarResult {
        const d = typeof date === 'string' ? new Date(date) : date;
        const solar = Solar.fromDate(d);
        // const lunar = solar.getLunar();
        const lunar = Lunar.fromDate(d);

        // 合并公历节日和农历节日
        const festivals = [
            ...solar.getFestivals(),
            ...lunar.getFestivals()
        ];
        return {
            date: solar.toYmd(),
            lunarDate: `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
            lunarMonth: lunar.getMonthInChinese(),
            lunarDay: lunar.getDayInChinese(),
            animal: lunar.getYearShengXiao(),
            ganzhiYear: lunar.getYearInGanZhi(),
            term: lunar.getJieQi() || null,
            festival: festivals,
            isHoliday: !!HolidayUtil.getHoliday(solar.getYear(), solar.getMonth(), solar.getDay())
        };
    }

    /**
     * 仅获取节气
     */
    // static getSolarTerm(date: Date = new Date()): string | null {
    //     return Solar.fromDate(date).getLunar().getJieQi() || null;
    // }

    static getLunarTerm(date: Date = new Date()): string | null {
        const lunar = Lunar.fromDate(date)
        return lunar.getJieQi() || lunar.getPrevJieQi().getName() || null;
    }
    /**
     * 获取指定年份的所有节气列表（常用于日历渲染）
     */
    static getYearTerms(year: number) {
        const lunar = Lunar.fromYmd(year, 1, 1);
        return lunar.getJieQiTable(); // 返回键值对 { 节气名: 日期 }
    }
}