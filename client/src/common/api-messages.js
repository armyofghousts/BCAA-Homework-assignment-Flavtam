const API_MESSAGE_CS = {
  "Category name already exists.": "Kategorie s tímto názvem už existuje.",
  "Category contains places and cannot be deleted.":
    "Kategorii nelze smazat, protože obsahuje místa.",
  "Category not found.": "Kategorie nenalezena.",
  "Category deleted.": "Kategorie byla smazána.",
  "Place not found.": "Místo nenalezeno.",
  "Place deleted.": "Místo bylo smazáno.",
  "Validation error": "Neplatná data ve formuláři.",
  "Internal server error.": "Chyba serveru.",
  "Unexpected response.": "Neočekávaná odpověď serveru.",
};

export function apiMessageCs(message, fallback) {
  if (!message || typeof message !== "string") {
    return fallback;
  }
  const trimmed = message.trim();
  return API_MESSAGE_CS[trimmed] ?? trimmed;
}

export function mapApiError(data, fallback) {
  if (!data) {
    return { message: fallback };
  }
  if (typeof data === "string") {
    return { message: apiMessageCs(data, fallback) };
  }
  const message = apiMessageCs(data.message, fallback);
  const details = Array.isArray(data.details)
    ? data.details.map((detail) => apiMessageCs(detail, detail))
    : undefined;
  return details ? { ...data, message, details } : { ...data, message };
}
