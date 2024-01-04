// 5글자 단어
// 6번의 기회
// 존재하면 노란색, 위치도 맞으면 초록색
// 게임 종료 파단
// 상단에 게임 시간 표시
// 키보드에 동일하게 표시
// 키보드 클릭으로도 입력가능
// const 정답 = 'APPLE';

let attempts = 0;
let index = 0; 
let timer

//let은 수정 가능 변수, 뒤에서 계속 수정해줄 것

function appStart() {
    
    const displayGameover = () => {
        const div = document.createElement('div');
        div.innerText = '게임이 종료되었습니다';
        div.style = 'display:flex; justify-content:center; align-items:center; position:absolute; top:40vh; background-color: red; width:100%; height:200px;' ;
        document.body.appendChild(div);
    }


    const gameOver = () => {
        window.removeEventListener('keydown',handleKeydown);
        displayGameover();
        clearInterval(timer);
    };

    const nextline = () => {
        if(attempts === 6)return gameOver();
        attempts ++ ;
        index = 0;
    };
    

    const handleEnterkey = async() => {
        let 맞은_갯수 = 0;


        //서버에서 정답을 받아오는 코드 
        const 응답 = await fetch('/answer')
        const 정답 = await 응답.json();
        //await 서버에서 서버로 요청을 보내고 응답이 올 때 까지 기다림

        //정답확인
        for(let i =0; i<5; i++){
            const block = document.querySelector(`.board-block[data-index="${attempts}${i}"]`);
            const 입력값 = block.innerText;
            const 정답_글자 = 정답[i];
            if(입력값 === 정답_글자){
                맞은_갯수++;
                block.style.backgroundColor = "#6aaa64";
            }else if(정답.includes(입력값)){
                block.style.backgroundColor = "#c9b458";
            } else {
                block.style.backgroundColor = "#787c7e";
                block.style.color = "#fff";
            }
        
        }
        if(맞은_갯수 ===5){
            gameOver();
        }else nextline();
    };

    const handleBackspace = () => {
        if(index > 0){
            const preBlock = document.querySelector(`.board-block[data-index="${attempts}${index-1}"]`);
            preBlock.innerText = '';
        }
        if(index !== 0){
            index -= 1;
        }
    }

    const handleKeydown = (event) => {
        const key = event.key.toUpperCase();
        const keyCode = event.keyCode;
        const thisBlock = document.querySelector(`.board-block[data-index="${attempts}${index}"]`);
        
        if(event.key ==='Backspace'){
            handleBackspace();
        }

        else if (index === 5){
            if (event.key === 'Enter')handleEnterkey();
            else return;
            }else if (65<=keyCode && keyCode<=90){
            //알파벳의 키코드는 65~90
            thisBlock.innerText = key;
            index++;
        }
    };

    const startTimer = () => {
        const 시작시간 = new Date();

        function setTime(){
            const 현재시간 = new Date();
            const 흐른시간 = new Date(현재시간-시작시간);
            const 분 = 흐른시간.getMinutes().toString().padStart(2,'0');
            const 초 = 흐른시간.getSeconds().toString().padStart(2,'0');
            const timeDiv = document.querySelector('#timer');
            timeDiv.innerText = `${분}:${초}`;
        }
       timer = setInterval(setTime,1000);
       console.log(timer);
    }

   startTimer();
    window.addEventListener("keydown", handleKeydown);
};


appStart();