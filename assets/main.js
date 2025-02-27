document.addEventListener('DOMContentLoaded', () => {
    let currentUser = null;
    let awards = [];

    // 加载配置文件
    fetch('config.json')
        .then(res => res.json())
        .then(data => {
            awards = data.awards;
            initWheel();
        });

    // 转盘初始化
   function initWheel() {
    const wheel = document.getElementById('wheel');
    wheel.innerHTML = '';
    
    awards.forEach((award, index) => {
        // 创建扇形区块
        const segment = document.createElement('div');
        segment.className = 'segment';
        segment.style.transform = `rotate(${index * (360 / awards.length)}deg)`;
        segment.style.backgroundColor = getColor(index);
        
        // 添加奖品名称标签
        const label = document.createElement('div');
        label.className = 'award-label';
        label.textContent = award.name;
        label.style.transform = `rotate(${index * (360 / awards.length) + 20}deg)`; // 文字偏移角度
        segment.appendChild(label);
        
        wheel.appendChild(segment);
    });
}
    function getColor(index) {
  // 在此处自定义颜色数组（支持HEX/RGB/HSL格式）
  const colors = [
    "#FF6B6B", // 红色
    "#4ECDC4", // 青色
    "#45B7D1", // 蓝色
    "#96CEB4", // 绿色
    "#FFEEAD"  // 黄色
  ];
  return colors[index % colors.length]; // 循环使用颜色
}

    // 用户验证
    window.checkUser = function() {
        const username = document.getElementById('username').value.trim();
        fetch('participants.json')
            .then(res => res.json())
            .then(data => {
                const user = data.users.find(u => u.name === username);
                if (user && user.draws < user.max_draws) {
                    currentUser = user;
                    document.getElementById('draw-btn').disabled = false;
                    updateDrawsInfo();
                } else {
                    alert('验证失败：用户不存在或抽奖次数已用完');
                }
            });
    }

    // 抽奖逻辑
    window.startDraw = function() {
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
        updateDrawsInfo();
        saveData();
    }

    // 辅助函数
    function updateDrawsInfo() {
        document.getElementById('draws-info').textContent = 
            `剩余抽奖次数：${currentUser.max_draws - currentUser.draws}`;
    }

    function getColor(index) {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
        return colors[index % colors.length];
    }

    function saveData() {
        // 注意：本地存储需配合后端实现持久化
        localStorage.setItem('awards', JSON.stringify(awards));
        localStorage.setItem('participants', JSON.stringify(participants));
    }
});
