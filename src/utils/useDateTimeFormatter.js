export function useDateTimeFormatter(locale = "fr-FR", options = {}) {
    const defaultOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      ...options,
    };
  
    const formatDateTime = (dateTime) => {
      if (!dateTime) return "";
      const formatter = new Intl.DateTimeFormat(locale, defaultOptions);
      return formatter.format(new Date(dateTime));
    };
  
    return { formatDateTime };
}
