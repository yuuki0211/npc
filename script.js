const character = document.getElementById('character');
const secondHand = document.getElementById('second-hand');

// --- 1. 時計の制御 ---
function updateClock() {
    const now = new Date();
    const degrees = (now.getSeconds() / 60) * 360;
    secondHand.style.transform = `translateX(-50%) rotate(${degrees}deg)`;
}
setInterval(updateClock, 1000);

// --- 2. キャラクターのポーズ制御 ---
function setPose(pose) {
    character.style.backgroundImage = `url('assets/${pose}.png')`;
}

// 歩行アニメーションのループ管理
let walkInterval = null;
function startWalking(direction) {
    stopWalking(); // 二重起動防止
    let step = 0;
    // directionは 'right' か 'left'
    walkInterval = setInterval(() => {
        // 立ちポーズ(right)と歩きポーズ(walk_right)を交互に切り替えてコマ送りに見せる
        const pose = (step % 2 === 0) ? `walk_${direction}` : direction;
        setPose(pose);
        step++;
    }, 300); // 0.3秒間隔で足を動かす
}

function stopWalking() {
    clearInterval(walkInterval);
    walkInterval = null;
}

// --- 3. メインの自律行動ロジック ---
async function autoMove() {
    // 状態の抽選
    const states = ['walk', 'sit', 'sleep'];
    const currentState = states[Math.floor(Math.random() * states.length)];
    
    // 現在地と目的地
    const currentX = parseFloat(character.style.left) || 0;
    let targetX, targetY, finalPose;

    // 目的地と到着後のポーズを設定
    if (currentState === 'walk') {
        targetX = Math.random() * (window.innerWidth - 100);
        targetY = Math.random() * (window.innerHeight - 100);
        finalPose = 'front'; // 歩いた後は正面を向く
    } else if (currentState === 'sit') {
        targetX = window.innerWidth * 0.4;
        targetY = window.innerHeight * 0.55;
        finalPose = 'sit';
    } else { // sleep
        targetX = window.innerWidth - 180;
        targetY = window.innerHeight - 150;
        finalPose = 'sleep';
    }

    // A. 移動開始（向きを判定して歩行アニメ開始）
    const direction = (targetX > currentX) ? 'right' : 'left';
    startWalking(direction);
    
    character.style.left = `${targetX}px`;
    character.style.top = `${targetY}px`;

    // B. 移動中（CSSのtransitionが終わるまで待機：2秒）
    await new Promise(resolve => setTimeout(resolve, 2000));

    // C. 到着後の処理
    stopWalking();
    setPose(finalPose);

    // D. 待機時間（front.pngの時間を長めにとるためのインターバル）
    // 5秒〜10秒の間でランダムに何もしない時間を設定
    const waitTime = (finalPose === 'front') ? 7000 : 4000; 
    setTimeout(autoMove, waitTime + Math.random() * 3000);
}

// 初回起動
setPose('front');
setTimeout(autoMove, 2000); // 起動直後に少し待ってから動き出す