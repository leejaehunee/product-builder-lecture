const URL = "https://teachablemachine.withgoogle.com/models/nToil7dwb/";

let model, webcam, labelContainer, maxPredictions;
let isWebcamMode = false;

async function initModel() {
    if (model) return;
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}

async function updateResults(prediction) {
    const resultSection = document.getElementById('result-section');
    const labelContainer = document.getElementById('label-container');
    
    resultSection.style.display = 'block';
    
    // Create bars if they don't exist
    if (labelContainer.innerHTML === '') {
        prediction.sort((a, b) => b.probability - a.probability).forEach(p => {
            const barWrapper = document.createElement('div');
            barWrapper.className = 'result-bar-wrapper';
            barWrapper.setAttribute('data-class', p.className);
            barWrapper.innerHTML = `
                <div class="label-text">
                    <span>${p.className}</span>
                    <span class="percent-text">0%</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: 0%"></div>
                </div>
            `;
            labelContainer.appendChild(barWrapper);
        });
    }

    // Update existing bars
    prediction.forEach(p => {
        const barWrapper = labelContainer.querySelector(`[data-class="${p.className}"]`);
        if (barWrapper) {
            const percent = (p.probability * 100).toFixed(0);
            barWrapper.querySelector('.percent-text').textContent = percent + '%';
            barWrapper.querySelector('.progress-bar').style.width = percent + '%';
        }
    });
}

async function loop() {
    if (!isWebcamMode) return;
    webcam.update();
    const prediction = await model.predict(webcam.canvas);
    await updateResults(prediction);
    window.requestAnimationFrame(loop);
}

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const uploadModeBtn = document.getElementById('upload-mode-btn');
    const webcamModeBtn = document.getElementById('webcam-mode-btn');
    const uploadSection = document.getElementById('upload-section');
    const webcamSection = document.getElementById('webcam-section');
    const imageUpload = document.getElementById('image-upload');
    const imageContainer = document.getElementById('image-container');
    const faceImage = document.getElementById('face-image');
    const uploadLabel = document.getElementById('upload-label');
    const predictBtn = document.getElementById('predict-btn');
    const webcamStartBtn = document.getElementById('webcam-start-btn');
    const resultSection = document.getElementById('result-section');
    const labelContainer = document.getElementById('label-container');

    // Theme Logic
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') body.classList.add('dark-mode');

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // Mode Switching
    uploadModeBtn.addEventListener('click', () => {
        isWebcamMode = false;
        uploadModeBtn.classList.add('active');
        webcamModeBtn.classList.remove('active');
        uploadSection.style.display = 'block';
        webcamSection.style.display = 'none';
        resultSection.style.display = 'none';
        labelContainer.innerHTML = '';
        if (webcam) webcam.stop();
    });

    webcamModeBtn.addEventListener('click', () => {
        isWebcamMode = true;
        webcamModeBtn.classList.add('active');
        uploadModeBtn.classList.remove('active');
        webcamSection.style.display = 'block';
        uploadSection.style.display = 'none';
        resultSection.style.display = 'none';
        labelContainer.innerHTML = '';
    });

    // Upload Mode Logic
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
                labelContainer.innerHTML = '';
            };
            reader.readAsDataURL(file);
        }
    });

    predictBtn.addEventListener('click', async () => {
        if (!faceImage.src || faceImage.style.display === 'none') {
            alert('사진을 먼저 업로드해주세요!');
            return;
        }
        predictBtn.disabled = true;
        predictBtn.textContent = '분석 중...';
        await initModel();
        const prediction = await model.predict(faceImage);
        labelContainer.innerHTML = ''; // Clear for static prediction
        await updateResults(prediction);
        predictBtn.disabled = false;
        predictBtn.textContent = '다시 분석하기';
    });

    // Webcam Mode Logic
    webcamStartBtn.addEventListener('click', async () => {
        webcamStartBtn.disabled = true;
        webcamStartBtn.textContent = '카메라 연결 중...';
        
        await initModel();
        
        const flip = true;
        webcam = new tmImage.Webcam(400, 400, flip);
        await webcam.setup();
        await webcam.play();
        
        webcamStartBtn.style.display = 'none';
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        
        window.requestAnimationFrame(loop);
    });
});
