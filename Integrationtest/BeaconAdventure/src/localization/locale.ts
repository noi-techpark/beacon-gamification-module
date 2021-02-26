import i18n from "i18n-js";
import memoize from "lodash.memoize";
import { I18nManager } from "react-native";
import * as RNLocalize from "react-native-localize";

const translationGetters = {
    // lazy requires (metro bundler does not support symlinks)
    it: () => require("../../android/app/src/main/assets/translations/it.json"),
    de: () => require("../../android/app/src/main/assets/translations/de.json"),
    en: () => require("../../android/app/src/main/assets/translations/en.json"),
};

export const translate = memoize(
    (key, config?) => i18n.t(key, config),
    (key, config?) => (config ? key + JSON.stringify(config) : key),
);

export const setupI18nConfig = () => {
    // fallback if no available language fits
    const fallback = { languageTag: "en", isRTL: false };

    const { languageTag, isRTL } =
        RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
        fallback;

    // clear translation cache
    translate.cache.clear();
    // update layout direction
    I18nManager.forceRTL(isRTL);

    // set i18n-js config
    i18n.translations = { [languageTag]: translationGetters[languageTag]() };
    i18n.locale = languageTag;
};

export function getCurrentLocale() {
    return i18n.locale;
}