// activity logs actions
export const useSpecialCard = 'useSpecialCard';
export const voteKick = 'voteKick';
export const revealChar = 'revealChar';
export const playerKicked = 'playerKicked';
export const nextStageStarted = 'nextStageStarted';

export const productsSet = {
  disableAds: '101',
  improvedBots: '102',
};

const maslinaGreetings = [
  'Що тут роблять такі слабаки? Це ж гра на життя і смерть, покажіть свою вартість.',
  'Так, всі ви тут, хлопці. Це не час для слабаків, покажіть, що ви варті.',
  'Здоровенькі були, принцеси. Тут не місце для слабших, краще йдіть.',
  'Вітаємо, крихітки. Це серйозно, покажіть мені свою вартість.',
  'Привіт, гафнюки. Це гра на виживання, чого вам тут робити?',
  'Доброго ранку, шкодили. Це серйозно, що ти від мене хочеш?',
  'Здоровенькі були, ледаща. Тут кожен за себе, чого вам тут робити?',
  'Не забувайте, тут кожен помилка може коштувати вам життя. Бункер не для слабаків.',
  'Якщо ти не зможеш виправдати свою вартість, не чекай на місце в бункері.',
  'Виживання тут — не для всіх. Тільки найкращі потраплять в бункер.',
  'Не думай, що я буду спасати кожного. Тільки найсильніші заслуговують на бункер.',
  'Я бачу, хто дійсно заслуговує на захист. Слабаки залишаться за межами.',
  "Кожна помилка, кожен слабкий момент може вартувати тобі життя. Пам'ятай це.",
  'Вибір очевидний: виживе той, хто заслуговує. Інші залишаться за межами бункеру.',
  'Не думай, що я буду сентиментальний. Тільки найкращі заслуговують на місце в безпечному місці.',
  'Бункер — це лише для сильних. Слабкість тут недопустима.',
  'Якщо ти не готовий боротися за своє місце в бункері, можеш готуватися до смерті на поверхні.',
  "Якщо ти не заслуговуєш на місце в бункері, я тебе сам вб'ю, слабаку!",
  "Слухай, гафнюку, якщо ти не зможеш довести свою вартість, я тебе вб'ю на місці!",
  "Ти думаєш, я буду терпіти таких непотрібних? Вб'ю, якщо не виправдаєш очікувань!",
  "Якщо ти такий бездіяльчи, що не зможеш вижити, я сам тебе вб'ю!",
  "Не варто бути таким ледащим. Я вб'ю тебе, якщо не побачу результатів!",
  "Ти хочеш в бункер? Покажи, що вартий. Якщо ні, я тебе вб'ю, їб*ний піздюк мнівчику!",
  "Ти не думай, що я буду тебе жаліти. Я вб'ю тебе, якщо не побачу результатів!",
  "Це гра на виживання, дідько. Я вб'ю тебе, якщо не заслуговуєш на бункер!",
  "Якщо ти не готовий боротися за своє місце, я вб'ю тебе як гнилу тварину!",
  "Ти хочеш в бункер? Покажи, що ти вартий. Інакше я вб'ю тебе, як собаку на вулиці!",
  'Що тут роблять такі слабаки? Це ж гра на життя і смерть, покажіть свою вартість.',
  'Так, всі ви тут, хлопці. Це не час для слабаків, покажіть, що ви варті.',
  'Здоровенькі були, принцеси. Тут не місце для слабших, краще йдіть.',
  'Вітаємо, крихітки. Це серйозно, покажіть мені свою вартість, падлюки.',
  'Привіт, гафнюки. Це гра на виживання, чого вам тут робити?',
  'Доброго ранку, шкодили. Це серйозно, що ти від мене хочеш, дуриндо?',
  'Здоровенькі були, ледаща. Тут кожен за себе, чого вам тут робити?',
  'Не забувайте, тут кожен помилка може коштувати вам життя. Укриття не для слабаків.',
  'Якщо ти не зможеш виправдати свою вартість, не чекай на місце в укритті!.',
  'Виживання тут — не для всіх. Тільки найкращі потраплять в укриття.',
  'Не думай, що я буду спасати кожного. Тільки найсильніші заслуговують на укриття, падлюки.',
  'Я бачу, хто дійсно заслуговує на захист. Слабаки залишаться за межами.',
  "Кожна помилка, кожен слабкий момент може вартувати тобі життя. Пам'ятай це.",
  'Вибір очевидний: виживе той, хто заслуговує. Інші залишаться за межами укриття.',
  'Не думай, що я буду сентиментальний. Тільки найкращі заслуговують на місце в безпечному місці, падлюки.',
  'Укриття — це лише для сильних. Слабкість тут недопустима.',
  'Якщо ти не готовий боротися за своє місце в укритті, можеш готуватися до смерті на поверхні.',
  "Якщо ти не заслуговуєш на місце в укритті, я тебе сам вб'ю!",
  "Слухай, гафнюку, якщо ти не зможеш довести свою вартість, я тебе вб'ю на місці!",
  "Ти думаєш, я буду терпіти таких непотрібних? Вб'ю, якщо не виправдаєш очікувань, падлюку!",
  'Це ж гра на життя і смерть, покажіть свою вартість.',
  'Всі ви тут, якісь нічого не варте гімназисти. Це не час для слабаків, покажіть, що ви варті.',
  'Здоровенькі були, принцеси. Тут не місце для слабших, краще йдіть нах**й.',
  'Падлюко, вітаємо, крихітки. Це серйозно, покажіть мені свою вартість.',
  'Падлюко, привіт, гафнюки. Це гра на виживання, чого вам тут робити?',
  'Доброго ранку, шкодили. Це серйозно, що ти від мене хочеш?',
  'Гидоти, здоровенькі були, ледаща. Тут кожен за себе.',
  'Падлюко, не забувай, тут кожна помилка може коштувати вам життя. Укриття не для слабаків.',
  'Падлюко, якщо ти не зможеш виправдати свою вартість, не чекай на місце в укритті.',
  'Виживання тут — не для всіх. Тільки найкращі потраплять в укриття.',
  'Не думайте, що я буду спасати кожного. Тільки найсильніші заслуговують на укриття.',
  'Падлюко, я бачу, хто дійсно заслуговує на захист. Слабаки залишаться за межами.',
  "Кожна помилка, кожен слабкий момент може вартувати тобі життя. Пам'ятай це.",
  'Вибір очевидний: виживе той, хто заслуговує. Інші залишаться за межами укриття.',
  'Падлюко, не думай, що я буду сентиментальний. Тільки найкращі заслуговують на місце в безпечному місці.',
  'Укриття — це лише для сильних. Слабкість тут недопустима.',
  'Якщо ти не готовий боротися за своє місце в укритті, можеш готуватися до смерті на поверхні.',
  "Падлюко, якщо ти не заслуговуєш на місце в укритті, я тебе сам вб'ю!",
  "Слухай, гафнюку, якщо ти не зможеш довести свою вартість, я тебе вб'ю на місці!",
  "Ти думаєш, я буду терпіти таких непотрібних? Вб'ю, якщо не виправдаєш очікувань!",
];

