TRANSLATIONS = {
    "en": {
        "greeting": "Welcome to DineroClaro",
    },
    "es": {
        "greeting": "Bienvenido a DineroClaro",
    },
}


def t(key: str, locale: str = "en") -> str:
    return TRANSLATIONS.get(locale, {}).get(key, key)
