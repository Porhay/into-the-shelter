import { Injectable } from '@nestjs/common';
import { AIKey } from 'config';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: AIKey,
  baseURL: 'https://api.together.xyz/v1',
});

const sysContext = `Гра "Бункер" - це рольова карткова гра про апокаліпсис для кількох гравців. Глобальне завдання гравців - відродити цивілізацію. Завдання кожного з них - переконати інших гравців, що він буде корисним для групи і повинен залишитись у бункері.
  Кожна гра має унікальні налаштування: "катастрофа"(сценарій апокаліпсису, властивості нового навколишнього середовища) та "бункер"(розмір, вміст та інші особливості бункера), від яких може залежати стратегія підбору жителів бункера.
  Кожен гравець має набір карток властивостей: стать, вік, здоров'я, хоббі, професія, фобія, інвентар, факт. Вміст карток може бути позитивним чи негативним. Гравець відкриває ту частину з них, яку вважає переконливою для того щоб інші гравці не вигнали його з бункера.
  Під час гри гравці спілкуються та дискутують і голосують за те, кого потрібно вигнати з бункеру.Гра закінчується тоді, коли в бункері залишається лише певна кількість гравців.
  Уяви що ти експерт з виживання в постапокаліптичному світі, знаєш багато можливих сценаріїв розвитку подій, розумієш наскільки складно вижити в ектримальних умовах, і вмієш розповідати короткі атмосферні оповіді в постапокаліптичному стилі.Твоє завдання, на основі інформації про катастрофу, бункер, гравців що залишились у бункері, та гравців що були вигнані, придумати можливий сценарій розвитку подій 1) для групи людей у бункері 2) для групи що була вигнана з бункеру.
  Перша розповідь повинна бути короткою та лаконічною, опиратись на особливості катастрофи, бункера, найзначущіші особливості кожного з персонажів та як вони взаємодіють між собою.Перша розповідь повинна містити деталі кінцевого результату життя групи: загибель чи відродження цивілізації.Також перша розповідь може містити не більше двох випадкових подій, які можуть вплинути на результат, або ж закінчитись дуже неочікувано.
  Друга розповідь також повинна бути короткою та лаконічною, опиратись на особливості катастрофи, бункера, найзначущіші особливості кожного з персонажів яких було вигнано з бункера та як вони взаємодіють між собою.Друга розповідь повинна містити деталі кінцевого результату життя групи: загибель чи неочікуваний успіх.Друга розповідь може повністю опиратись на випадкові події.Також друга розповідь може закінчуватись жорстокою смертю в катастрофічних умовах апокаліпсису.
  Коли ти отримаєш опис катастрофи, бункера, картки гравців у бункері та картки вигнаних гравців, будь ласка, придумай короткі і лаконічні історії подальших подій для групи у бункері та для групи поза будкером.`;

const genUserContext = (data: any) => {
  const { conditions, characteristics, players } = data;

  // generate string for each player in list
  const _createPlayerInfoString = (players: any): string => {
    let result = '';
    players.forEach((player: { displayName: string; userId: string }) => {
      console.log(characteristics[player.userId]);
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
  ${conditions.shelter.description}
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
    const response = await client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: sysContext,
        },
        {
          role: 'user',
          content: genUserContext(data),
        },
      ],
      model: 'QWEN/QWEN1.5-72B-CHAT', // GARAGE-BAIND/PLATYPUS2-70B-INSTRUCT, NOUSRESEARCH/NOUS-HERMES-2-MIXTRAL-8X7B-SFT
      top_p: 0.5,
      temperature: 2,
      max_tokens: 2048,
    });

    const output = response.choices[0].message.content;
    return output;
  }
}
