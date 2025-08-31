// Centralized theme configuration for consistent styling across components
export const getThemeStyles = (theme) => {
    const isDark = theme === 'dark';

    return {
        // Background colors
        bgColor: isDark ? 'bg-[#242424]' : 'bg-gray-50',
        cardBg: isDark ? 'bg-gray-900' : 'bg-white',
        headerBg: isDark ? 'bg-black/90' : 'bg-white/90',
        sectionBg: isDark ? 'bg-gray-800' : 'bg-gray-50',
        itemBg: isDark ? 'bg-gray-700' : 'bg-white',

        // Text colors
        textColor: isDark ? 'text-white' : 'text-gray-900',
        secondaryTextColor: isDark ? 'text-gray-300' : 'text-gray-600',

        // Border colors
        cardBorder: isDark ? 'border-gray-800' : 'border-gray-200',
        headerBorder: isDark ? 'border-gray-800' : 'border-gray-200',
        sectionBorder: isDark ? 'border-gray-700' : 'border-gray-200',
        itemBorder: isDark ? 'border-gray-600' : 'border-gray-200',

        // Hover effects
        cardHover: isDark ? 'hover:border-green-500/30' : 'hover:border-green-500/50',
        itemHover: isDark ? 'hover:border-green-500/50' : 'hover:border-green-500/50',

        // Shadows
        shadow: isDark ? 'shadow-2xl shadow-black/50' : 'shadow-xl shadow-gray-200/50',
        greenShadow: isDark ? 'hover:shadow-green-500/25' : 'hover:shadow-green-500/20',

        // Gradient backgrounds
        headerGradient: isDark ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-gray-100 to-gray-200',

        // Button styles
        buttonPrimary: isDark ? 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700' : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600',
        buttonSecondary: isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300',

        // Input styles
        inputBg: isDark ? 'bg-gray-800' : 'bg-white',
        inputBorder: isDark ? 'border-gray-600' : 'border-gray-300',

        // Section item styles
        sectionItemBg: isDark ? 'bg-gray-800/60' : 'bg-gray-200/60',
        sectionItemBorder: isDark ? 'border-gray-700/50' : 'border-gray-300/50',

        // Utility classes
        isDark
    };
};
