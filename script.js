const character = document.getElementById('character');
const secondHand = document.getElementById('second-hand');

// 1. 時計の針を動かす
function updateClock() {
    const now = new Date();
    const seconds = now.getSeconds();
    const degrees = (seconds / 60) * 360;
    secondHand.style.transform = `translateX(-50%) rotate(${degrees}deg)`;
}
setInterval(updateClock, 1000);

// 2. キャラクターの自律移動ロジック
function autoMove() {
    const states = ['walk', 'sit', 'sleep'];
    const currentState = states[Math.floor(Math.random() * states.length)];
    
    // 状態に合わせて動きを変える
    if (currentState === 'walk') {
        const x = Math.random() * (window.innerWidth - 64);
        const y = Math.random() * (window.innerHeight - 64);
        character.style.left = `${x}px`;
        character.style.top = `${y}px`;
        console.log("Walking to:", x, y);
    } else if (currentState === 'sit') {
        // 椅子（仮定の位置）へ
        character.style.left = '40%';
        character.style.top = '55%';
        console.log("Sitting...");
    } else {
        // ベッド（仮定の位置）へ
        character.style.left = 'calc(100% - 150px)';
        character.style.top = 'calc(100% - 100px)';
        console.log("Sleeping...");
    }

    // 次の行動までの時間をランダムに設定 (3秒〜6秒)
    setTimeout(autoMove, 3000 + Math.random() * 3000);
}

autoMove();