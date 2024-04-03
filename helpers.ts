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
  type: 'charList' | 'conditions' | 'specialCard',
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

  if (type === 'specialCard') {
    const specialCardObj1 = _getRandomChar(jsonData, 'specialCard');
    const filteredJsonData = jsonData['specialCard'].filter(
      (sc) => sc.id !== specialCardObj1,
    ); // remove to avoid dublicates in one user

    const randomIndex = Math.floor(Math.random() * filteredJsonData.length);
    const specialCardObj2 = filteredJsonData[randomIndex];

    const res = [
      {
        type: 'specialCard1',
        text: specialCardObj1.text,
        id: specialCardObj1.id,
        isUsed: false,
      },
      {
        type: 'specialCard2',
        text: specialCardObj2.text,
        id: specialCardObj2.id,
        isUsed: false,
      },
    ];
    return res;
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

export const countOccurrences = (arr: string[]) => {
  const counts = {};
  arr.forEach((id: string) => {
    counts[id] = (counts[id] || 0) + 1;
  });
  return counts;
};

export const getKeysWithHighestValue = (obj: object) => {
  let maxCount = -Infinity;
  let keysWithMaxCount = [];

  // Find the maximum count
  for (const key in obj) {
    const count = obj[key];
    if (count > maxCount) {
      maxCount = count;
      keysWithMaxCount = [key];
    } else if (count === maxCount) {
      keysWithMaxCount.push(key);
    }
  }

  return keysWithMaxCount;
};
