// Modern theme system with light and dark modes
export const lightTheme = {
  // Brand Colors - Modern gradient-friendly palette
  primary: {
    50: '#f0f4ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    main: '#6366f1',
    light: '#818cf8',
    dark: '#4338ca',
  },
  
  secondary: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
    main: '#ec4899',
    light: '#f472b6',
    dark: '#be185d',
  },

  // Accent colors for variety
  accent: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    main: '#22c55e',
  },

  // Warm accent
  warm: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    main: '#f97316',
  },

  // Neutral Colors
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Semantic Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    main: '#22c55e',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    main: '#f59e0b',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    main: '#ef4444',
  },

  // Background & Surface
  background: {
    default: '#ffffff',
    paper: '#ffffff',
    elevated: '#f9fafb',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  surface: {
    default: '#ffffff',
    elevated: '#f9fafb',
    hover: '#f3f4f6',
    pressed: '#e5e7eb',
    disabled: '#f9fafb',
  },

  // Text Colors
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
    disabled: '#d1d5db',
    inverse: '#ffffff',
    link: '#0ea5e9',
    linkHover: '#0284c7',
  },

  // Border & Divider
  border: {
    default: '#e5e7eb',
    light: '#f3f4f6',
    medium: '#d1d5db',
    strong: '#9ca3af',
    focus: '#0ea5e9',
    error: '#ef4444',
    success: '#22c55e',
  },

  // Shadows
  shadow: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
};

export const darkTheme = {
  // Brand Colors (same as light)
  primary: lightTheme.primary,
  secondary: lightTheme.secondary,
  accent: lightTheme.accent,
  warm: lightTheme.warm,

  // Neutral Colors (inverted)
  gray: {
    50: '#111827',
    100: '#1f2937',
    200: '#374151',
    300: '#4b5563',
    400: '#6b7280',
    500: '#9ca3af',
    600: '#d1d5db',
    700: '#e5e7eb',
    800: '#f3f4f6',
    900: '#f9fafb',
  },

  // Semantic Colors (adjusted for dark mode)
  success: {
    ...lightTheme.success,
    main: '#10b981',
  },

  warning: {
    ...lightTheme.warning,
    main: '#f59e0b',
  },

  error: {
    ...lightTheme.error,
    main: '#f87171',
  },

  // Background & Surface (dark)
  background: {
    default: '#0f172a',
    paper: '#1e293b',
    elevated: '#334155',
    overlay: 'rgba(0, 0, 0, 0.8)',
  },

  surface: {
    default: '#1e293b',
    elevated: '#334155',
    hover: '#475569',
    pressed: '#64748b',
    disabled: '#1e293b',
  },

  // Text Colors (inverted)
  text: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
    tertiary: '#94a3b8',
    disabled: '#64748b',
    inverse: '#0f172a',
    link: '#38bdf8',
    linkHover: '#0ea5e9',
  },

  // Border & Divider (dark)
  border: {
    default: '#334155',
    light: '#1e293b',
    medium: '#475569',
    strong: '#64748b',
    focus: '#38bdf8',
    error: '#f87171',
    success: '#10b981',
  },

  // Shadows (darker)
  shadow: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
  },
};

// Common theme properties
const commonTheme = {
  // Spacing system
  spacing: (factor) => `${8 * factor}px`,
  
  // Border radius - More modern and varied
  radius: {
    none: '0',
    xs: '0.125rem',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.25rem',
    '3xl': '1.5rem',
    '4xl': '2rem',
    full: '9999px',
  },

  // Typography
  typography: {
    fontFamily: {
      sans: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Oxygen',
        'Ubuntu',
        'Cantarell',
        'sans-serif'
      ].join(', '),
      mono: [
        'JetBrains Mono',
        'Fira Code',
        'Monaco',
        'Consolas',
        'Liberation Mono',
        'Courier New',
        'monospace'
      ].join(', '),
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    },
    fontWeight: {
      thin: 100,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },

  // Breakpoints
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-index scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },

  // Transitions
  transition: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
  },
};

// Merge common theme with light/dark themes
export const getTheme = (isDark = false) => ({
  ...commonTheme,
  ...(isDark ? darkTheme : lightTheme),
  isDark,
});
