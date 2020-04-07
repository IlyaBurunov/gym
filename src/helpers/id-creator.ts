const enL = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z'
];
const enU = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z'
];

enum CharacterType {
  Number,
  LowercaseLetter,
  UppercaseLetter
}

const getRandomNum = (max: number) => Math.floor(Math.random() * Math.floor(max));

export const getNewId = (createdIds?: string[]): string => {
  const idLength = 9;
  let id = '';
  for (let i = 0; i < idLength; i++) {
    const characterType = getRandomNum(3);
    switch (characterType) {
      case CharacterType.Number:
        id = id + getRandomNum(10);
        break;
      case CharacterType.LowercaseLetter:
        id = id + enL[getRandomNum(26)];
        break;
      case CharacterType.UppercaseLetter:
        id = id + enU[getRandomNum(26)];
        break;
    }
  }

  if (createdIds?.includes(id)) {
    return getNewId(createdIds);
  }
  return id;
};

export const idCreator = (data: any[]) => {
  const createdIds: string[] = [];
  return data.map(item => {
    const newId = getNewId(createdIds);
    createdIds.push(newId);
    return {
      ...item,
      id: newId
    };
  });
};
