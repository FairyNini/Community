// 基础抽奖逻辑
document.addEventListener('DOMContentLoaded', () => {
    const awards = [
        { name: "联想单肩包", probability: 10, count: 2 },
        { name: "联想无线鼠标", probability: 10, count: 2 },
        { name: "社区定制晴雨伞", probability: 80, count: 25 }
    ];

    // 转盘动画逻辑
    function startDraw() {
        const resultDiv = document.getElementById('result');
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
    }

    // 绑定按钮事件
    document.querySelector('button').addEventListener('click', startDraw);
});