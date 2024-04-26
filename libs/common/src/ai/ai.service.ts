import { Injectable } from '@nestjs/common';
import { AIKey, AIModels } from 'config';
import { constants } from '@app/common';
import { getRandomIndex, extractJustificationInfo } from 'helpers';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: AIKey,
  baseURL: 'https://api.together.xyz/v1',
});

// generate string for each player in list
const _genPlayerInfo = (
  characteristics: any,
  players: any,
  removeRevealed: boolean = false,
): string => {
  let result = '';
  players.forEach((player: { displayName: string; userId: string }) => {
    let playerInfo: string = '';
    if (removeRevealed) {
      const availableChars = characteristics[player.userId].filter(
        (ch: { isRevealed: boolean }) => !ch.isRevealed,
      );
      // Construct playerInfo based on availableChars
      availableChars.forEach((ch: { type: string; text: string }) => {
        switch (ch.type) {
          case 'gender':
            playerInfo += `Стать: ${ch.text}\n`;
            break;
          case 'health':
            playerInfo += `  Здоров'я: ${ch.text}\n`;
            break;
          case 'hobby':
            playerInfo += `  Хоббі: ${ch.text}\n`;
            break;
          case 'job':
            playerInfo += `  Професія: ${ch.text}\n`;
            break;
          case 'phobia':
            playerInfo += `  Фобія: ${ch.text}\n`;
            break;
          case 'backpack':
            playerInfo += `  Інвентар: ${ch.text}\n`;
            break;
          case 'fact':
            playerInfo += `  Додаткова інформація: ${ch.text}\n`;
            break;
        }
      });
    } else {
      playerInfo = `
  Гравець ${player.displayName}
  Стать: ${characteristics[player.userId].find((_) => _.type === 'gender').text}
  Здоров'я: ${characteristics[player.userId].find((_) => _.type === 'health').text}
  Хоббі: ${characteristics[player.userId].find((_) => _.type === 'hobby').text}
  Професія: ${characteristics[player.userId].find((_) => _.type === 'job').text}
  Фобія: ${characteristics[player.userId].find((_) => _.type === 'phobia').text}
  Інвентар: ${characteristics[player.userId].find((_) => _.type === 'backpack').text}
  Додаткова інформація: ${characteristics[player.userId].find((_) => _.type === 'fact').text}
  `;
    }
    result += playerInfo;
  });
  return result;
};
const genPredictionUserContext = (data: any) => {
  const { conditions, characteristics, players } = data;

  const survivedPlayers = players.filter(
    (player: { isKicked: boolean }) => !player.isKicked,
  );
  const kickedPlayers = players.filter(
    (player: { isKicked: boolean }) => player.isKicked,
  );

  const context = `
  Гравці яких було обрано щоб залишитись в укритті:
  ${_genPlayerInfo(characteristics, survivedPlayers)}
  
  Гравці яких було вигнано з бункеру:
  ${_genPlayerInfo(characteristics, kickedPlayers)}
  
  Бункер: ${conditions.shelter.name}
  ${conditions.shelter.description}

  Катастрофа: ${conditions.catastrophe.name}
  ${conditions.catastrophe.description}
  `;

  return context;
};

const genJustificationUserContext = (data: any) => {
  const { conditions, characteristics, player } = data;

  const context = `
  Уяви що ти 
  ${_genPlayerInfo(characteristics, [player], true)}
  , персонаж з страшного, темного, реалістичного, та дуже цікавого світу в якому стається апокаліпсис:

  Катастрофа: ${conditions.catastrophe.name}
  ${conditions.catastrophe.description}

  Бункер: ${conditions.shelter.name}
  ${conditions.shelter.description}

  Той, хто не потрапить в бункер - неминуче помре страшною смертю. Але і ті хто потрапить можуть не вижити, тому потрібно обрати правильних людей для виживання і продовження людського роду. А решта - будуть залишені на призволяще. В повітрі напруга, страх і безнадійність. Кожен хоче переконати людей в своїй корисності в бункері, щоб вижити. Ти ризикуєш не потрапити в бункер і загинути в муках. Ти дуже персонаж з дуже особливим характером. Що ти скажеш людям? Ти маєш дійсно вразити їх.
  Вибери дві характеристики гравця, напиши їх, та напиши свій аргумент в 1-2 реченнях. Пиши розмовною мовою і коротко, ніби це швидкий діалог.
  Використай такий формат:
  Характеристики: характеристика 1, характеристика 2.
  Аргумент: тест аргументу.
  `;

  return context;
};

@Injectable()
export class AIService {
  constructor() {}
  async generatePrediction(data: {
    conditions: any;
    characteristics: any;
    players: any;
  }) {
    try {
      const randomModel = AIModels[getRandomIndex(AIModels.length)];
      const response = await client.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: constants.predictionSysContext,
          },
          {
            role: 'user',
            content: genPredictionUserContext(data),
          },
        ],
        model: randomModel,
        top_p: 0.25,
        temperature: 1.5,
        max_tokens: 2048,
      });
      const output = response.choices[0].message.content;
      // model subscription
      const modelSub = `\nModel: ${randomModel}`;
      const result = output + modelSub;
      return result;
    } catch (e) {
      console.log(e);
      return 'No data';
    }
  }

  async generateJustification(data: {
    conditions: any;
    characteristics: any;
    player: any;
  }) {
    try {
      const response = await client.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: constants.justificationSysContext,
          },
          {
            role: 'user',
            content: genJustificationUserContext(data),
          },
        ],
        model: 'NOUSRESEARCH/NOUS-HERMES-2-MIXTRAL-8X7B-SFT',
        top_p: 0.25,
        temperature: 1.5,
        max_tokens: 2048,
      });
      const output = response.choices[0].message.content;
      const result = extractJustificationInfo(output);
      return result;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
