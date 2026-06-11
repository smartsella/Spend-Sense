/**
 * SpendSense Centralized Theme Configuration System
 * Provides color variables and adaptation grids for Recharts charts and premium styling containers.
 */

export const getChartConfig = (theme) => {
  const isDark = theme === 'dark';

  return {
    axisStroke: isDark ? '#d1d5db' : '#4b5563', /* Light Gray vs Dark Gray */
    gridStroke: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    tooltipStyle: {
      background: isDark ? '#0c0a22' : '#ffffff',
      border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
      borderRadius: '12px',
      color: isDark ? '#ffffff' : '#000000', /* Bright White vs Dark Black */
      fontSize: '11px',
    },
    legendStyle: {
      fontSize: '10px',
      textTransform: 'uppercase',
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#000000', /* Bright White vs Dark Black */
    },
  };
};

export const FINANCE_CATEGORIES = {
  income: ['Salary', 'Freelance', 'Business', 'Investments', 'Other'],
  expense: [
    'Food',
    'Travel',
    'Shopping',
    'Education',
    'Medical',
    'Entertainment',
    'Bills',
    'Rent',
    'Other',
  ],
};
