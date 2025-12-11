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

let timer = 0;

function dataInit(){
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
}

function tableInit(){
  let infoTableElement = document.getElementById("game-infomation-table");

  Object.keys(gameData).forEach((key)=>{
    let tbodyElement = document.createElement("tbody");
    let typeElement = document.createElement("td");

    typeElement.innerText = transfromKorean[key];

    tbodyElement.appendChild(typeElement);

    gameData[key].origin.forEach((data)=>{
      let dataElement = document.createElement("td");
      dataElement.innerText = data;

      dataElement.addEventListener("click", (e) =>{
        if(e.target.style.color === "red"){
          e.target.style = "color : unset;";
        }
        else {
          e.target.style = "color: red;";
        }
      });

      tbodyElement.appendChild(dataElement);
    });

    infoTableElement.appendChild(tbodyElement);
  });
}

function timerInit(){
  setInterval(()=>{
    timer += 1;
    
    let timerElement = document.getElementById("timer");

    timerElement.innerText = getPlayTime();

  }, 1000);
}

function selectInit(){
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

function gameInit(){
  dataInit();

  tableInit();

  timerInit();

  selectInit();
}

gameInit();