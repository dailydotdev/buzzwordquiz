import { DefaultSeoProps } from 'next-seo/lib/types';

const defaultSeo: DefaultSeoProps = {
  title: 'Buzzoword Quiz For Developers',
  description:
    'Buzzword Quiz is a spoof of the famous Logo Quiz app, but for developers. How much do you know about developer tools? Demonstrate what you know and earn a place in the Hall of Fame.',
  openGraph: {
    type: 'website',
    site_name: 'Buzzword Quiz',
    images: [
      {
        url: '/opengraph.jpg',
      },
    ],
  },
  twitter: {
    site: '@dailydotdev',
    cardType: 'summary_large_image',
  },
};

export default defaultSeo;
