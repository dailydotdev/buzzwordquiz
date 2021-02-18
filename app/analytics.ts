declare global {
  interface Window {
    gtag: Gtag.Gtag;
  }
}

export const trackPageView = (url: string): void => {
  gtag('config', process.env.NEXT_PUBLIC_GA, {
    client_storage: 'none',
    page_path: url,
  });
};
