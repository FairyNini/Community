// 动态生成转盘分区（匹配截图效果）
function initWheel() {
    const wheel = document.getElementById('wheel');
    wheel.innerHTML = '<div class="center-text">好运大转盘</div>';

    awards.forEach((award, index) => {
        const segment = document.createElement('div');
        segment.className = 'segment';
        segment.style.transform = `rotate(${index * (360 / awards.length)}deg)`;
        
        // 添加分区装饰线
        const line = document.createElement('div');
        line.className = 'deco-line';
        segment.appendChild(line);

        // 添加奖品名称
        const label = document.createElement('div');
        label.className = 'award-name';
        label.textContent = award.name;
        label.style.transform = `rotate(${30}deg)`; // 文字角度微调
        segment.appendChild(label);

        wheel.appendChild(segment);
    });
}

// 新增样式规则
const style = document.createElement('style');
style.textContent = `
    .segment {
        position: absolute;
        width: 100%;
        height: 100%;
        clip-path: polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%);
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
    }
`;
document.head.appendChild(style);
