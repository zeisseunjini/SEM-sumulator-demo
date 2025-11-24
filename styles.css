// [script.js] 파일 전체 내용 (로고/버튼 제거 후 자동 로드 강화)

// 전역 변수
let originalImage = null; 
let imgObj = new Image(); 

// --- 설정: 기본 이미지 URL ---
const defaultImageURL = 'default_sem_image.jpg'; // ★ 이 파일이 폴더에 있어야 합니다.

// 캔버스 및 Context
const mainCanvas = document.getElementById('mainCanvas');
const mainCtx = mainCanvas.getContext('2d');
const microscopeCanvas = document.getElementById('microscopeCanvas');
const microscopeCtx = microscopeCanvas.getContext('2d');
const spotSizeCanvas = document.getElementById('spotSizeCanvas');
const spotSizeCtx = spotSizeCanvas.getContext('2d');

// 슬라이더 엘리먼트
const focusSlider = document.getElementById('focusSlider'); 
const messageBar = document.getElementById('message-bar');


// --- 이미지 로드 함수 ---
function loadImage(url) {
    imgObj = new Image();
    imgObj.onload = function() {
      originalImage = imgObj;
      messageBar.textContent = "시뮬레이션 이미지가 로드되었습니다. Focus를 조절해 보세요!";
      draw(); 
    }
    imgObj.onerror = function() {
        messageBar.textContent = `오류: 기본 이미지 (${defaultImageURL})를 찾을 수 없습니다. Focus를 조절하여 원리를 확인하세요.`;
        originalImage = null;
        draw(); // 이미지가 없어도 모델은 그려야 함
    }
    imgObj.src = url;
}


// --- 트랙 색상 업데이트 로직 (보라색 방지) ---
function updateSliderTrackColor() {
    if (!focusSlider) return; 
    const minVal = parseFloat(focusSlider.min);
    const maxVal = parseFloat(focusSlider.max);
    const focusValue = parseFloat(focusSlider.value);
    
    const focusPercent = ((focusValue - minVal) / (maxVal - minVal)) * 100;
    focusSlider.style.setProperty('--range-percent', `${focusPercent}%`);
}


// --- 메인 그리기 함수 (모든 것을 처리) ---
function draw() {
    const focusValue = parseFloat(focusSlider.value); 
    updateSliderTrackColor(); 

    mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    if (originalImage) {
        let blurValue = Math.abs(focusValue) * 0.2; 
        
        if (Math.abs(focusValue) < 1) {
            messageBar.textContent = "✅ 초점 일치! 빔 크기가 가장 작아 이미지가 선명합니다.";
        } else {
            messageBar.textContent = "집속점이 시료 표면과 일치하지 않아 빔 크기가 커지고 이미지가 흐립니다.";
        }

        mainCtx.filter = `blur(${blurValue}px)`;
        mainCtx.drawImage(originalImage, 0, 0, mainCanvas.width, mainCanvas.height);
        mainCtx.filter = 'none';

    } else {
        // 이미지가 로드되지 않았을 경우 캔버스에 안내
        mainCtx.font = "20px Arial";
        mainCtx.fillStyle = "#333333";
        mainCtx.textAlign = "center";
        mainCtx.fillText("기본 이미지 로드 실패. 시뮬레이션 모델만 활성화됩니다.", mainCanvas.width / 2, mainCanvas.height / 2);
    }

    drawMicroscopeModel(focusValue);
    drawSpotSizeModel(focusValue); 
}


// ------------------------------------------------------------------
// --- 모델 그리기 함수들 (Focus/WD, Spot Size) ---
// ------------------------------------------------------------------

// (이 부분은 이전 답변에서 드린 최종 코드를 그대로 사용합니다.)

