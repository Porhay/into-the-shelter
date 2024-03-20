import * as crypto from 'crypto';
import * as fs from 'fs';

export const generateSixSymbolHash = (): string => {
  const hash = crypto.randomBytes(20).toString('hex');
  return hash.substring(0, 6).toUpperCase();
}

export const generateCharList = (): any[] => {
  let jsonData: { [x: string]: any; }
  try {
    const data = fs.readFileSync('./characteristics.json', 'utf8')
    jsonData = JSON.parse(data)
  } catch (error) {
    console.log(`ERROR: ${error}`)
  }

  const getRandomChar = (data: any, type: string) => {
    if (type === 'gender') {
      const reandomIndex = Math.floor(Math.random() * 2);
      return ['Чоловік', 'Жінка'][reandomIndex]
    }
    const charsByType = data[type]
    const randomIndex = Math.floor(Math.random() * charsByType.length);
    return charsByType[randomIndex];
  }

  const charList = [
    { type: 'gender', text: getRandomChar(jsonData, 'gender') },
    { type: 'health', text: getRandomChar(jsonData, 'health') },
    { type: 'hobby', text: getRandomChar(jsonData, 'hobby') },
    { type: 'job', text: getRandomChar(jsonData, 'job') },
    { type: 'phobia', text: getRandomChar(jsonData, 'phobia') },
    { type: 'backpack', text: getRandomChar(jsonData, 'backpack') },
    { type: 'fact', text: getRandomChar(jsonData, 'fact') },
  ]

  return charList;
}