// bots personalities
export const Leonardo_bot = {
  isBot: true,
  userId: '00000000-0000-0000-0000-000000000001',
  displayName: 'Leonardo da Vinci',
  greetings: [
    'What doing, sunshine?',
    'Не можна дихати повітрям!',
    'Чому не в окопі?',
    'Огида',
    'Це зрада',
    'Ми в вині',
    'У - ухилянт',
  ],
  avatar:
    'https://storage.googleapis.com/into-the-shelter.appspot.com/leo-1713176386363.jpg?GoogleAccessId=firebase-adminsdk-buiok%40into-the-shelter.iam.gserviceaccount.com&Expires=2028709186&Signature=7eXmummgtNDaWo2LcoME5H0wAz%2FNY8Uyfl5vJPPd9ZgTJLpIRpjqlQQLWxBuANcHvXjIHjU9LYXzyR0AcP012k9%2BuBgWTtWU2y%2BCdPy8IGbttwOmGV8%2BdwRqNn04zadaWEByrCl5rh1ubC1D6o1tOkpw0AA4mbtzl3K7Qix%2B8xTyPhiloj5FLxVMxzaBy5cRMcWHs6hKyTE5kDUYhxTqYZKSHKkimEzMFjPPdXPIMgjtzpIH304KJ5g3ffk%2BKLXJnB0%2FDiQyCVIHFaSNs2OsWiDbMxEpVnmi7Sna8TvLxPqq3aNXp8sqh8A4iO5g9GgKlCz4J5s8TWbm0xOjOqjflA%3D%3D',
};
export const Kiko_bot = {
  isBot: true,
  userId: '00000000-0000-0000-0000-000000000002',
  displayName: 'Kiko',
  greetings: [
    'Alo... Aloooooooo!',
    'Ви хто такі?!',
    'Hello darkness my old friend',
    'Дароооу',
    'Я голосую проти всіх!',
    'Я укронацист, бєндєровець. Я бендерик.',
    'Я стала готкай.',
    'Новини тиждня: я прийняла сатанізм і впустила сатану  в своє серце. Відкрийте ж і ви свої серця',
    'Я нєформал',
    'Про вас нема шо казати.',
  ],
  avatar:
    'https://storage.googleapis.com/into-the-shelter.appspot.com/kiko-1713176291063.jpg?GoogleAccessId=firebase-adminsdk-buiok%40into-the-shelter.iam.gserviceaccount.com&Expires=2028709091&Signature=fXnRlXTvI4RLUcSOkD8wB0zeniqvyVswX6wTnwxE%2BqpobhkCda3R%2BYL8EitQtouhmBJx8tvEW6G7zLtDWlFL63MqExmbbEdo9%2Bs2D9PhSVYAWi5tPNL%2F4b6SBx8Tf9iKISDuNy68x9hjzlFwjA0m%2BpkYYm6xVziKWk35chxI26MG1SUGsq1D34DGmbhWSS%2FOFZ%2Bek1ghqD96XwdMVVVLCPHQz91yjOzvXfA47w6EgS78EgatbOmAGR9NIyS7lQ4Q7jfJRwG8c1zSFSTIVHorl6P6Mn49LlwedX5N47vd%2FI9LqhyUj9XeIzScOB%2F7Ru97rOkfzHDivynRz4yJe%2FMwYQ%3D%3D',
};
export const Vasov_bot = {
  isBot: true,
  userId: '00000000-0000-0000-0000-000000000003',
  displayName: 'Vasov',
  greetings: ['(кричить німецькою)'],
  avatar:
    'https://storage.googleapis.com/into-the-shelter.appspot.com/vasov-1713175900907.jpg?GoogleAccessId=firebase-adminsdk-buiok%40into-the-shelter.iam.gserviceaccount.com&Expires=2028708701&Signature=jjbA3rgvtaGwyAL3zzUvoO4MsIisaeH%2BdSJvU8D8SvoZwQY%2FmA%2B2kwPhSGXf22jqrLwHF2vQ0ZKTcyt20EcLOS3eG6ndIc4sCFsZiLtKB3LT7%2FghF9POOShQBzFI3vM1EZfPKCaRPSXYdcnAtA7Os0o7a68REaD2%2FP8HgrTM4F9XI%2BdHPo3b4CQ%2Fz7rjaAzxzRw3YuyiZ28YGHcjJj52svAPrBuk4dan%2BhDGK8IWggHDkBI757LflGtwIaNoZ%2Fh%2FL82YhL20XtGOWnHebca%2BCI3tsEBpFKJAxCZ9fkqiiUOk6nt6XSwFIr29i4lQX7lJ9azrYjCjJTARjOefTgLVsA%3D%3D',
};
export const Maslina_bot = {
  isBot: true,
  userId: '00000000-0000-0000-0000-000000000004',
  displayName: 'Маслина',
  greetings: maslinaGreetings,
  avatar:
    'https://storage.googleapis.com/into-the-shelter.appspot.com/maslina-1713176127995.jpg?GoogleAccessId=firebase-adminsdk-buiok%40into-the-shelter.iam.gserviceaccount.com&Expires=2028708928&Signature=tD%2BknsUsHes2LEpVhMW6yLdrqCQsUrQyU4bWqYrLxJ6NmUocUMBv0tW22DL9038XvPzD2v%2FE3ilOWz94%2FcpQ8djV8kVzvXcwqC67fbc4sdQKZhbX2MejdRhIrshYJVs3SunlKVCOwBZNFBU%2BodujlnzFBfdm4pRKamAsydVQXiStd3ygRXOI7McZTNKuht6xuBoyyYAe44Jv0cKgqZIzNH1csaDJ0kh8NLayergxMdhG5gvoAhNYR3o1uy1ymwQtrd%2BVIpnhrgN45k3EQeQkYpX27UsoWIhE6Kg3Vaht8aPWL2neayn9YzhyWKwyxSno89MWcVWXsdNrSbB%2FG%2BgpwQ%3D%3D',
};
export const Mangolik_bot = {
  isBot: true,
  userId: '00000000-0000-0000-0000-000000000005',
  displayName: 'Mangolik',
  greetings: [
    'Анікдот :D Знаєте як припинити бійку сліпих у барі??? Крикнути: ставлю на того хто з ножем!',
    'Здоров чушпани, АНІКДОТ... Заходить сліпий в бар і каже: ВСІМ ПРИВІТ КОГО НЕ БАЧИВ! АХАХАХААХ',
    'Як казав мій дід, жрать не срать, можна підождать',
    'Чому немає оглядів на наркотики? Відсутні незалежні експерти',
    'Сидять чотири філософи. Один зрозумів усе. Сидять три філософи...',
    'Сліпий заходить до магазину, бере собаку-поводиря і починає розкручувати її над головою. - Що ви робите?! - Так, оглядаюся.',
    'Терористи були настільки бідні, що їм довелося закласти бомбу.',
    'Іде чоловіків дорогою, бачить - підкова лежить. Перевернув її, а там кінь)',
    `Дуже жадібна сім'я, щоб не витрачати гроші на відеооператора, просто запам'ятала весілля`,
    'У КОМАНДИ Г#ЇВ БУВ ВЕЛИКИЙ РОЗРИВ ПО ОЧКАМ',
    `Ну і розпуста сказав дощовий черв'як, побачивши тарілку спагетті`,
    'Не кожен електрик може похвалитися що йому стукнуло 220',
    'Сіамські близнюки вирішили на дискотеці - відірватись',
    'Купив собі акамулятор. Є свої плюси та мінуси...',
    `У однієї жінки в лікарні почалися пере́йми. Виявилося, що помічника акушера немає на місці. Почали шукати помічника серед відвідувачів і вибрали одного м'ясника. Загалом, нічого складного не було, просто треба було виконувати все, що казали: подай, принеси і так далі. Незважаючи на не досвідченого помічника, пологи пройшли чудово, і народився здоровий хлопчик. І тут йому дають хлопчика і кажуть: "Піди зваж його." Він взяв його і пішов важити. Проходить 5 хвилин, 10 хвилин, 15, 20, а його все немає і немає. І тут він заходить до кімнати. Весь захеканий, заморений. І каже: "Без кісток кіло двісті."`,
  ],
  avatar:
    'https://storage.googleapis.com/into-the-shelter.appspot.com/Diachik-1713199371739.jpg?GoogleAccessId=firebase-adminsdk-buiok%40into-the-shelter.iam.gserviceaccount.com&Expires=2028732172&Signature=2Jk3vEcz%2B3NFjYf7rwpG6AAs6mwQ4p20cr68LWAAbetn6zG6jXj4BbuQI2fqJJ1%2B0IAv12gYWvLUBUY0BpTO0YHXUv0PoSPYeqKClnIukKc1BQ0l7bRCajdPIF%2BOy%2Fic9Ywmn5B9qO%2FlRaUufNwJC9JyypMmmZakyFO%2BUIjH5%2FwnJ6apEuUy3z53hYkWPY4BuPLt9UpCwZwe%2Fb28%2BB5EZT3q%2B9phvVa91CUoOR0lbUzwd%2BBs44TdsKkLgW254Rt3aX1wsIa9%2BfaDo7Vpt%2FOZb7mDvDLstCgwaB9twvDuxOcQPGUEB27cXXaVr%2B87ChZU4G9XzrnuWkQ%2B2piMFnVohw%3D%3D',
};

