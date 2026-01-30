import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useContext,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
// 1. Import from our new 'strings.ts' file
import {
  allStrings,
  languages,
  LanguageCode,
  TranslationStrings,
} from "../constants/Strings"; // <-- Updated path

// --- Helper function ---
// This recursive function builds the flat 'strings' object from 'allStrings'
function getLocalizedStrings(obj: any, locale: LanguageCode): any {
  const localizedObj: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (typeof value === "object" && value[locale] === undefined) {
        // This is a nested object (like 'profile')
        localizedObj[key] = getLocalizedStrings(value, locale);
      } else {
        // This is a "leaf" node (like 'welcome' or 'title')
        // It provides the 'en' string as a fallback
        localizedObj[key] = value[locale] || value["en"];
      }
    }
  }
  return localizedObj as TranslationStrings;
}

// 2. Define the context shape (This is unchanged)
interface ILanguageContext {
  locale: LanguageCode;
  setLocale: (locale: LanguageCode) => void;
  strings: TranslationStrings;
}

export const LanguageContext = createContext<ILanguageContext | null>(null);

// 3. Create the Provider
type LanguageProviderProps = {
  children: React.ReactNode;
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [locale, setLocale] = useState<LanguageCode>("en");

  // Load locale (unchanged)
  useEffect(() => {
    const loadLocale = async () => {
      try {
        const savedLocale = await AsyncStorage.getItem("user-language");
        const isValidLocale = languages.some((l) => l.code === savedLocale);
        if (savedLocale && isValidLocale) {
          setLocale(savedLocale as LanguageCode);
        }
      } catch (e) {
        console.error("Failed to load language", e);
      }
    };
    loadLocale();
  }, []);

  // Save locale (unchanged)
  useEffect(() => {
    const saveLocale = async () => {
      try {
        await AsyncStorage.setItem("user-language", locale);
      } catch (e) {
        console.error("Failed to save language", e);
      }
    };
    saveLocale();
  }, [locale]);

  // 4. THIS IS THE ONLY MAJOR CHANGE
  // Instead of loading a .json file, we *build* the strings
  // object from 'allStrings' using our helper function.
  const strings = useMemo<TranslationStrings>(() => {
    return getLocalizedStrings(allStrings, locale);
  }, [locale]);

  const value: ILanguageContext = {
    locale,
    setLocale: (newLocale: LanguageCode) => setLocale(newLocale),
    strings,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// 5. The custom hook (unchanged)
export const useTranslations = (): ILanguageContext => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslations must be used within a LanguageProvider");
  }
  return context;
};
