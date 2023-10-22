import { createWorker } from 'tesseract.js';

import logger from '../middlewares/logger';

const getImageText = async (image_url: String) => {
  const worker = await createWorker('eng');
  let result: any;
  try {
    result = await worker.recognize(image_url);
    return result.data.text;
  } catch (error) {
    logger.error('not able to get image text');
    return "";
  } finally {
    // console.log(result.data.text);
    await worker.terminate();
  }
};

export default getImageText;