import './src/config';
import appFunc from './src';
import { refreshLocalQuestionsCache } from './src/models/question';

setInterval(refreshLocalQuestionsCache, 10 * 60 * 1000);

const app = appFunc();
refreshLocalQuestionsCache()
  .then(() => app.listen(parseInt(process.env.PORT) || 3000, '0.0.0.0'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
