
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const numbersDisplay = document.querySelector('.numbers-display');

    const getNumberColor = (number) => {
        if (number <= 10) return '#fbc400'; // Yellow
        if (number <= 20) return '#69c8f2'; // Blue
        if (number <= 30) return '#ff7272'; // Red
        if (number <= 40) return '#aaa';    // Gray
        return '#b0d840';                   // Green
    };

    const generateLottoNumbers = () => {
        const numbers = new Set();
        while (numbers.size < 6) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNumber);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    };

    const displayNumbers = (numbers) => {
        numbersDisplay.innerHTML = '';
        numbers.forEach((number, index) => {
            setTimeout(() => {
                const circle = document.createElement('div');
                circle.classList.add('number-circle');
                circle.textContent = number;
                circle.style.backgroundColor = getNumberColor(number);
                circle.style.transform = 'scale(0)';
                numbersDisplay.appendChild(circle);
                setTimeout(() => {
                    circle.style.transform = 'scale(1)';
                }, 50);
            }, index * 100);
        });
    };

    generateBtn.addEventListener('click', () => {
        const lottoNumbers = generateLottoNumbers();
        displayNumbers(lottoNumbers);
    });
});
