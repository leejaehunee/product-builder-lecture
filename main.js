
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const menuDisplay = document.querySelector('.menu-display');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');

    // Menus
    const menus = [
        '김치찌개', '된장찌개', '제육볶음', '돈가스', '초밥', 
        '치킨', '피자', '마라탕', '떡볶이', '쌀국수', 
        '파스타', '삼겹살', '비빔밥', '냉면', '짜장면', 
        '짬뽕', '햄버거', '샌드위치', '족발', '보쌈',
        '육회비빔밥', '스테이크', '라멘', '우동', '순대국밥'
    ];

    // Theme Logic
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        
        if (isDark) {
            localStorage.setItem('theme', 'dark');
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
        } else {
            localStorage.setItem('theme', 'light');
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
        }
    });

    const getRandomMenu = () => {
        const randomIndex = Math.floor(Math.random() * menus.length);
        return menus[randomIndex];
    };

    const displayMenu = (menu) => {
        menuDisplay.innerHTML = '';
        const menuItem = document.createElement('div');
        menuItem.classList.add('menu-item');
        menuItem.textContent = menu;
        menuDisplay.appendChild(menuItem);
    };

    generateBtn.addEventListener('click', () => {
        // Animation effect
        menuDisplay.innerHTML = '<div class="menu-item" style="opacity: 0.5;">음... 고민 중...</div>';
        
        setTimeout(() => {
            const recommendedMenu = getRandomMenu();
            displayMenu(recommendedMenu);
        }, 500);
    });
});
