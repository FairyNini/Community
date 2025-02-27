document.addEventListener('DOMContentLoaded', () => {
    let currentUser = null;
    let awards = [];
    const wheel = document.getElementById('wheel');
    
    // 显示加载状态
    wheel.innerHTML = '<div class="loading-text">转盘加载中...</div>';

    // 加载配置
    fetch('config.json')
        .then(res => {
            if (!res.ok) throw new Error(`HTTP错误 ${res.status}`);
            return res.json();
        })
        .then(data => {
            awards = data.awards;
            if (awards.length < 2) throw new Error('至少需要配置2个奖项');
            initWheel();
            wheel.innerHTML = ''; // 成功时清空加载提示
        })
        .catch(error => {
            console.error('初始化失败:', error);
            wheel.innerHTML = '<div class="error-text">转盘初始化失败<br><small>请联系管理员检查配置文件</small></div>';
        });
});
    // ================= 核心功能 =================
    
    // 初始化转盘（兼容截图不完整标签）
    function initWheel() {
        wheel.innerHTML = '';
        awards.forEach((award, index) => {
            const rotateDeg = index * (360 / awards.length);
            
            const segment = document.createElement('div');
            segment.className = 'segment';
            segment.style.transform = `rotate(${rotateDeg}deg)`;
            
            // 奖品名称标签（垂直文字布局）
            const label = document.createElement('div');
            label.className = 'award-label';
            label.textContent = award.name;
            label.style.transform = `rotate(${90 - (180 / awards.length)}deg)`;
            segment.appendChild(label);
            
            wheel.appendChild(segment);
        });
    }

    // ================= 用户验证 =================
    document.getElementById('verify-btn').addEventListener('click', () => {
        const username = document.getElementById('username').value.trim();
        
        // 移除截图中的默认值逻辑
        if (!username) {
            alert('请输入用户名');
            return;
        }

        fetch('participants.json')
            .then(res => res.json())
            .then(data => {
                const user = data.users.find(u => u.name === username);
                if (user) {
                    currentUser = user;
                    document.getElementById('draws-info').textContent = 
                        `剩余抽奖次数：${user.max_draws - user.draws}`;
                    document.getElementById('draw-btn').disabled = false;
                } else {
                    alert('用户不存在');
                }
            });
    });

    // ================= 抽奖逻辑 =================
    document.getElementById('draw-btn').addEventListener('click', () => {
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
        
        // 更新界面显示
        document.getElementById('result').textContent = `恭喜获得：${selectedAward.name}`;
        document.getElementById('draws-info').textContent = 
            `剩余抽奖次数：${currentUser.max_draws - currentUser.draws}`;
    });

    // ================= 初始化加载 =================
    fetch('config.json')
        .then(res => res.json())
        .then(data => {
            awards = data.awards;
            initWheel();
            
            // 修正截图HTML中的未闭合标签问题
            document.querySelector('.wheel-content').appendChild(wheel);
        })
        .catch(error => {
            console.error('配置加载失败:', error);
            document.getElementById('wheel').innerHTML = '转盘初始化失败';
        });
});
