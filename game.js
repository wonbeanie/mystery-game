
// DB or 파일을 통해 값을 가져와 무작위로 정해진 뒤
let gameData = {
  area : {
    origin : ["서울", "부산", "대전", "광주", "인천", "속초"],
    noCorrect : ["부산", "대전", "광주", "인천", "속초"],
    grapheme : {},
    hint : {
      check : false,
      correctAnswerList : []
    },
    positionList : {}
  },
  place : {
    origin : ["병원", "소방서", "대형마트", "편의점", "학교", "피시방"],
    noCorrect : [],
    grapheme : {},
    hint : {
      check : false,
      correctAnswerList : []
    },
    positionList : {}
  },
  suspect : {
    origin : ["김민준", "이서연", "박지훈", "최윤서", "정현우", "오지아"],
    noCorrect : [],
    grapheme : {},
    hint : {
      check : false,
      correctAnswerList : []
    },
    positionList: {}
  }
}

const CHO = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ',
  'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];
const JUNG = [
  'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
  'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
];
const JONG = [
  '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
  'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

const JAEUM = [
  'ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'
];

let transfromKorean = {
  area : "지역",
  place : "장소",
  suspect :"용의자"
}

let correct = {
  area : "부산",
  place : "대형마트",
  suspect : "최윤서"
};

let turn = 1;

let confirmation = "";
let lastConfirmation = "";

function gameInit(){
  let gameDataTemp = JSON.parse(JSON.stringify(gameData));
  Object.keys(gameData).forEach(key => {
    gameData[key].origin.map((data)=>{
      gameDataTemp[key].grapheme[data] = transformGrapheme(data);
    })
  });

  gameData = gameDataTemp;

  correct = {
    area : gameData.area.origin[getRandomIndex(gameData.area.origin.length)],
    place : gameData.place.origin[getRandomIndex(gameData.place.origin.length)],
    suspect : gameData.suspect.origin[getRandomIndex(gameData.suspect.origin.length)]
  };

  Object.keys(gameData).forEach((key)=>{
    gameData[key].noCorrect = gameData[key].origin.filter((data)=>correct[key] !== data);
  });

  let infoTableElement = document.getElementById("game-infomation-table");

  Object.keys(gameData).forEach((key)=>{
    let tbodyElement = document.createElement("tbody");
    let typeElement = document.createElement("td");

    typeElement.innerText = transfromKorean[key];

    tbodyElement.appendChild(typeElement);

    gameData[key].origin.forEach((data)=>{
      let dataElement = document.createElement("td");
      dataElement.innerText = data;

      tbodyElement.appendChild(dataElement);
    });

    infoTableElement.appendChild(tbodyElement);
  });

  Object.keys(gameData).forEach((key)=>{
    let correctElement = document.getElementById(`${key}-correct`);
    let selectElement = document.createElement("select");

    selectElement.setAttribute("id", key);

    gameData[key].origin.forEach((data)=>{
      let dataElement = document.createElement("option");

      dataElement.setAttribute("value", data);

      dataElement.innerText = data;

      selectElement.appendChild(dataElement);
    });

    correctElement.appendChild(selectElement);
  });
}

function transformGrapheme(str) {
    const decomposed = [];
    
    Array.from(str).forEach(char => {
        const code = char.charCodeAt(0);
        
        // 한글 조합형 문자 범위 (가 ~ 힣)
        if (code >= 0xAC00 && code <= 0xD7A3) {
            const index = code - 0xAC00;
            
            const choIndex = Math.floor(index / 588);
            const jungIndex = Math.floor((index % 588) / 28);
            const jongIndex = index % 28;

            decomposed.push(CHO[choIndex], JUNG[jungIndex]);
            if (jongIndex !== 0) {
                decomposed.push(JONG[jongIndex]);
            }
        } else {
            // 한글이 아닌 문자는 그대로 추가
            decomposed.push(char); 
        }
    });

    return decomposed;
}

gameInit();

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

function hasBatchim(word) {
  return [...word].some((data)=>{
    const charCode = data.charCodeAt(data.length - 1);

    if((charCode - 0xAC00) % 28 > 0){
      return true;
    }
  });
}

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

function getRandomArray(array){
  const randomIndex = getRandomIndex(array.length);

  return array[randomIndex];
}

function getRandomIndex(max, min = 0){
  return Math.floor(Math.random() * (max - min)) + min;
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

  viewComputerAnswer(`Turn ${turn}. 정답을 ${correctCount}개 맞았어요. (${area},${place},${suspect})`);
  // viewComputerAnswer(`Turn ${turn}`);

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
    alert(`추리 실패...\n정답은 : ${correct.area},${correct.place},${correct.suspect} 입니다.`);
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

function viewComputerAnswer(text){
  const newText = document.createElement('p');

  newText.innerText = text;

  document.getElementById('hint').appendChild(newText);
}

function finishTrun(hint){
  viewComputerAnswer(`Hint : ${hint.text}`);

  turn += 1;
}

function createPotion() {
  const WIDTH_MAX = 400;
  const HEIGHT_MAX = 400;
  const NEAR_NUM = 15;
  const PADDING_NUM = 20;
  let map = "";

  const MAX = WIDTH_MAX - PADDING_NUM;
  const MIN = HEIGHT_MAX - PADDING_NUM;

  gameData[confirmation].positionList[correct[confirmation]] = [getRandomIndex(MAX, PADDING_NUM), getRandomIndex(MAX, PADDING_NUM)];

  let [confirmationX, confirmationY] = gameData[confirmation].positionList[correct[confirmation]];

  Object.keys(gameData).forEach((key)=>{
    let [x,y] = gameData[key].positionList[correct[key]] = [
      confirmationX + getRandomIndex(NEAR_NUM),
      confirmationY + getRandomIndex(NEAR_NUM)
    ];

    let positionListTemp = {};

    gameData[key].origin.forEach((data, i)=>{
      if(data !== correct[key]){
        x = getRandomIndex(MAX, PADDING_NUM);
        y = getRandomIndex(MAX, PADDING_NUM);
      }

      positionListTemp[data] = [x, y];
      
    });

    let timeout = 0;

    while(true){
      let check = false;

      Object.keys(positionListTemp).forEach((key)=>{
        let [x, y] = positionListTemp[key];

        Object.keys(positionListTemp).forEach((comparisonKey)=>{
          if(key === comparisonKey){
            return;
          }

          let [x2, y2] = positionListTemp[comparisonKey];

          if(
            (x > x2 - NEAR_NUM && x < x2 + NEAR_NUM) ||
            (y > y2 - NEAR_NUM && y < y2 + NEAR_NUM)
          ){
            let rangeMaxX = x2 + NEAR_NUM > MAX ? MAX : x2 + NEAR_NUM;
            let rangeMinX = x2 - NEAR_NUM < PADDING_NUM ? PADDING_NUM : x2 - NEAR_NUM;

            let rangeMaxY = y2 + NEAR_NUM > MAX ? MAX : y2 + NEAR_NUM;
            let rangeMinY = y2 - NEAR_NUM < PADDING_NUM ? PADDING_NUM : y2 - NEAR_NUM;

            x = getRandomExcludingRange(
              WIDTH_MAX - PADDING_NUM, PADDING_NUM, 
              rangeMaxX, rangeMinX
            );

            y = getRandomExcludingRange(
              HEIGHT_MAX - PADDING_NUM, PADDING_NUM, 
              rangeMaxY, rangeMinY
            );

            check = true;
          }
        });

      positionListTemp[key] = [x, y];
    });

      timeout += 1;

      if(timeout > 1000 || !check){
        break;
      }
    }

    Object.keys(positionListTemp).forEach((positionKey)=>{
      const [x, y] = positionListTemp[positionKey];

      if(key !== "suspect"){
        map += `${positionKey} (${x}, ${y}), `;
      }

    });

    gameData[key].positionList = positionListTemp;

    map += "\n";
  });

  drawMapPoint();

  viewComputerAnswer(`지도를 입수했습니다\n${map}`);
}

function getPositionHint(){
  let noCorrectKeys = Object.keys(gameData).filter((key)=> key !== confirmation && key !== lastConfirmation);

  const type = getRandomArray(noCorrectKeys);

  lastConfirmation = type;

  let noCorrectAnswerList = gameData[type].hint.correctAnswerList.filter((data)=>{
    return data !== correct[type];
  });

  if(type === "area" || type === "place"){
    const [correctX, correctY] = gameData[type].positionList[correct[type]];

    let distanceList = [];
    let closeName = "";
    let closeDistance = 0;

    noCorrectAnswerList.forEach((key)=>{
      let [x, y] = gameData[type].positionList[key];

      distanceList.push([x - correctX, y - correctY, key]);
    });

    distanceList.forEach(([x, y, name])=>{
      let distance = getDistance([x, y], [correctX, correctY]);
      if(closeDistance > distance || closeDistance === 0){
        closeDistance = distance;
        closeName = name;
      };
    });

    return {
      text : `경찰의 연락 : 범행 ${transfromKorean[type]}은 '${closeName}'에 가까이 있습니다.`
    }
  }

  let hint = getRandomArray(noCorrectAnswerList);

  const restBaseHint = noCorrectAnswerList.filter((data)=>{
    return data !== hint;
  })[0];

  const placeHintKey = getRandomArray(["area", "place"]);

  const correctAnswerList = [];

  gameData[placeHintKey].origin.forEach((data)=>{
    let check = gameData[placeHintKey].hint.correctAnswerList.some((correctAnswer)=>{
      if(data === correctAnswer){
        return true;
      }
    });

    if(check){
      return;
    }

    correctAnswerList.push(data);
  });

  const firstPlace = getRandomArray(correctAnswerList);

  const noFirstPlaceCorrectAnswerList = correctAnswerList.filter((data)=>{
    return data !== firstPlace;
  });

  const secondPlace = getRandomArray(noFirstPlaceCorrectAnswerList);

  return {
    text : `경찰의 연락 : 범행 ${transfromKorean[type]} '${hint}'은 현재 '${firstPlace}'에, '${restBaseHint}'는 '${secondPlace}'에 있는 것으로 확인됩니다. `
  }
}

function getDistance([x1, y1], [x2, y2]) {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;

  const deltaXSquared = deltaX ** 2;
  const deltaYSquared = deltaY ** 2;

  const distance = Math.sqrt(deltaXSquared + deltaYSquared);

  return Math.floor(distance);
}

function drawMapPoint(){
  document.getElementById("map-images").style = "display:unset;";
  const noSuspectKeys = Object.keys(gameData).filter(key => key !== "suspect");

  noSuspectKeys.forEach((key)=>{
    const canvasId = `${key}MapCavnas`;

    const img = getMapElement(key);
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    Object.keys(gameData[key].positionList).forEach((positionKey) => {
      const [x, y] = gameData[key].positionList[positionKey];
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);

      ctx.fillStyle = "Red";
      ctx.fill();
      ctx.closePath();

      let drawNameX = x;
      let drawNameY = y;

      ctx.font = 'bold 14px Arial';
      
      ctx.fillStyle = 'white'; 

      ctx.textAlign = 'left'; 
      ctx.textBaseline = 'middle'; 

      ctx.fillText(positionKey, drawNameX, drawNameY - 10);
    });
  });
}

function getMapElement(type) {
  const imgId = `${type}Map`;

  return document.getElementById(imgId);
}

function getRandomExcludingRange(max, min, excludMax, excludMin){
  const max1 = excludMin - 1;
  const size1 = max1 - min + 1;

  const min2 = excludMax + 1;
  const size2 = max - min2 + 1;

  let index = getRandomIndex(size1 + size2);

  if(index < size1){
    index = index + min;
  }
  else {
    index = (index - size1) + min2;
  }

  return index;
}