import en from '../../locales/en.json';
import de from '../../locales/de.json';
import { NextRouter, useRouter } from 'next/router';

let router: NextRouter;
const useTranslation = () => {
  router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : de;
  return t;
};

const changeLocale = (locale: string) => {
  document.cookie = `NEXT_LOCALE=${locale}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
  router.push(router.asPath, undefined, { locale });
};

const switchLocale = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  const button: HTMLElement = e.currentTarget;
  let locale = button.getAttribute('value');
  if (!locale || locale.trim().length === 0) {
    locale = 'en';
  }
  changeLocale(locale);
};

export { useTranslation, switchLocale, changeLocale };
