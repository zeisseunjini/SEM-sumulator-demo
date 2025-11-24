// [script.js] 파일 전체 내용 (자동 이미지 로드 최종 통합)

// 전역 변수
let originalImage = null; 
let imgObj = new Image(); 

// --- 설정: 기본 이미지 URL ---
const defaultImageURL = 'default_sem_image.jpg'; // ★ 사용할 기본 이미지 파일명으로 변경하세요.

// 캔버스 및 Context
const mainCanvas = document.getElementById('mainCanvas');
const mainCtx = mainCanvas.getContext('2d');
const microscopeCanvas = document.getElementById('microscopeCanvas');
const microscopeCtx = microscopeCanvas.getContext('2d');
const spotSizeCanvas = document.getElementById('spotSizeCanvas');
const spotSizeCtx = spotSizeCanvas.getContext('2d');

// 슬라이더 엘리먼트 및 기타 UI
const focusSlider = document.getElementById('focusSlider'); // Focus/WD 조절
const messageBar = document.getElementById('message-bar');
const imgLoader = document.getElementById('imgLoader'); // 파일 업로드 input (수동 로드용)


// --- 이미지 로드 함수 ---
function loadImage(url) {
    imgObj = new Image();
    imgObj.onload = function() {
      originalImage = imgObj;
      messageBar.textContent = "시뮬레이션 이미지가 로드되었습니다. Focus를 조절해 보세요!";
      draw(); // 이미지 로드 후 캔버스에 그리기
    }
    imgObj.onerror = function() {
        messageBar.textContent = `오류: 기본 이미지 (${defaultImageURL})를 찾을 수 없습니다.`;
        originalImage = null;
        draw();
    }
    imgObj.src = url;
}


// --- 트랙 색상 업데이트 로직 (보라색 방지) ---
function updateSliderTrackColor() {
    if (!focusSlider) return; 
    const minVal = parseFloat(focusSlider.min);
    const maxVal = parseFloat(focusSlider.max);
    const focusValue = parseFloat(focusSlider.value);
    
    // 현재 값을 0% ~ 100% 범위로 변환하여 CSS 변수 (--focus-percent)에 설정
    const focusPercent = ((focusValue - minVal) / (maxVal - minVal)) * 100;
    focusSlider.style.setProperty('--range-percent', `${focusPercent}%`);
}


// --- 메인 그리기 함수 (모든 것을 처리) ---
function draw() {
    // 슬라이더 값 읽기
    const focusValue = parseFloat(focusSlider.value); // Focus/WD 조절 (-20~20)
    
    // --- 슬라이더 동적 채우기 로직 호출 ---
    updateSliderTrackColor(); 
    // ------------------------------------

    mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    if (originalImage) {
        
        // 1. 선명도 (Blur) 계산: Focus 값이 0에서 멀어질수록 이미지가 흐려집니다.
        let blurValue = Math.abs(focusValue) * 0.2; 
        
        // 메시지 업데이트
        if (Math.abs(focusValue) < 1) {
            messageBar.textContent = "✅ 초점 일치! 빔 크기가 가장 작아 이미지가 선명합니다.";
        } else {
            messageBar.textContent = "집속점이 시료 표면과 일치하지 않아 이미지가 흐립니다.";
        }

        // CSS 필터 적용
        mainCtx.filter = `blur(${blurValue}px)`;

        // 이미지 그리기
        const canvasWidth = mainCanvas.width;
        const canvasHeight = mainCanvas.height;
        mainCtx.drawImage(originalImage, 0, 0, canvasWidth, canvasHeight);
        
        // 필터 초기화
        mainCtx.filter = 'none';

    } else {
        mainCtx.font = "20px Arial";
        mainCtx.fillStyle = "#A8B4C0";
        mainCtx.textAlign = "center";
        mainCtx.fillText("샘플 이미지 로드 후 FOCUS를 조절하세요", mainCanvas.width / 2, mainCanvas.height / 2);
    }

    // 현미경 모델 그리기 함수 호출
    drawMicroscopeModel(focusValue);
    drawSpotSizeModel(focusValue);
}


// --- 현미경 모델 그리기 함수 (Focus/WD 및 빔 교차) ---
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
    const spotMove = -focusValue * 4; 
    const spotY = sampleY + spotMove; 
    const spotX = lensCenterX;

    // --- 3. 렌즈 및 빔 경로 그리기 (대칭 교차 및 확산 시각화) ---
    
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
    microscopeCtx.fillText("대물 렌즈", lensCenterX, lensCenterY - 20);

    // 빔 경로 그리기
    microscopeCtx.strokeStyle = "#0055AA"; 
    microscopeCtx.lineWidth = 1;

    const startY = lensCenterY;
    const startX_left = lensCenterX - beamAngleOffset;
    const startX_right = lensCenterX + beamAngleOffset;
    const focusDistance = spotY - startY; 
    const beamHalfWidth = beamAngleOffset; 
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
    microscopeCtx.textAlign = "center";
    microscopeCtx.beginPath();
    microscopeCtx.arc(spotX, spotY, dot_radius, 0, Math.PI * 2);
    microscopeCtx.fillStyle = "#00227F"; 
    microscopeCtx.fill();
    
    // 초점점 설명
    microscopeCtx.fillStyle = "#00227F"; 
    microscopeCtx.fillText(`WD`, spotX, spotY + 20);
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

    // 픽셀 그리드 그리기
    spotSizeCtx.strokeStyle = "#ADB5BD";
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
    
    if (Math.abs(focusValue) < 1) { // 초점이 맞았을 때
        spotRadius = cellSize * 0.4; 
        spotSizeCtx.fillText("선명함: 빔이 하나의 픽셀보다 작음", centerX, 50);
    } else { // 초점이 맞지 않았을 때
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

// 파일 로드 버튼을 통해 새로운 이미지 업로드 시
imgLoader.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(event) {
    loadImage(event.target.result);
  }
  reader.readAsDataURL(file);
});

// Focus 슬라이더 조작 시 캔버스 다시 그리기
focusSlider.addEventListener('input', draw);


// ★ 페이지 로드 시 기본 이미지 자동 로드 및 초기화 ★
document.addEventListener('DOMContentLoaded', () => {
    // 1. 기본 이미지 로드
    loadImage(defaultImageURL);
    
    // 2. 초기 값으로 한 번 그리기 (이미지 로드 완료 후 draw()가 자동으로 호출됨)
    // draw(); 
});