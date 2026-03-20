const room = document.getElementById('room');
const character = document.getElementById('character');
const secondHand = document.getElementById('second-hand');

// --- 1. 時計の制御（カクカク動く秒針） ---
function updateClock() {
    const now = new Date();
    const seconds = now.getSeconds();
    // 1秒ごとに6度(360/60)ずつ回転
    const degrees = seconds * 6; 
    secondHand.style.transform = `translateX(-50%) rotate(${degrees}deg)`;
}
// 1秒ごとに更新
setInterval(updateClock, 1000);
updateClock(); // 起動時に即実行

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

// --- 3. メインの自律行動ロジック ---
async function autoMove() {
    // 家具がないので、常に 'walk' か 'idle' (front) の抽選
    const isWalking = Math.random() > 0.3; 
    
    if (isWalking) {
        const currentX = parseFloat(character.style.left) || 0;
        
        // roomのサイズ(500px)に合わせて目的地を制限
        const targetX = Math.random() * (room.clientWidth - 80);
        const targetY = Math.random() * (room.clientHeight - 80);

        const direction = (targetX > currentX) ? 'right' : 'left';
        startWalking(direction);
        
        character.style.left = `${targetX}px`;
        character.style.top = `${targetY}px`;

        await new Promise(resolve => setTimeout(resolve, 2000));
        stopWalking();
    }

    // 到着後、または歩かない時は正面を向いて待機
    setPose('front');

    // 待機時間を長め（5〜10秒）に設定して、観察しやすくする
    const waitTime = 5000 + Math.random() * 5000;
    setTimeout(autoMove, waitTime);
}

// 初回起動
setPose('front');
// 初期位置を中央に
character.style.left = '210px';
character.style.top = '210px';
setTimeout(autoMove, 2000);