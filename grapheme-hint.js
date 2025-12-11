// 받침 유무, 특정 자음 포함, 특정 모음 포함
function getGraphemeHint(type, coreHint){
  let data = JSON.parse(JSON.stringify(gameData[type]));
  let noCorrect = JSON.parse(JSON.stringify(data.noCorrect));
  let correctAnswerList = [correct[type]];

  let hitSelectCount = 0;

  if(coreHint){
    const correctAnswerList = data.hint.correctAnswerList;
    data.origin = JSON.parse(JSON.stringify(correctAnswerList));
    noCorrect = correctAnswerList.filter(
      (_, index) => {
        return index !== correctAnswerList.indexOf(correct[type])
      }
    )
  }

  // 받침 유무
  let batchimCheck = noCorrect.some((name)=>{
    if(hasBatchim(name)){
      hitSelectCount += 1;
      correctAnswerList.push(name);

      if(hitSelectCount > 2){
        return true;
      }
    }
  });

  if(!batchimCheck && hitSelectCount < 2){
    const text = hasBatchim(correct[type]) ? `있습니다.` : "없습니다.";
    return {
      text : `${transfromKorean[type]} 이름 글자에 받침이 ` + text,
      correctAnswerList
    };
  }

  // 특정 자음, 모음 포함
  hitSelectCount = 0;
  let hintGrapheme = "";
  let pairGrapheme = [];
  correctAnswerList = [correct[type]];

  let graphemeCheck = data.grapheme[correct[type]].some((correctGrapheme)=>{
    hintGrapheme = "";
    hitSelectCount = 0;
    correctAnswerList = [correct[type]];

    if(!coreHint){
      noCorrect.forEach((name)=>{
        if(data.grapheme[name].includes(correctGrapheme)){
          hitSelectCount += 1;
          hintGrapheme = correctGrapheme;
          correctAnswerList.push(name);
        }
      });

      if(hitSelectCount == 2){
        return true;
      }
      else if(hitSelectCount == 1){
        pairGrapheme.push(correctGrapheme);
      }
    }
    else {
      data.hint.correctAnswerList.forEach((name)=>{
        if(name === correct[type]){
          return;
        }
        if(data.grapheme[name].includes(correctGrapheme)){
          hitSelectCount += 1;
          hintGrapheme = correctGrapheme;
          correctAnswerList.push(name);
        }
      });

      if(hitSelectCount === 0){
        hintGrapheme = correctGrapheme
        return true;
      }
    }
  });

  noCorrect.some((name)=>{
    const find = data.grapheme[name].some((grapheme)=>{
      let findCorrect = data.grapheme[correct[type]].some((correctGrapheme)=>{
        if(correctGrapheme === grapheme){
          return true;
        }
      });

      if(!pairGrapheme.includes(grapheme) && findCorrect){
        lastHint = grapheme;
        return true;
      }
    })

    if(find){
      return true;
    }
  })

  if(graphemeCheck){
    return {
      text : `${transfromKorean[type]} 이름 글자에 '${hintGrapheme}'이 들어갑니다.`,
      correctAnswerList
    };
  }

  correctAnswerList = [correct[type]];

  pairGrapheme.forEach((grapheme)=>{
    noCorrect.forEach((name)=>{
      if(data.grapheme[name].includes(grapheme)){
        correctAnswerList.push(name);
      }
    });
  });

  if(pairGrapheme.length < 2){
    return {
      text : `${transfromKorean[type]} 이름 글자에 '${pairGrapheme[0]}'이 들어갑니다.`,
      correctAnswerList
    };
  }

  return {
    text : `${transfromKorean[type]} 이름 글자에 '${pairGrapheme[0]}'와 '${pairGrapheme[1]}'가 들어갑니다.`,
    correctAnswerList
  };
}