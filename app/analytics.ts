declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: any[];
    gtag: Gtag.Gtag;
  }
}

export const initializeAnalyticsQueue = (): void => {
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args) => window.dataLayer.push(args);
  gtag('js', new Date());

  gtag('config', 'G-JCVHJC2QCF', {
    client_storage: 'none',
    send_page_view: false,
  });
};

export const loadAnalyticsScript = (): void => {
  const script = document.createElement('script');
  const existingScript = document.getElementsByTagName('script')[0];
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA}`;
  existingScript.parentNode.insertBefore(script, existingScript);
};

export const trackPageView = (url: string): void => {
  gtag('event', 'page_view', {
    page_path: `/${url}`,
  });
};
