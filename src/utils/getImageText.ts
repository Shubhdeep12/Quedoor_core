import Tesseract from 'tesseract.js';

import logger from '../middlewares/logger';

const getImageText = async (imageUrl: string | Buffer) => {
  const worker = await Tesseract.createWorker('eng');
  let result: any;
  try {
    result = await worker.recognize(imageUrl);
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