import { Injectable } from '@nestjs/common';
import { AIKey, AIModels } from 'config';
import { constants } from '@app/common';
import { getRandomIndex } from 'helpers';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: AIKey,
  baseURL: 'https://api.together.xyz/v1',
});

const genUserContext = (data: any) => {
  const { conditions, characteristics, players } = data;

  // generate string for each player in list
  const _createPlayerInfoString = (players: any): string => {
    let result = '';
    players.forEach((player: { displayName: string; userId: string }) => {
      const playerInfo = `
  Гравець ${player.displayName}
  Стать: ${characteristics[player.userId].find((_) => _.type === 'gender').text}
  Здоров'я: ${characteristics[player.userId].find((_) => _.type === 'health').text}
  Хоббі: ${characteristics[player.userId].find((_) => _.type === 'hobby').text}
  Професія: ${characteristics[player.userId].find((_) => _.type === 'job').text}
  Фобія: ${characteristics[player.userId].find((_) => _.type === 'phobia').text}
  Інвентар: ${characteristics[player.userId].find((_) => _.type === 'backpack').text}
  Додаткова інформація: ${characteristics[player.userId].find((_) => _.type === 'fact').text}
`;
      result += playerInfo;
    });
    return result;
  };

  const survivedPlayers = players.filter(
    (player: { isKicked: boolean }) => !player.isKicked,
  );
  const kickedPlayers = players.filter(
    (player: { isKicked: boolean }) => player.isKicked,
  );

  const context = `
  Гравці яких було обрано щоб залишитись в укритті:
  ${_createPlayerInfoString(survivedPlayers)}
  
  Гравці яких було вигнано з бункеру:
  ${_createPlayerInfoString(kickedPlayers)}
  
  Бункер: ${conditions.shelter.name}
  ${conditions.shelter.description}

  Катастрофа: ${conditions.catastrophe.name}
  ${conditions.catastrophe.description}
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
      const rendomModel = AIModels[getRandomIndex(AIModels.length)];
      const response = await client.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: constants.predictionSysContext,
          },
          {
            role: 'user',
            content: genUserContext(data),
          },
        ],
        model: rendomModel,
        top_p: 0.25,
        temperature: 1.5,
        max_tokens: 2048,
      });
      const output = response.choices[0].message.content;
      // model subscription
      const modelSub = `\nModel: ${rendomModel}`;
      const result = output + modelSub;
      return result;
    } catch (e) {
      console.log(e);
      return 'No data';
    }
  }
}