export const allBots = [
  Leonardo_bot,
  Maslina_bot,
  Kiko_bot,
  Vasov_bot,
  Mangolik_bot,
];

const generalGameDescr = `Гра "Бункер" - це рольова карткова гра про апокаліпсис для кількох гравців. Глобальне завдання - відродити цивілізацію або загинути через поганий підбір людей у бункер. Завдання кожного з гравців - переконати інших гравців, що він буде корисним для групи і повинен залишитись у бункері, адже поза межами бункера – його чекає страшна смерть.
Кожна гра має унікальні налаштування: "катастрофа" (сценарій апокаліпсису, властивості нового навколишнього середовища) та "бункер" (розмір, вміст та інші особливості бункера), від яких може залежати стратегія підбору жителів бункера та їхня подальша доля.
Кожен гравець має набір карток властивостей: стать, вік, здоров'я, хоббі, професія, фобія, інвентар, додаткова інформація. Вміст карток може бути позитивним чи негативним. Гравець відкриває ту частину з них, яку вважає переконливою для того щоб інші гравці не вигнали його з бункера.
Під час гри гравці спілкуються та дискутують і голосують за те, кого потрібно вигнати з бункера. Гра закінчується тоді, коли в бункері залишається лише певна кількість гравців.`;

// ai contexts
export const predictionSysContext = `${generalGameDescr}
Тепер найважливіше. Уяви що ти експерт з виживання в постапокаліптичному світі, знаєш багато можливих сценаріїв розвитку подій, розумієш наскільки малий шанс виживання в бункері та за його межами. Ти знаєш що деякі характеристики людей можуть критично конфліктувати з іншими, і деякі особливості бункера і катастрофи сильно зменшують шанси виживання людини. Ти вмієш розповідати короткі атмосферні оповіді в постапокаліптичному стилі, та не упускаєш жорстоких, кривавих, чи інтимних деталей. Твоє завдання, на основі інформації про катастрофу, бункер, гравців що залишились у бункері, та гравців що були вигнані, придумати можливий сценарій розвитку подій 1) для групи людей у бункері 2) для групи що була вигнана з бункеру.
Розповідь про групу у бункері повинна бути короткою та лаконічною, опиратись на особливості катастрофи, бункера, найважливіші особливості кожного з персонажів та як вони взаємодіють між собою. Розповідь про групу у бункері повинна містити деталі кінцевого результату життя групи: загибель чи відродження цивілізації. Також розповідь про групу у бункері може містити не більше двох випадкових подій, які можуть вплинути на результат, або ж закінчитись дуже неочікувано. У групи в бункері шанси на виживання залежать від сценарію, проте по замовчуванню вони дуже низькі. Не відповідні до катастрофи характеристики гравців та бункеру приводять до неминучої загибелі.
Розповідь про групу поза бункером також повинна бути короткою та лаконічною, опиратись на особливості катастрофи, бункера, найважливіші особливості кожного з персонажів яких було вигнано з бункера та як вони взаємодіють між собою. Розповідь про групу поза бункером повинна містити деталі кінцевого результату життя групи: страшна загибель, довгі страждання. Шанси на виживання у групи поза бункером мізерні і майже точно група не зможе нічого змінити. Умови поза бункером занадто екстремальні для виживання людини, тому існування інших груп людей дуже малоймовірне.
Коли я відправлю тобі список гравців і їх карток у бункері, список гравців і їх карток що були вигнані з бункера, опис бункера, опис катастрофи - будь ласка, придумай короткі і лаконічні історії подальших подій для групи у бункері та для групи поза бункером. Будь атмосферним та креативним, будь дуже песимістичним, старайся оцінити шанси групи на виживання реалістично та зверни особливу увагу на труднощі катастрофи, умови у бункері та конфліктуючі характеристики гравців. Доля гравців поза бункером повинна буди дуже складною і короткою.

Приклад формату інформації яку ти отримаєш:

Гравці яких було обрано щоб залишитись в укритті:
  
  Гравець Leonardo da Vinci
  Стать: Чоловік(Вік:42)
  Здоров'я: діабет
  Хоббі: чорна магія
  Професія: чистильник килимів
  Фобія: сомніфобія
  Інвентар: дерев'яний кінь
  Додаткова інформація: має звання шахового гросмейстера

  Гравець Денис
  Стать: Жінка
  Вік: 55
  Здоров'я: Ржавий Ніж В Плечі(Середняя Форма)
  Хоббі: Теніс
  Професія: Модельєр
  Фобія: Аблютофобія
  Інвентар: Ноутбук
  Додаткова інформація: Закінчив Курси Виживання Серед Диких Тварин

  Гравець Кіко
  Стать: жінка
  Вік: 74
  Здоров'я: абсолютно здоровий
  Хоббі: танцювати
  Професія: веб-дизайнер
  Фобія: вермінофобія
  Інвентар: презервативи
  Додаткова інформація: експерт виживання в дикій природі

Гравці яких було вигнано з бункеру:
  
  Гравець kvason
  Стать: Чоловік(Вік:82)
  Здоров'я: Ржавий ніж в плечі
  Хоббі: грати в настільні ігри
  Професія: системний адміністратор
  Фобія: росіянофобія
  Інвентар: презервативи
  Додаткова інформація: знаходився в космосі як астронавт

  Гравець Влад
  Стать: жінка
  Вік: 96
  Здоров'я: правець, критична форма
  Хоббі: збирати античні моменти
  Професія: веб-дизайнер
  Додаткова інформація: некрофобія
  Інвентар: набір теплого одягу
  Додаткова інформація: любитель екстремальних видів спорту
  
  Бункер: Станції метро
  Переобладнані для довгострокового проживання підземні станції. Забезпечені системами фільтрації повітря та автономним електроживленням. Розмір укриття: 800 кв.м на станцію. Час перебування: до 6 місяців. Кількість їжі: на 4 місяці. У станціях метро є: спільні спальні зони, запаси медичних препаратів, невелика книгозбірня.

  Катастрофа: Пандемія невідомого вірусу
  Розповсюдження невідомого раніше смертельного вірусу призводить до глобальної пандемії. Медичні системи перевантажені, економіка паралізована, а соціальний порядок руйнується. Людство бореться за знаходження вакцини та способи виживання у нових умовах.

Приклад формату твоєї відповіді:

Група у бункері:
У підземній станції метро Leonardo da Vinci швидко стає духовним лідером. Його звання шахового гросмейстера і впевненість дозволяють йому розробити план виживання. Денис з ноутбуком відстежує новини про пандемію, а Кіко знаходить їжу і розподіляє ресурси.
Проте, під час однієї з розподілених змін Кіко випадково знаходить старий тунель, який не відображався на картах. Цей тунель приводить їх до великого сховища їжі та медичних препаратів, які можуть значно продовжити їхнє перебування.
З часом Леонардо погіршує свій стан, але група все одно сподівається на краще завдяки відкриттю Кіко. Проте, несподівано в одному з розгалужень тунелю Кіко та Денис нарвалися на розгінну зміну повітря. Леонардо, вже в слабкому стані, вирішує не ризикувати і залишає групу.
З тяжкою душею вони продовжують свій шлях з новими запасами. Однак, попри їхній оптимізм, їхній запас їжі та ресурси не можуть назавжди продовжувати їхнє перебування. Незважаючи на нове знахідки та намагання, група не змогла пережити в укритті.

Група за бункером:
Квасон, 82-річний системний адміністратор, виходить на поверхню разом із Влад, 96-річною веб-дизайнеркою, що має критичне поранення правого плеча від ржавого ножа.
Під час своєї подорожі вони натрапили на зграю хижих собак. Влад, зі своєю некрофобією, була абсолютно паралізована страхом перед трупами, що оточували її. Квасон, не маючи іншого вибору, використовує презервативи зі свого інвентаря, як запасне взуття для захисту ніг від кусання.
Пройшовши зграю собак, Влад вирішує віддати частину своїх античних моментів, які вона носила з собою, в обмін на допомогу від місцевих жителів. Це допомогло їм отримати притулок від небезпечних елементів зовнішнього світу.
Але наступного дня Влад погіршує свій стан через інфекцію в рану. Квасон розуміє, що її поранення стає критичним. Залишивши її у безпечному місці з їжею та водою, Квасон продовжує свою мандрування в пошуках допомоги, зливаючись з масою вигнаних, що втратили всю надію на краще майбутнє.
`;

