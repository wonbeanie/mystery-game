function getPlayTime(){
  let sec = timer % 60 > 9 ? timer % 60 : `0${timer % 60}`;
  let min = Math.floor(timer / 60) > 59 ? Math.floor(timer / 60) : `0${Math.floor(timer / 60)}`;

  return `시간 : ${min}:${sec}`;
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

function getRandomArray(array){
  const randomIndex = getRandomIndex(array.length);

  return array[randomIndex];
}

function getRandomIndex(max, min = 0){
  return Math.floor(Math.random() * (max - min)) + min;
}

function viewComputerAnswer(text){
  const newText = document.createElement('p');

  newText.innerText = text;

  document.getElementById('hint').appendChild(newText);
}

function hasBatchim(word) {
  return [...word].some((data)=>{
    const charCode = data.charCodeAt(data.length - 1);

    if((charCode - 0xAC00) % 28 > 0){
      return true;
    }
  });
}

function getDistance([x1, y1], [x2, y2]) {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;

  const deltaXSquared = deltaX ** 2;
  const deltaYSquared = deltaY ** 2;

  const distance = Math.sqrt(deltaXSquared + deltaYSquared);

  return Math.floor(distance);
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