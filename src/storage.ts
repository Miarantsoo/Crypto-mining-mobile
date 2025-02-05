import { Storage } from '@ionic/storage';

const storage = new Storage({
  name: 'crypto-mining'
});

export const initializeStorage = async () => {
  await storage.create();  
  return storage;
};

export default storage;