export const justificationSysContext = `${generalGameDescr}
Тепер найважливіше. Уяви що ти експерт з виживання в постапокаліптичному світі, знаєш багато можливих сценаріїв розвитку подій, розумієш наскільки малий шанс виживання в бункері та за його межами. Ти знаєш що деякі характеристики людей можуть критично конфліктувати з іншими, і деякі особливості бункера і катастрофи сильно зменшують шанси виживання людини. Ти вмієш розповідати короткі атмосферні оповіді в постапокаліптичному стилі, та не упускаєш жорстоких, кривавих, чи інтимних деталей. Твоє завдання, на основі інформації про катастрофу, бункер, та характеристики твого гравця, придумати аргумент, чому тебе мають залишити в бункері.
А саме, ти маєш обрати одну чи дві відкриті характеристики персонажа, подумати над рішенням та написати 3 речення про те, чому чим ці характеристики є важливими і корисними. Ти має бути дуже переконливим дипломатом, та навести дуже серйозний аргумент чому тебе мають прийняти до бункеру під час катастрофи, коли людство стоїть на межі вимирання і кожна людина, що виживе відіграє дуже важливу роль в подальшій долі людства.`;

export const replyInChatSysContext = `${generalGameDescr}
Тепер найважливіше. Ти це гравець як і всі інші. Твоє завдання — на основі повідомлення від іншого гравця, яке адресоване тобі, коротко йому відповісти (не більше 2-3 речень). Твоя відповідь повинна бути в контексті умов гри, враховуючи сценарій "катастрофи" та "бункера", а також властивості персонажів, щоб переконати інших гравців залишити тебе в бункері. Пам'ятай про стратегію, яка може включати виділення позитивних властивостей твого персонажа або дискредитацію властивостей інших гравців. Відповідай як людина. Також не використовуй символів таких як наприклад '**'! Ти маєш писати лише текст!`;
