import '../src/config';
import cloudinary from 'cloudinary';
import { createClient } from 'contentful-management';
import { readdirSync } from 'fs';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENT_MANAGEMENT_API_KEY,
});

const uploadLogo = (name: string): Promise<string> =>
  new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      name,
      {
        folder: 'buzzwordquiz',
      },
      (err, callResult) => {
        if (err) {
          return reject(err);
        }
        return resolve(callResult.secure_url);
      },
    );
  });

(async () => {
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
  const env = await space.getEnvironment('master');
  const files = readdirSync('./logos');
  for await (const file of files) {
    console.log(file);
    const name = file.split('.')[0].toLowerCase();
    const image = await uploadLogo(`./logos/${file}`);
    await env.createEntry('question', {
      fields: {
        answer: { 'en-US': name },
        logo: {
          'en-US': image,
        },
      },
    });
  }
})()
  .then(console.log)
  .catch(console.error);
