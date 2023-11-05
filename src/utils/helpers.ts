import dayjs from 'dayjs';

export function formatDate(obj: { date?: string; day?: number }) {
  const isSetDate = obj.date ?? new Date();
  const isOffDay = obj.day ?? 0;
  return dayjs(isSetDate).add(isOffDay, 'day').format('YYYY-MM-DD');
}

export function random(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function sliceLimit(obj: any[]) {
  if (obj.length <= 25) return obj;
  return obj.slice(0, 25 - obj.length);
}

export function getQueryExpression(arr: string[] = []) {
  const clauses = new URLSearchParams();
  if (arr.length > 0) {
    clauses.append('cayenneExp', [...arr].join(' and '));
  }
  return clauses.toString();
}

export function formatGameDate(str: string) {
  const dateObj = new Date(str);
  return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
