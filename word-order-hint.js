// 문자열 정렬을 이용해서 구현
function getWordOrderHint(type, coreHint){
  let data = JSON.parse(JSON.stringify(gameData[type]));

  if(coreHint){
    let hint = data.grapheme[data.hint.correctAnswerList[1]][0];
    let text = "";

    switch(data.hint.correctAnswerList.indexOf(correct[type])){
      // 처음
      case 0 :
        text = `'${hint}'이전에 나옵니다.`
        break;

      // 중간
      case 1 :
        let firstHint = data.grapheme[data.hint.correctAnswerList[0]][0];
        let secondHint = data.grapheme[data.hint.correctAnswerList[2]][0];
        text = `'${firstHint}'와 ${secondHint}사이에 있습니다.`
        break;

      // 뒤
      case 2 :
        text = `'${hint}'이후에 나옵니다.`
        break;

      default:
        break;
    }

    return {
      text : `${transfromKorean[type]} 이름은 가나다 순으로 ${text}`,
      correctAnswerList : [correct[type]]
    }
  }

  data.origin.sort();

  const middle = Math.floor(data.origin.length / 2) - 1;

  const middleJaeum = data.grapheme[data.origin[middle]][0];
  const nextMiddleJaeum = data.grapheme[data.origin[middle + 1]][0]
  
  if(middleJaeum === nextMiddleJaeum){
    return getGraphemeHint(type);
  }

  const addIndex = getRandomIndex(JAEUM.indexOf(nextMiddleJaeum) - JAEUM.indexOf(middleJaeum) - 1) + 1;

  const hint = JAEUM[JAEUM.indexOf(middleJaeum) + addIndex];

  if(data.origin.indexOf(correct[type]) <= 2){
    
    return {
      text : `${transfromKorean[type]} 이름은 가나다 순으로 '${hint}'이전에 나옵니다.`,
      correctAnswerList : data.origin.slice(0, 3)
    }
  }

  return {
    text : `${transfromKorean[type]} 이름은 가나다 순으로 '${hint}'이후에 나옵니다.`,
    correctAnswerList : data.origin.slice(3, data.origin.length)
  }
}