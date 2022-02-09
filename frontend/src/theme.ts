// theme.ts

// 1. import `extendTheme` function
import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const colors = {
    brand: {
        50: '#ecefff',
        100: '#cbceeb',
        200: '#a9aed6',
        300: '#888ec5',
        400: '#666db3',
        500: '#4d5d99',
        600: '#3c4178',
        700: '#2a2f57',
        800: '#181c37',
        900: '#080819',
    },
};

const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
};

// 3. extend the theme
const theme = extendTheme({ colors, config });

export default theme;
