const URL = "https://teachablemachine.withgoogle.com/models/nToil7dwb/";

let model, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
    const imageUpload = document.getElementById('image-upload');
    const imageContainer = document.getElementById('image-container');
    const faceImage = document.getElementById('face-image');
    const uploadLabel = document.getElementById('upload-label');
    const predictBtn = document.getElementById('predict-btn');
    const resultSection = document.getElementById('result-section');

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
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        moonIcon.style.display = isDark ? 'none' : 'block';
        sunIcon.style.display = isDark ? 'block' : 'none';
    });

    // Image Upload Logic
    imageContainer.addEventListener('click', () => imageUpload.click());

    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                faceImage.src = event.target.result;
                faceImage.style.display = 'block';
                uploadLabel.style.display = 'none';
                resultSection.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // Prediction Logic
    predictBtn.addEventListener('click', async () => {
        if (!faceImage.src || faceImage.style.display === 'none') {
            alert('사진을 먼저 업로드해주세요!');
            return;
        }

        predictBtn.disabled = true;
        predictBtn.textContent = '분석 중...';

        if (!model) await init();

        const prediction = await model.predict(faceImage);
        prediction.sort((a, b) => b.probability - a.probability);

        resultSection.style.display = 'block';
        labelContainer.innerHTML = '';

        prediction.forEach(p => {
            const percent = (p.probability * 100).toFixed(0);
            const barWrapper = document.createElement('div');
            barWrapper.className = 'result-bar-wrapper';
            
            barWrapper.innerHTML = `
                <div class="label-text">
                    <span>${p.className}</span>
                    <span>${percent}%</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: 0%"></div>
                </div>
            `;
            
            labelContainer.appendChild(barWrapper);
            
            // Animation
            setTimeout(() => {
                barWrapper.querySelector('.progress-bar').style.width = percent + '%';
            }, 100);
        });

        predictBtn.disabled = false;
        predictBtn.textContent = '다시 분석하기';
    });
});
