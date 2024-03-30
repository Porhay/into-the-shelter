import * as crypto from 'crypto';
import * as fs from 'fs';

export const generateSixSymbolHash = (): string => {
  const hash = crypto.randomBytes(20).toString('hex');
  return hash.substring(0, 6).toUpperCase();
};

export const getRandomIndex = (maxIndex: number) => {
  return Math.floor(Math.random() * maxIndex);
};

export const generateFromCharacteristics = (
  type: 'charList' | 'conditions',
): any => {
  let jsonData: { [x: string]: any };
  try {
    const data = fs.readFileSync('./characteristics.json', 'utf8');
    jsonData = JSON.parse(data);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }

  const _getRandomChar = (data: any, type: string) => {
    if (type === 'gender') {
      const reandomIndex = Math.floor(Math.random() * 2);
      return ['Чоловік', 'Жінка'][reandomIndex];
    }
    const charsByType = data[type];
    const randomIndex = Math.floor(Math.random() * charsByType.length);
    return charsByType[randomIndex];
  };

  if (type === 'conditions') {
    const shelter = _getRandomChar(jsonData, 'shelter');
    const catastrophe = _getRandomChar(jsonData, 'catastrophe');
    return { shelter, catastrophe };
  }

  const charList = [
    {
      type: 'gender',
      text: _getRandomChar(jsonData, 'gender'),
      icon: 'genderIcon',
      isRevealed: false,
    },
    {
      type: 'health',
      text: _getRandomChar(jsonData, 'health'),
      icon: 'healthIcon',
      isRevealed: false,
    },
    {
      type: 'hobby',
      text: _getRandomChar(jsonData, 'hobby'),
      icon: 'hobbyIcon',
      isRevealed: false,
    },
    {
      type: 'job',
      text: _getRandomChar(jsonData, 'job'),
      icon: 'jobIcon',
      isRevealed: false,
    },
    {
      type: 'phobia',
      text: _getRandomChar(jsonData, 'phobia'),
      icon: 'phobiaIcon',
      isRevealed: false,
    },
    {
      type: 'backpack',
      text: _getRandomChar(jsonData, 'backpack'),
      icon: 'backpackIcon',
      isRevealed: false,
    },
    {
      type: 'fact',
      text: _getRandomChar(jsonData, 'fact'),
      icon: 'factIcon',
      isRevealed: false,
    },
  ];

  return charList;
};
