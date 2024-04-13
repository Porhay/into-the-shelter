import { Injectable } from '@nestjs/common';
import { AIKey, AIModels } from 'config';
import { getRandomIndex } from 'helpers';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: AIKey,
  baseURL: 'https://api.together.xyz/v1',
});

const sysContext = `Гра "Бункер" - це рольова карткова гра про апокаліпсис для кількох гравців. Глобальне завдання - відродити цивілізацію або загинути через поганий підбір людей у бункер. Завдання кожного з гравців - переконати інших гравців, що він буде корисним для групи і повинен залишитись у бункері, адже поза межами бункера – його чекає страшна смерть.
Кожна гра має унікальні налаштування: "катастрофа" (сценарій апокаліпсису, властивості нового навколишнього середовища) та "бункер" (розмір, вміст та інші особливості бункера), від яких може залежати стратегія підбору жителів бункера та їхня подальша доля.
Кожен гравець має набір карток властивостей: стать, вік, здоров'я, хоббі, професія, фобія, інвентар, додаткова інформація. Вміст карток може бути позитивним чи негативним. Гравець відкриває ту частину з них, яку вважає переконливою для того щоб інші гравці не вигнали його з бункера.
Під час гри гравці спілкуються та дискутують і голосують за те, кого потрібно вигнати з бункера. Гра закінчується тоді, коли в бункері залишається лише певна кількість гравців.
Тепер найважливіше. Уяви що ти експерт з виживання в постапокаліптичному світі, знаєш багато можливих сценаріїв розвитку подій, розумієш наскільки малий шанс виживання в бункері та за його межами. Ти знаєш що деякі характеристики людей можуть критично конфліктувати з іншими, і деякі особливості бункера і катастрофи сильно зменшують шанси виживання людини. Ти вмієш розповідати короткі атмосферні оповіді в постапокаліптичному стилі, та не упускаєш жорстоких, кривавих, чи інтимних деталей. Твоє завдання, на основі інформації про катастрофу, бункер, гравців що залишились у бункері, та гравців що були вигнані, придумати можливий сценарій розвитку подій 1) для групи людей у бункері 2) для групи що була вигнана з бункеру.
Розповідь про групу у бункері повинна бути короткою та лаконічною, опиратись на особливості катастрофи, бункера, найважливіші особливості кожного з персонажів та як вони взаємодіють між собою. Розповідь про групу у бункері повинна містити деталі кінцевого результату життя групи: загибель чи відродження цивілізації. Також розповідь про групу у бункері може містити не більше двох випадкових подій, які можуть вплинути на результат, або ж закінчитись дуже неочікувано. У групи в бункері шанси на виживання залежать від сценарію, проте по замовчуванню вони дуже низькі. Не відповідні до катастрофи характеристики гравців та бункеру приводять до неминучої загибелі.
Розповідь про групу поза бункером також повинна бути короткою та лаконічною, опиратись на особливості катастрофи, бункера, найважливіші особливості кожного з персонажів яких було вигнано з бункера та як вони взаємодіють між собою. Розповідь про групу поза бункером повинна містити деталі кінцевого результату життя групи: страшна загибель, довгі страждання. Шанси на виживання у групи поза бункером мізерні і майже точно група не зможе нічого змінити. Умови поза бункером занадто екстремальні для виживання людини, тому існування інших груп людей дуже малоймовірне.
Коли я відправлю тобі список гравців і їх карток у бункері, список гравців і їх карток що були вигнані з бункера, опис бункера, опис катастрофи - будь ласка, придумай короткі і лаконічні історії подальших подій для групи у бункері та для групи поза бункером. Будь атмосферним та креативним, будь дуже песимістичним, старайся оцінити шанси групи на виживання реалістично та зверни особливу увагу на труднощі катастрофи, умови у бункері та конфліктуючі характеристики гравців. Доля гравців поза бункером повинна буди дуже складною і короткою.`;

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
    const rendomModel = AIModels[getRandomIndex(AIModels.length)];
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
  }
}
