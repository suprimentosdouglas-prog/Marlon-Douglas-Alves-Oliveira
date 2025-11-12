// Helper to zero out time part of a date
const startOfDay = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
};

export const differenceInDays = (dateLeft: Date, dateRight: Date): number => {
    const dLeft = startOfDay(dateLeft);
    const dRight = startOfDay(dateRight);
    // Use Math.floor to mimic date-fns behavior of counting full days
    return Math.floor((dLeft.getTime() - dRight.getTime()) / (1000 * 60 * 60 * 24));
};

export const isBefore = (date: Date, dateToCompare: Date): boolean => {
    return date.getTime() < dateToCompare.getTime();
};

export const isAfter = (date: Date, dateToCompare: Date): boolean => {
    return date.getTime() > dateToCompare.getTime();
};

export const format = (date: Date, formatStr: string): string => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return formatStr
        .replace('dd', day)
        .replace('MM', month)
        .replace('yyyy', String(year))
        .replace('yy', String(year).slice(-2))
        .replace('HH', hours)
        .replace('mm', minutes);
};

export const subDays = (date: Date, amount: number): Date => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - amount);
    return newDate;
};

export const addDays = (date: Date, amount: number): Date => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + amount);
    return newDate;
};
