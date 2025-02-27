document.addEventListener('DOMContentLoaded', () => {
    const wheel = document.querySelector('.wheel');
    const resultDiv = document.getElementById('result');
    let awards = [];

    // 加载配置文件
    fetch('config.json')
        .then(response => response.json())
        .then(data => {
            awards = data.awards;
            initWheel();
        });

    // 初始化转盘
    function initWheel() {
        wheel.innerHTML = '';
        awards.forEach((award, index) => {
            const segment = document.createElement('div');
            segment.className = 'segment';
            segment.style.transform = `rotate(${index * (360 / awards.length)}deg)`;
            segment.style.backgroundColor = getColor(index); // 动态配色
            wheel.appendChild(segment);
        });
    }

    // 抽奖逻辑
    window.startDraw = function() {
        const validAwards = awards.filter(a => a.count > 0);
        if (validAwards.length === 0) {
            resultDiv.innerHTML = "所有奖品已抽完！";
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
        resultDiv.innerHTML = `恭喜获得：${selectedAward.name}`;
        localStorage.setItem('awards', JSON.stringify(awards));
    };

    // 动态配色函数
    function getColor(index) {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
        return colors[index % colors.length];
    }
});
