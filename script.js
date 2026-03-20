const room = document.getElementById('room');
const character = document.getElementById('character');
const secondHand = document.getElementById('second-hand');

// --- 1. 時計の制御（カクカク動く秒針 ＋ 1分ごとのイベント） ---
let lastMinute = -1;

function updateClock() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    
    // 秒針を1秒ごとに6度回転
    const degrees = seconds * 6; 
    secondHand.style.transform = `translateX(-50%) rotate(${degrees}deg)`;

    // 【新機能】1分経過する（秒が0に戻る）たびにイベント抽選
    if (minutes !== lastMinute && seconds === 0) {
        lastMinute = minutes;
        triggerSpecialEvent();
    }
}
setInterval(updateClock, 1000);
updateClock();

// --- 2. キャラクターの制御 ---
function setPose(pose) {
    character.style.backgroundImage = `url('assets/${pose}.png')`;
}

let walkInterval = null;
function startWalking(direction) {
    stopWalking();
    let step = 0;
    walkInterval = setInterval(() => {
        const pose = (step % 2 === 0) ? `walk_${direction}` : direction;
        setPose(pose);
        step++;
    }, 300);
}

function stopWalking() {
    clearInterval(walkInterval);
    walkInterval = null;
}

// 特別なイベント（1分に1回呼ばれる）
function triggerSpecialEvent() {
    const dice = Math.random();
    if (dice < 0.3) {
        setPose('sit');
        console.log("Special Event: Sitting");
    } else if (dice < 0.6) {
        setPose('sleep');
        console.log("Special Event: Sleeping");
    }
    // 特殊ポーズの時は、次のautoMoveまでその場に留まらせる
}

// --- 3. メインの移動ロジック ---
async function autoMove() {
    // 現在の画像が sit や sleep なら、少し長めにその場で待機してから歩き出す
    const currentBg = character.style.backgroundImage;
    if (currentBg.includes('sit') || currentBg.includes('sleep')) {
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    const isWalking = Math.random() > 0.3;
    
    if (isWalking) {
        const currentX = parseFloat(character.style.left) || 210;
        const targetX = Math.random() * (room.clientWidth - 80);
        const targetY = Math.random() * (room.clientHeight - 80);

        const direction = (targetX > currentX) ? 'right' : 'left';
        startWalking(direction);
        
        character.style.left = `${targetX}px`;
        character.style.top = `${targetY}px`;

        await new Promise(resolve => setTimeout(resolve, 2000));
        stopWalking();
        setPose('front');
    }

    // 待機時間（正面を向いている時間を多めに）
    const waitTime = 6000 + Math.random() * 4000;
    setTimeout(autoMove, waitTime);
}

// 初期設定
setPose('front');
character.style.left = '210px';
character.style.top = '210px';
setTimeout(autoMove, 1000);