import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import weekday from 'dayjs/plugin/weekday.js';
import advanceFormat from 'dayjs/plugin/advancedFormat.js';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekday);
dayjs.extend(advanceFormat);

export function setCurrentTime(str?: string) {
  const currentTime = dayjs(str).tz(process.env.TIME_ZONE);
  return currentTime;
}
export function formatDate(obj: { date?: string; day?: number }) {
  const isSetDate = obj.date ?? dayjs().subtract(12, 'hour').tz(process.env.TIME_ZONE); // Today changes at 12pm EST
  const isOffDay = obj.day ?? 0;
  return dayjs(isSetDate).add(isOffDay, 'day').format('YYYY-MM-DD');
}

export function formatGameDate(str: string) {
  const dateObj = setCurrentTime(str);
  const dayOfTheWeekInt = dateObj.clone().day();
  const dayNumberArr: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return `${dayNumberArr[dayOfTheWeekInt]}, ${dateObj.format('MMM D')}`;
}

export function formatGameTime(str: string) {
  const gameTime = setCurrentTime(str);
  return gameTime.format('h:mm A z');
}

export function random(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function sliceLimit(obj: any[]) {
  if (obj.length <= 25) return obj;
  return obj.slice(0, 25);
}

export function getQueryExpression(arr: string[] = []) {
  const clauses = new URLSearchParams();
  if (arr.length > 0) {
    clauses.append('cayenneExp', [...arr].join(' and '));
  }
  return clauses.toString();
}
export function formatFlag(str: string) {
  const flagsList: Record<string, string> = {
    AUT: ':flag_at:',
    BGR: ':flag_by:',
    BLR: ':flag_bg:',
    CAN: ':flag_ca:',
    CHE: ':flag_ch:',
    CZE: ':flag_cz:',
    DEN: ':flag_dk:',
    DEU: ':flag_de:',
    FRA: ':flag_fr:',
    GER: ':flag_de:',
    FIN: ':flag_fi:',
    LAT: ':flag_lv:',
    NLD: ':flag_nl:',
    NOR: ':flag_no:',
    RUS: ':flag_ru:',
    SUI: ':flag_ch:',
    SVK: ':flag_sk:',
    SVN: ':flag_si:',
    SWE: ':flag_se:',
    USA: ':flag_us:',
  };
  return flagsList[str] ? flagsList[str] : `:flag_${str.toLowerCase().substring(2)}:`;
}
