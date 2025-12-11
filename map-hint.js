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