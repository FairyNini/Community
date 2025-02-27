document.addEventListener('DOMContentLoaded', () => {
    let currentUser = null;
    let awards = [];
    const wheel = document.getElementById('wheel');

    // ================= 核心功能 =================
    // 初始化转盘
    function initWheel() {
        wheel.innerHTML = '';
        awards.forEach((award, index) => {
            const rotateDeg = index * (360 / awards.length);
            
            const segment = document.createElement('div');
            segment.className = 'segment';
            segment.style.transform = `rotate(${rotateDeg}deg)`;
            
            // 奖品名称标签
            const label = document.createElement('div');
            label.className = 'award-label';
            label.textContent = award.name;
            label.style.transform = `rotate(${90 - (180 / awards.length)}deg)`; // 垂直校准
            segment.appendChild(label);
            
            wheel.appendChild(segment);
        });
    }

    // 用户验证
    function checkUser() {
        const username = document.getElementById('username').value.trim();
        fetch('participants.json')
            .then(res => res.json())
            .then(data => {
                const user = data.users.find(u => u.name === username);
                if (user && user.draws < user.max_draws) {
                    currentUser = user;
                    document.getElementById('draw-btn').disabled = false;
                    document.getElementById('draws-info').textContent = 
                        `剩余抽奖次数：${user.max_draws - user.draws}`;
                } else {
                    alert('验证失败：用户不存在或次数已用完');
                }
            });
    }

    // 抽奖逻辑
    function startDraw() {
        if (!currentUser || currentUser.draws >= currentUser.max_draws) return;
        
        const validAwards = awards.filter(a => a.count > 0);
        if (validAwards.length === 0) {
            alert('所有奖品已抽完！');
            return;
        }

        const totalProbability = validAwards.reduce((sum, a) => sum + a.probability, 0);
        const random = Math.random() * totalProbability;
        let cumulative = 0;
        let selectedAward = null;

        for (const award of validAwards) {
            cumulative += award.probability;
            if (random <= cumulative) {
                selectedAward = award;
                break;
            }
        }

        selectedAward.count--;
        currentUser.draws++;
        
        document.getElementById('result').textContent = `恭喜获得：${selectedAward.name}`;
        document.getElementById('draws-info').textContent = 
            `剩余抽奖次数：${currentUser.max_draws - currentUser.draws}`;
    }

    // ================= 事件绑定 =================
    document.getElementById('verify-btn').addEventListener('click', checkUser);
    document.getElementById('draw-btn').addEventListener('click', startDraw);

    // ================= 初始化加载 =================
    fetch('config.json')
        .then(res => res.json())
        .then(data => {
            awards = data.awards;
            initWheel();
        });
});
