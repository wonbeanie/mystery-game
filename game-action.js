// 3개를 제외할수 있는 힌트가 나와야됨
function generateHint(type, coreHint = false){
  const hint_type = getRandomArray(["grapheme", "word-order"]);

  if(hint_type === "grapheme"){
    return getGraphemeHint(type, coreHint);
  }
  else if(hint_type === "word-order") {
    return getWordOrderHint(type, coreHint);
  }
}


function correctSend(){
  const area = document.getElementById("area").value;
  const place = document.getElementById("place").value;
  const suspect = document.getElementById("suspect").value;

  let playerCorrect = {area, place,suspect};

  let correctCount = 0;

  Object.keys(correct).forEach((key)=>{
    if(correct[key] === playerCorrect[key]){
      correctCount += 1;
    }
  });

  if(correctCount === 3){
    alert("정답!!!!")
    return;
  }

  // viewComputerAnswer(`Turn ${turn}. 정답을 ${correctCount}개 맞았어요. (${area},${place},${suspect})`);
  viewComputerAnswer(`Turn ${turn}`);

  let type = getRandomArray(Object.keys(gameData));

  if(turn === 4){
    const hint = generateHint(type, true);

    gameData[type].hint.correctAnswerList = hint.correctAnswerList;

    finishTrun(hint);
    confirmation = type;
    createPotion();
    return;
  }

  if(turn > 4 && turn <= 6){
    const hint = getPositionHint();
    finishTrun(hint);
    return;
  }

  if(turn === 7){
    alert(`추리 실패... (${getPlayTime()})\n정답은 : ${correct.area},${correct.place},${correct.suspect} 입니다.`);
    return;
  }

  let restList = [];

  Object.keys(gameData).forEach((key)=>{
    if(!gameData[key].hint.check){
      restList.push(key);
    }
  });

  type = getRandomArray(restList);

  gameData[type].hint.check = true;

  const hint = generateHint(type);

  gameData[type].hint.correctAnswerList = hint.correctAnswerList;

  finishTrun(hint);
}

function finishTrun(hint){
  viewComputerAnswer(`Hint : ${hint.text}`);

  turn += 1;
}