function drawMicroscopeModel(focusValue) {
    microscopeCtx.clearRect(0, 0, microscopeCanvas.width, microscopeCanvas.height);
    
    const W = microscopeCanvas.width;
    const H = microscopeCanvas.height;
    const lensCenterX = W / 2;
    const lensCenterY = 80;
    const lensWidth = 120;
    const lensHeight = 20;
    const beamAngleOffset = 45; 
    const dot_radius = 5; 

    microscopeCtx.font = "12px Arial";
    const sampleY = H - 180; 
    
    // --- 1. 시료 표면 그리기 (고정) ---
    microscopeCtx.beginPath();
    microscopeCtx.moveTo(20, sampleY);
    microscopeCtx.lineTo(W - 20, sampleY);
    microscopeCtx.strokeStyle = "#00227F"; 
    microscopeCtx.lineWidth = 3;
    microscopeCtx.stroke();
    
    // 시료 표면 텍스트: 왼쪽 정렬
    microscopeCtx.textAlign = "left"; 
    microscopeCtx.fillStyle = "#00227F"; 
    microscopeCtx.fillText(`시료 표면 (고정)`, 25, sampleY + 20); 

    // --- 2. 전자 빔 초점점 (Focus Spot) 계산 ---
    const spotMove = focusValue * 4; 
    const spotY = sampleY + spotMove; 
    const spotX = lensCenterX;

    // --- 3. 렌즈 및 빔 경로 그리기 ---
    
    // 렌즈 그리기
    microscopeCtx.beginPath();
    microscopeCtx.ellipse(lensCenterX, lensCenterY, lensWidth/2, lensHeight/2, 0, 0, Math.PI * 2);
    microscopeCtx.fillStyle = "rgba(0, 34, 127, 0.2)"; 
    microscopeCtx.fill();
    microscopeCtx.strokeStyle = "#00227F"; 
    microscopeCtx.lineWidth = 2;
    microscopeCtx.stroke();
    
    // 렌즈 텍스트: 가운데 정렬
    microscopeCtx.textAlign = "center"; 
    microscopeCtx.fillStyle = "#00227F"; 
    microscopeCtx.fillText("전자 렌즈", lensCenterX, lensCenterY - 30);

    // 빔 경로 그리기
    microscopeCtx.strokeStyle = "#0055AA"; 
    microscopeCtx.lineWidth = 2; 

    const startY = lensCenterY;
    const startX_left = lensCenterX - lensWidth/2;
    const startX_right = lensCenterX + lensWidth/2;
    const focusDistance = spotY - startY; 
    const beamHalfWidth = lensWidth / 2; 
    const hitDistance = sampleY - spotY; 
    
    let hitHalfWidth;
    if (Math.abs(focusDistance) < 1) { 
        hitHalfWidth = beamHalfWidth * (Math.abs(hitDistance) / 10 + 0.1); 
    } else {
        hitHalfWidth = (beamHalfWidth / Math.abs(focusDistance)) * hitDistance;
    }
    
    const endX_left_hit = spotX - hitHalfWidth;
    const endX_right_hit = spotX + hitHalfWidth;


    // 빔 왼쪽 경로 (렌즈 -> 초점 -> 시료 표면)
    microscopeCtx.beginPath();
    microscopeCtx.moveTo(startX_left, startY);      
    microscopeCtx.lineTo(spotX, spotY);             
    microscopeCtx.lineTo(endX_left_hit, sampleY); 
    microscopeCtx.stroke();

    // 빔 오른쪽 경로 (렌즈 -> 초점 -> 시료 표면)
    microscopeCtx.beginPath();
    microscopeCtx.moveTo(startX_right, startY);     
    microscopeCtx.lineTo(spotX, spotY);             
    microscopeCtx.lineTo(endX_right_hit, sampleY); 
    microscopeCtx.stroke();


    // --- 4. 초점점 (Spot) 그리기 ---
    
    // 초점점
    microscopeCtx.textAlign = "center"; 
    microscopeCtx.beginPath();
    microscopeCtx.arc(spotX, spotY, dot_radius, 0, Math.PI * 2);
    microscopeCtx.fillStyle = "#00227F"; 
    microscopeCtx.fill();
    
    // 초점점 텍스트: 아래 정렬
    microscopeCtx.fillStyle = "#00227F"; 
    microscopeCtx.fillText(`Focal point`, spotX, spotY + 30); 
}


// --- Spot Size 시각화 모델 그리기 함수 ---
function drawSpotSizeModel(focusValue) {
    spotSizeCtx.clearRect(0, 0, spotSizeCanvas.width, spotSizeCanvas.height);
    spotSizeCtx.textAlign = "center";
    spotSizeCtx.font = "12px Arial";
    spotSizeCtx.fillStyle = "#333333"; 
    spotSizeCtx.fillText("시료에 닿는 빔의 크기", spotSizeCanvas.width / 2, 20);

    const centerX = spotSizeCanvas.width / 2;
    const centerY = spotSizeCanvas.height / 2;
    
    const gridSize = 5; 
    const cellSize = 30; 
    
    const totalGridWidth = gridSize * cellSize;
    const gridStart_X = centerX - totalGridWidth / 2;
    const gridStart_Y = centerY - totalGridWidth / 2 + 50; 

    // 픽셀 그리드 그리기 (어두운 선)
    spotSizeCtx.strokeStyle = "#666666"; 
    spotSizeCtx.lineWidth = 1;
    for (let i = 0; i <= gridSize; i++) {
        // 수직선
        spotSizeCtx.beginPath();
        spotSizeCtx.moveTo(gridStart_X + i * cellSize, gridStart_Y);
        spotSizeCtx.lineTo(gridStart_X + i * cellSize, gridStart_Y + totalGridWidth);
        spotSizeCtx.stroke();
        // 수평선
        spotSizeCtx.beginPath();
        spotSizeCtx.moveTo(gridStart_X, gridStart_Y + i * cellSize);
        spotSizeCtx.lineTo(gridStart_X + totalGridWidth, gridStart_Y + i * cellSize);
        spotSizeCtx.stroke();
    }

    // 빔 스팟 그리기 (Focus 값에 따라 크기 조절)
    let spotRadius;
    spotSizeCtx.fillStyle = "#333333"; 
    
    if (Math.abs(focusValue) < 1) { // 초점이 맞았을 때 (작은 스팟)
        spotRadius = cellSize * 0.4; 
        spotSizeCtx.fillText("선명함: 빔이 하나의 픽셀보다 작음", centerX, 50);
    } else { // 초점이 맞지 않았을 때 (큰 스팟)
        spotRadius = cellSize * (0.4 + Math.abs(focusValue) * 0.12); 
        spotRadius = Math.min(spotRadius, cellSize * 2); 
        spotSizeCtx.fillText("흐림: 빔이 여러 픽셀에 걸쳐짐", centerX, 50);
    }

    // 빔 스팟을 격자 중앙에 그립니다.
    spotSizeCtx.beginPath();
    spotSizeCtx.arc(centerX, gridStart_Y + totalGridWidth / 2, spotRadius, 0, Math.PI * 2);
    spotSizeCtx.fillStyle = "rgba(0, 34, 127, 0.6)"; // ZEISS 블루 반투명 스팟
    spotSizeCtx.fill();
}


// --- 이벤트 리스너 ---

// Focus 슬라이더 조작 시 캔버스 다시 그리기
focusSlider.addEventListener('input', draw);


// ★ 페이지 로드 시 기본 이미지 자동 로드 및 초기화 ★
document.addEventListener('DOMContentLoaded', () => {
    // 1. 기본 이미지 로드
    loadImage(defaultImageURL);
});
