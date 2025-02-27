document.addEventListener('DOMContentLoaded', () => {
    let currentUser = null;
    let awards = [];
    const wheel = document.getElementById('wheel');

    // ================= 样式动态注入 =================
    const style = document.createElement('style');
    style.textContent = `
        .segment {
            position: absolute;
            width: 100%;
            height: 100%;
            clip-path: polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%);
            transform-origin: 50% 50%;
        }
        
        .deco-line {
            position: absolute;
            left: -2px;
            top: 50%;
            width: 4px;
            height: 50%;
            background: linear-gradient(to bottom, #ff4757 0%, #2ed573 100%);
        }
        
        .award-name {
            position: absolute;
            left: 60px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 14px;
            color: #2f3542;
            writing-mode: vertical-rl;
            text-orientation: upright;
        }
        
        .center-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 24px;
            z-index: 2;
        }
    `;
    document.head.appendChild(style);

    // ================= 核心功能 =================
    // 初始化转盘
    window.initWheel = function() {
        wheel.innerHTML = '<div class="center-text">好运大转盘</div>';
        
        awards.forEach((award, index) => {
            const rotateDeg = index * (360 / awards.length);
            
            const segment = document.createElement('div');
            segment.className = 'segment';
            segment.style.transform = `rotate(${rotateDeg}deg)`;
            
            // 装饰线
            const line = document.createElement('div');
            line.className = 'deco-line';
            segment.appendChild(line);

            // 奖品名称（动态角度修正）
            const label = document.createElement('div');
            label.className = 'award-name';
            label.textContent = award.name;
            label.style.transform = `rotate(${90 - (180 / awards.length)}deg)`; // 精准垂直对齐
            segment.appendChild(label);

            wheel.appendChild(segment);
        });
    }

    // ================= 数据加载 =================
    window.loadConfig = async function() {
        try {
            const response = await fetch('config.json');
            const config = await response.json();
            awards = config.awards;
            initWheel();
        } catch (error) {
            console.error('配置加载失败:', error);
        }
    }

    // ================= 事件绑定 =================
    window.checkUser = function() {
        const username = document.getElementById('username').value.trim();
        // 验证逻辑...
    }

    window.startDraw = function() {
        // 抽奖逻辑...
    }

    // 初始化执行
    loadConfig();
});
