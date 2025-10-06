import { formatDistanceToNowStrict, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatPostDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;

  if (now.getTime() - date.getTime() > oneWeekInMilliseconds) {
    return format(date, "dd/MMM/yyyy", { locale: ptBR });
  }

  const distance = formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: ptBR,
  });

  return distance.replace("atrás", "há");
};
