const room = document.getElementById('room');
const character = document.getElementById('character');
const secondHand = document.getElementById('second-hand');

// --- 1. 時計の制御（滑らかに永遠に回り続ける秒針） ---
let totalDegrees = 0;
let lastSeconds = new Date().getSeconds();

function updateClock() {
    const now = new Date();
    const seconds = now.getSeconds();
    
    // 0秒をまたいだ時に逆回転しないよう、差分だけを足していく
    let diff = seconds - lastSeconds;
    if (diff < 0) diff += 60; // 59秒から0秒になった時用
    
    totalDegrees += diff * 6;
    secondHand.style.transform = `translateX(-50%) rotate(${totalDegrees}deg)`;
    
    // 1分ごとのアクション判定（秒が0になった瞬間）
    if (seconds === 0 && lastSeconds !== 0) {
        triggerSpecialEvent();
    }
    
    lastSeconds = seconds;
}
// 1秒ごとに「カチッ」と動かす
setInterval(updateClock, 1000);
updateClock();

// --- 2. キャラクターのポーズ制御 ---
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

// 特別なポーズ（座る・寝る）をさせる
function triggerSpecialEvent() {
    const dice = Math.random();
    if (dice < 0.5) {
        setPose('sit');
    } else {
        setPose('sleep');
    }
}

// --- 3. メインの自律行動ロジック ---
async function autoMove() {
    const currentBg = character.style.backgroundImage;
    
    if (currentBg.includes('sit') || currentBg.includes('sleep')) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        setPose('front');
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const isWalking = Math.random() > 0.2; 
    
    if (isWalking) {
        const currentX = parseFloat(character.style.left) || 210;
        
        let targetX, targetY;
        let isOverlappingClock = true;

        // 時計に被らない座標が決まるまでループ（安全策）
        while (isOverlappingClock) {
            targetX = Math.random() * (room.clientWidth - 80);
            targetY = Math.random() * (room.clientHeight - 80);

            // 右上の時計エリア（top:20, right:20, size:100）に食い込まないかチェック
            // room.clientWidth - 140 以上の X かつ 140 以下の Y には行かないようにする
            const isInClockArea = (targetX > room.clientWidth - 140 && targetY < 140);
            
            if (!isInClockArea) {
                isOverlappingClock = false;
            }
        }

        const direction = (targetX > currentX) ? 'right' : 'left';
        startWalking(direction);
        
        character.style.left = `${targetX}px`;
        character.style.top = `${targetY}px`;

        await new Promise(resolve => setTimeout(resolve, 2000));
        stopWalking();
        setPose('front');
    } else {
        triggerSpecialEvent();
        setTimeout(autoMove, 5000);
        return;
    }

    const waitTime = 3000 + Math.random() * 3000;
    setTimeout(autoMove, waitTime);
}

// 初期設定
setPose('front');
character.style.left = '210px';
character.style.top = '210px';
// 起動してすぐに動き出す
setTimeout(autoMove, 1000);