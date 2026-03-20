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

// 画像を切り替える関数（assetsフォルダを参照するように修正）
function setPose(pose) {
    character.style.backgroundImage = `url('assets/${pose}.png')`;
}

// 2. キャラクターの自律移動ロジック
function autoMove() {
    const states = ['walk', 'sit', 'sleep'];
    const currentState = states[Math.floor(Math.random() * states.length)];
    
    // 現在の座標を取得（向きを判定するため）
    const currentX = parseFloat(character.style.left) || 0;

    if (currentState === 'walk') {
        const targetX = Math.random() * (window.innerWidth - 100);
        const targetY = Math.random() * (window.innerHeight - 100);
        
        // 右に行くか左に行くかで画像を変える
        if (targetX > currentX) {
            setPose('walk_right'); 
        } else {
            setPose('walk_left');
        }

        character.style.left = `${targetX}px`;
        character.style.top = `${targetY}px`;

        // 移動が終わる頃（CSSのtransitionが2秒なので）に立ちポーズに戻す
        setTimeout(() => {
            if (targetX > currentX) setPose('right');
            else setPose('left');
        }, 2000);

    } else if (currentState === 'sit') {
        setPose('sit');
        character.style.left = '40%';
        character.style.top = '55%';
    } else if (currentState === 'sleep') {
        setPose('sleep');
        character.style.left = 'calc(100% - 150px)';
        character.style.top = 'calc(100% - 100px)';
    }

    // 次の行動までの時間をランダムに設定 (4秒〜7秒)
    setTimeout(autoMove, 4000 + Math.random() * 3000);
}

// 最初の起動
setPose('front'); // 最初は正面
autoMove();