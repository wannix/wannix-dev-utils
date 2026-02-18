export interface CronSchedule {
  expression: string;
  isValid: boolean;
  error?: string;
  description?: string;
  nextRuns?: Date[];
}

function generateDescription(expression: string): string {
  const parts = expression.trim().split(/\s+/);
  if (parts.length < 5) return 'Invalid expression';
  
  const [minute, hour] = parts;
  
  if (expression === '* * * * *') return 'Every minute';
  if (minute.includes('/')) return `Every ${minute.split('/')[1]} minutes`;
  if (hour.includes('/')) return `Every ${hour.split('/')[1]} hours`;
  if (minute.match(/^\d+$/) && hour === '*') return `Every hour at minute ${minute}`;
  if (minute.match(/^\d+$/) && hour.match(/^\d+$/)) {
    const h = parseInt(hour);
    const m = parseInt(minute);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `Daily at ${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
  }
  
  return 'Custom schedule';
}

function getNextRuns(expression: string, count: number): Date[] {
  const parts = expression.trim().split(/\s+/);
  if (parts.length < 5) return [];
  
  const dates: Date[] = [];
  const now = new Date();
  let current = new Date(now);
  current.setSeconds(0, 0);
  
  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
  
  for (let i = 0; i < count && dates.length < count; i++) {
    current = new Date(current.getTime() + 60000);
    
    const matchesMinute = minute === '*' || minute.includes('/') 
      ? (minute === '*' || current.getMinutes() % parseInt(minute.split('/')[1]) === 0)
      : minute.split(',').includes(String(current.getMinutes()));
    
    const matchesHour = hour === '*' || hour.includes('/')
      ? (hour === '*' || current.getHours() % parseInt(hour.split('/')[1]) === 0)
      : hour.split(',').includes(String(current.getHours()));
    
    const matchesDayOfMonth = dayOfMonth === '*' || dayOfMonth.split(',').includes(String(current.getDate()));
    const matchesMonth = month === '*' || month.split(',').includes(String(current.getMonth() + 1));
    const matchesDayOfWeek = dayOfWeek === '*' || dayOfWeek.split(',').includes(String(current.getDay()));
    
    if (matchesMinute && matchesHour && matchesDayOfMonth && matchesMonth && matchesDayOfWeek) {
      dates.push(new Date(current));
    }
    
    if (i > 1000000) break; // Safety limit
  }
  
  return dates;
}

export function parseCronExpression(expression: string, count: number = 5): CronSchedule {
  if (!expression.trim()) {
    return { expression, isValid: false };
  }
  
  const parts = expression.trim().split(/\s+/);
  if (parts.length < 5 || parts.length > 6) {
    return { expression, isValid: false, error: 'Cron expression must have 5 fields' };
  }
  
  try {
    return {
      expression,
      isValid: true,
      description: generateDescription(expression),
      nextRuns: getNextRuns(expression, count),
    };
  } catch (error) {
    return {
      expression,
      isValid: false,
      error: error instanceof Error ? error.message : 'Invalid cron expression',
    };
  }
}

export const commonCronExpressions = [
  { expression: '* * * * *', description: 'Every minute' },
  { expression: '*/5 * * * *', description: 'Every 5 minutes' },
  { expression: '0 * * * *', description: 'Every hour' },
  { expression: '0 0 * * *', description: 'Every day at midnight' },
  { expression: '0 0 * * 0', description: 'Every Sunday at midnight' },
];
