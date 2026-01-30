// Define our language codes
export type LanguageCode = 'en' | 'hi' | 'mr';

// This is our new, centralized "key-first" string object
export const allStrings = {
    // --- Strings from before ---
    welcome: {
        en: 'Welcome!',
        hi: 'स्वागत है!',
        mr: 'स्वागत आहे!',
    },
    submitReport: {
        en: 'Submit Report',
        hi: 'रिपोर्ट जमा करें',
        mr: 'अहवाल सादर करा',
    },
    myReports: {
        en: 'My Submitted Reports',
        hi: 'मेरे जमा किए गए रिपोर्ट',
        mr: 'माझे सादर केलेले अहवाल',
    },
    profile: {
        title: {
            en: 'Welcome',
            hi: 'स्वागत',
            mr: 'स्वागत',
        },
        role: {
            en: 'Role',
            hi: 'भूमिका',
            mr: 'भूमिका',
        },
        totalReports: {
            en: 'Total Reports',
            hi: 'कुल रिपोर्ट',
            mr: 'एकूण अहवाल',
        },
    },

    // --- NEW Strings from your Welcome Screen ---
    welcomeScreen: {
        title: {
            en: 'Welcome to CivicSync',
            hi: 'सिविकसिंक में आपका स्वागत है',
            mr: 'सिविकसिंकमध्ये आपले स्वागत आहे',
        },
        subtitle1: {
            en: 'The simplest way to get civic problems solved.',
            hi: 'नागरिक समस्याओं का समाधान पाने का सबसे सरल तरीका।',
            mr: 'नागरिक समस्या सोडवण्याचा सर्वात सोपा मार्ग.',
        },
        subtitle2: {
            en: 'Click The button below to get started!',
            hi: 'शुरू करने के लिए नीचे दिया गया बटन दबाएँ!',
            mr: 'सुरुवात करण्यासाठी खालील बटणावर क्लिक करा!',
        },
        getStartedButton: {
            en: 'Get Started',
            hi: 'शुरू करें',
            mr: 'सुरुवात करा',
        },
        learnMoreButton: {
            en: 'Learn More',
            hi: 'और जानें',
            mr: 'अधिक जाणून घ्या',
        },
    },
};

// --- We need a type to represent the *final* strings object ---
export interface TranslationStrings {
    // --- Strings from before ---
    welcome: string;
    submitReport: string;
    myReports: string;
    profile: {
        title: string;
        role: string;
        totalReports: string;
    };

    // --- NEW type for Welcome Screen ---
    welcomeScreen: {
        title: string;
        subtitle1: string;
        subtitle2: string;
        getStartedButton: string;
        learnMoreButton: string;
    };
}

// --- We also still need your list of languages for the picker ---
export const languages: { code: LanguageCode, name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'mr', name: 'मराठी' },
];



/*
usage guides

  const { strings, locale, setLocale } = useTranslations();


*/