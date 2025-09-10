/**
 * Responsive Design Utilities
 * Centralized responsive class utilities to reduce duplication
 */

// Common responsive breakpoint classes
export const RESPONSIVE_CLASSES = {
  // Container classes
  container: 'max-w-7xl mx-auto px-3 sm:px-4 lg:px-8',
  containerSmall: 'max-w-4xl mx-auto px-3 sm:px-4 lg:px-6',
  containerLarge: 'max-w-8xl mx-auto px-4 sm:px-6 lg:px-8',
  
  // Grid classes
  gridCols1: 'grid grid-cols-1',
  gridCols2: 'grid grid-cols-1 sm:grid-cols-2',
  gridCols3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  gridCols4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  
  // Spacing classes
  spacingSmall: 'space-y-4 sm:space-y-6 lg:space-y-8',
  spacingMedium: 'space-y-6 sm:space-y-8 lg:space-y-12',
  spacingLarge: 'space-y-8 sm:space-y-12 lg:space-y-16',
  
  // Gap classes
  gapSmall: 'gap-3 sm:gap-4 lg:gap-6',
  gapMedium: 'gap-4 sm:gap-6 lg:gap-8',
  gapLarge: 'gap-6 sm:gap-8 lg:gap-12',
  
  // Text sizes
  textSmall: 'text-xs sm:text-sm lg:text-base',
  textMedium: 'text-sm sm:text-base lg:text-lg',
  textLarge: 'text-base sm:text-lg lg:text-xl',
  textXLarge: 'text-lg sm:text-xl lg:text-2xl',
  textXXLarge: 'text-xl sm:text-2xl lg:text-3xl xl:text-4xl',
  
  // Padding classes
  paddingSmall: 'p-3 sm:p-4 lg:p-6',
  paddingMedium: 'p-4 sm:p-6 lg:p-8',
  paddingLarge: 'p-6 sm:p-8 lg:p-12',
  
  // Button sizes
  buttonSmall: 'px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 text-xs sm:text-sm lg:text-base',
  buttonMedium: 'px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-sm sm:text-base lg:text-lg',
  buttonLarge: 'px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 text-base sm:text-lg lg:text-xl',
  
  // Icon sizes
  iconSmall: 'w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5',
  iconMedium: 'w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6',
  iconLarge: 'w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8',
  
  // Border radius
  radiusSmall: 'rounded-lg sm:rounded-xl',
  radiusMedium: 'rounded-xl sm:rounded-2xl',
  radiusLarge: 'rounded-2xl sm:rounded-3xl',
  
  // Shadow classes
  shadowSmall: 'shadow-md hover:shadow-lg',
  shadowMedium: 'shadow-lg hover:shadow-xl',
  shadowLarge: 'shadow-xl hover:shadow-2xl',
  
  // Flex classes
  flexCol: 'flex flex-col',
  flexRow: 'flex flex-row',
  flexColSm: 'flex flex-col sm:flex-row',
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexStart: 'flex items-center justify-start',
  flexEnd: 'flex items-center justify-end',
  
  // Position classes
  stickyTop: 'sticky top-16 z-10',
  stickyTopLarge: 'sticky top-20 z-10',
  
  // Overflow classes
  overflowHidden: 'overflow-hidden',
  overflowScroll: 'overflow-x-auto scrollbar-hide',
  
  // Display classes
  hiddenSm: 'hidden sm:block',
  hiddenLg: 'hidden lg:block',
  blockSm: 'block sm:hidden',
  blockLg: 'block lg:hidden'
};

// Helper function to combine responsive classes
export const combineResponsiveClasses = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Common component class combinations
export const COMPONENT_CLASSES = {
  // Card components
  card: combineResponsiveClasses(
    RESPONSIVE_CLASSES.container,
    'bg-white rounded-lg shadow',
    RESPONSIVE_CLASSES.paddingMedium
  ),
  
  // Button components
  primaryButton: combineResponsiveClasses(
    'bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300',
    RESPONSIVE_CLASSES.buttonMedium,
    RESPONSIVE_CLASSES.radiusSmall,
    RESPONSIVE_CLASSES.shadowSmall
  ),
  
  secondaryButton: combineResponsiveClasses(
    'bg-gray-600 text-white font-semibold hover:bg-gray-700 transition-all duration-300',
    RESPONSIVE_CLASSES.buttonMedium,
    RESPONSIVE_CLASSES.radiusSmall,
    RESPONSIVE_CLASSES.shadowSmall
  ),
  
  // Input components
  input: combineResponsiveClasses(
    'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
  ),
  
  // Label components
  label: combineResponsiveClasses(
    'block text-sm font-medium text-gray-700 mb-1'
  ),
  
  // Section headers
  sectionHeader: combineResponsiveClasses(
    'text-center sm:text-left',
    RESPONSIVE_CLASSES.textXXLarge,
    'font-bold text-gray-900 mb-1 sm:mb-2'
  ),
  
  // Section descriptions
  sectionDescription: combineResponsiveClasses(
    'text-center sm:text-left',
    RESPONSIVE_CLASSES.textMedium,
    'text-gray-600'
  ),
  
  // Tab navigation
  tabNav: combineResponsiveClasses(
    'bg-white border-b border-gray-200 shadow-sm',
    RESPONSIVE_CLASSES.stickyTop
  ),
  
  // Tab button
  tabButton: combineResponsiveClasses(
    'py-3 lg:py-4 px-3 lg:px-6 border-b-2 font-medium whitespace-nowrap transition-all duration-300',
    RESPONSIVE_CLASSES.textSmall
  ),
  
  // Active tab button
  tabButtonActive: combineResponsiveClasses(
    'border-blue-500 text-blue-600 bg-blue-50'
  ),
  
  // Inactive tab button
  tabButtonInactive: combineResponsiveClasses(
    'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
  ),
  
  // Statistics card
  statsCard: combineResponsiveClasses(
    'bg-white rounded-lg shadow p-4 sm:p-6 lg:p-8 text-center'
  ),
  
  // Event card
  eventCard: combineResponsiveClasses(
    'bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group hover:scale-105'
  ),
  
  // Empty state
  emptyState: combineResponsiveClasses(
    'text-center py-8 sm:py-12 lg:py-16'
  ),
  
  // Empty state content
  emptyStateContent: combineResponsiveClasses(
    'bg-white rounded-xl sm:rounded-2xl shadow-lg',
    RESPONSIVE_CLASSES.paddingLarge,
    'max-w-md mx-auto'
  )
};

// Responsive breakpoint utilities
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Media query helpers
export const mediaQueries = {
  sm: `@media (min-width: ${BREAKPOINTS.sm})`,
  md: `@media (min-width: ${BREAKPOINTS.md})`,
  lg: `@media (min-width: ${BREAKPOINTS.lg})`,
  xl: `@media (min-width: ${BREAKPOINTS.xl})`,
  '2xl': `@media (min-width: ${BREAKPOINTS['2xl']})`
};

// Helper function to get responsive classes based on screen size
export const getResponsiveClasses = (baseClasses, responsiveClasses = {}) => {
  const classes = [baseClasses];
  
  Object.entries(responsiveClasses).forEach(([breakpoint, className]) => {
    if (className) {
      classes.push(`${breakpoint}:${className}`);
    }
  });
  
  return classes.join(' ');
};
