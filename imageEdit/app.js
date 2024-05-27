const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const lineWidth = document.getElementById('line_width');
const color = document.getElementById('text_color');
const backColor = document.getElementById('background_color');
const resetBtn = document.getElementById('reset');
const inputImage = document.getElementById('file');
const save = document.getElementById('save');
const drawing = document.getElementById('drawing');
const eraser = document.getElementById('eraser');
const brush = document.getElementById('brush');
const canvasWidth = document.getElementById('canvas_width');
const canvasHeight = document.getElementById('canvas_height');
const square = document.getElementById('square');
const triangle = document.getElementById('triangle');
const circle = document.getElementById('circle');
canvas.width = canvasWidth.value;
canvas.height = canvasHeight.value;
ctx.lineWidth = lineWidth.value;

let cPushArray = [];
let cStep = -1;

let isPainting = false;
let isDrawing = false;
let isBrushing = false;
let isErasing = false;

const textInput = document.getElementById('textInput');  // Changed from input to textarea

const textColorPicker = document.getElementById('textColorPicker');
const textSizeInput = document.getElementById('textSizeInput');
const fontWeightSelect = document.getElementById('fontWeightSelect');
const fontFamilySelect = document.getElementById('fontFamilySelect');
const addTextButton = document.getElementById('addTextButton');

let texts = [];
let isDragging = false;
let selectedTextIndex = -1;
let backgroundImage = null;

let brushStrokes = []; // 브러쉬로 그린 내용 저장
let penStrokes = []; // 펜으로 그린 내용 저장

function addTextToCanvas() {
    const text = textInput.value;
    const textColor = textColorPicker.value;
    const textSize = textSizeInput.value;
    const fontWeight = fontWeightSelect.value;
    const fontFamily = fontFamilySelect.value;

    texts.push({
        text: text,
        color: textColor,
        size: textSize,
        weight: fontWeight,
        font: fontFamily,
        x: 50,
        y: 50
    });
    redrawCanvas();
}


function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (backgroundImage) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }

    penStrokes.forEach(stroke => {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
            ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.stroke();
        ctx.restore();
    });

    brushStrokes.forEach(stroke => {
        ctx.save();
        ctx.globalAlpha = stroke.alpha;
        ctx.fillStyle = stroke.color;
        ctx.beginPath();
        ctx.arc(stroke.x, stroke.y, stroke.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });

    texts.forEach(textObj => {
        const lines = textObj.text.split('\n');
        ctx.fillStyle = textObj.color;
        ctx.font = `${textObj.weight} ${textObj.size}px ${textObj.font}`;
        const lineHeight = textObj.size * 1.2; // Adjust line height as needed
        lines.forEach((line, index) => {
            ctx.fillText(line, textObj.x, textObj.y + (index * lineHeight));
        });
    });
}


// 텍스트 클릭 확인
function isMouseOnText(mouseX, mouseY, textObj) {
    const padding = 10; // 클릭 범위를 확장하기 위한 여유 공간
    const textWidth = ctx.measureText(textObj.text).width;
    const lines = textObj.text.split('\n');
    const lineHeight = textObj.size * 1.2; // Adjust line height as needed
    const totalTextHeight = lines.length * lineHeight;

    return mouseX >= textObj.x - padding && mouseX <= textObj.x + textWidth + padding &&
           mouseY >= textObj.y - textObj.size - padding && mouseY <= textObj.y + totalTextHeight + padding;
}

// 캔버스에서 클릭 이벤트 처리
canvas.addEventListener('mousedown', function(event) {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    for (let i = 0; i < texts.length; i++) {
        if (isMouseOnText(mouseX, mouseY, texts[i])) {
            isDragging = true;
            selectedTextIndex = i;
            return;
        }
    }
});

// 캔버스에서 마우스 이동 이벤트 처리
canvas.addEventListener('mousemove', function(event) {
    if (isDragging && selectedTextIndex !== -1) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;
        texts[selectedTextIndex].x = mouseX;
        texts[selectedTextIndex].y = mouseY;
        redrawCanvas();
    }
});

// 캔버스에서 마우스 버튼을 놓는 이벤트 처리
canvas.addEventListener('mouseup', function(event) {
    isDragging = false;
    selectedTextIndex = -1;
});

// 텍스트 추가 버튼에 이벤트 리스너 등록
addTextButton.addEventListener('click', addTextToCanvas);

function onImg(event) {
    const files = event.target.files[0];
    const url = URL.createObjectURL(files);
    const img = new Image();
    img.src = url;
    img.onload = function () {
        backgroundImage = img;
        redrawCanvas();
        inputImage.value = null;
    };
}

function onReset() {
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    backColor.value = '#ffffff';
    cPushArray = [];
    cStep = -1;
    backgroundImage = null;
    texts = [];
    brushStrokes = [];
    penStrokes = [];
}

function onSave() {
    const url = canvas.toDataURL();
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Art.png';
    a.click();
}

function onKeyboard(event) {
    switch (event.keyCode) {
        case 81:
            onDraw();
            break;
        case 87:
            onBrush();
            break;
        case 69:
            onErase();
            break;
        case 65:
            onSquare();
            break;
        case 83:
            onTriangle();
            break;
        case 68:
            onCircle();
            break;
        case 90:
            if (event.ctrlKey) {
                onReturn();
            }
            break;
        case 46:
            onDelete();
            break;
    }
}

inputImage.addEventListener('change', onImg);
resetBtn.addEventListener('click', onReset);
save.addEventListener('click', onSave);
document.addEventListener('keydown', onKeyboard);

function onMouseMove(event) {
    if (isPainting && isErasing) {
        ctx.save();
        ctx.strokeStyle = backColor.value;
        ctx.lineWidth = lineWidth.value * 3;
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        ctx.restore();
    } else if (isPainting && isDrawing) {
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        penStrokes[penStrokes.length - 1].points.push({ x: event.offsetX, y: event.offsetY });
    } else if (isPainting && isBrushing) {
        ctx.save();
        function distanceBetween(point1, point2) {
            return Math.sqrt(
                Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
            );
        }
        function angleBetween(point1, point2) {
            return Math.atan2(point2.x - point1.x, point2.y - point1.y);
        }
        ctx.globalAlpha = '0.02';
        ctx.lineWidth = 0;
        ctx.globalCompositeOperation = 'source-over';
        var currentPoint = { x: event.offsetX, y: event.offsetY };
        var dist = distanceBetween(lastPoint, currentPoint);
        var angle = angleBetween(lastPoint, currentPoint);
        for (var i = 0; i < dist; i += 3) {
            x = event.offsetX + Math.sin(angle) * i - 25;
            y = event.offsetY + Math.cos(angle) * i - 25;
            ctx.beginPath();
            ctx.arc(x + 25, y + 25, lineWidth.value * 5, false, Math.PI * 2, false);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            brushStrokes.push({
                x: x + 25,
                y: y + 25,
                radius: lineWidth.value * 5,
                color: ctx.fillStyle,
                alpha: ctx.globalAlpha
            });

        }
        lastPoint = currentPoint;
        ctx.restore();
    }
    ctx.moveTo(event.offsetX, event.offsetY);
}

function onMouseDown(event) {
    isPainting = true;
    lastPoint = { x: event.offsetX, y: event.offsetY };
    if (isDrawing || isErasing || isBrushing) {
        cStep++;
        cPushArray.push(canvas.toDataURL());
        if (isDrawing) {
            penStrokes.push({ points: [{ x: event.offsetX, y: event.offsetY }], color: ctx.strokeStyle, width: ctx.lineWidth });
        }
    }
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
}

function onMouseUp(event) {
    isPainting = false;
    if (isDrawing || isErasing || isBrushing) {
        ctx.closePath();
        cStep++;
        cPushArray.push(canvas.toDataURL());
    }
    ctx.save();
    ctx.beginPath();
}

function onBrush() {
    if (!isBrushing) {
        isBrushing = true;
        isErasing = false;
        isDrawing = false;
        brush.style.backgroundColor = 'gray';
        eraser.style.backgroundColor = '#171717';
        drawing.style.backgroundColor = '#171717';
    } else {
        isBrushing = false;
        brush.style.backgroundColor = '#171717';
    }
    redrawCanvas();
}

function onErase() {
    if (!isErasing) {
        isErasing = true;
        isDrawing = false;
        isBrushing = false;
        eraser.style.backgroundColor = 'gray';
        brush.style.backgroundColor = '#171717';
        drawing.style.backgroundColor = '#171717';
    } else {
        isErasing = false;
        eraser.style.backgroundColor = '#171717';
    }
    redrawCanvas();
}

function onDraw() {
    if (!isDrawing) {
        isDrawing = true;
        isBrushing = false;
        isErasing = false;
        drawing.style.backgroundColor = 'gray';
        brush.style.backgroundColor = '#171717';
        eraser.style.backgroundColor = '#171717';
    } else {
        isDrawing = false;
        drawing.style.backgroundColor = '#171717';
    }
    redrawCanvas();
}

function onColorChange(event) {
    ctx.strokeStyle = event.target.value;
    ctx.fillStyle = event.target.value;
}

function onBColorChange(event) {
    ctx.save();
    ctx.fillStyle = event.target.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}

function onDelete() {
    let tf = confirm('내용을 삭제하시겠습니까?');
    if (tf) {
        onReset();
    }
}



// 텍스트 더블 클릭 시 모달 열기
canvas.addEventListener('dblclick', function(event) {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    for (let i = 0; i < texts.length; i++) {
        if (isMouseOnText(mouseX, mouseY, texts[i])) {
             const padding = 10; // 클릭 범위를 확장하기 위한 여유 공간
            editingTextIndex = i;
            const textObj = texts[i];
            document.getElementById('popupTextInput').value = textObj.text;
            document.getElementById('popupTextColorPicker').value = textObj.color;
            document.getElementById('popupTextSizeInput').value = textObj.size;
            document.getElementById('popupFontWeightSelect').value = textObj.weight;
            document.getElementById('popupFontFamilySelect').value = textObj.font;
            document.getElementById('textEditPopup').style.display = 'block';
            return;
        }
    }
});

// 모달에서 업데이트 버튼 클릭 시 텍스트 수정
document.getElementById('updateTextButton').addEventListener('click', function(event) {
    if (editingTextIndex !== -1) {
        const textObj = texts[editingTextIndex];
        textObj.text = document.getElementById('popupTextInput').value;
        textObj.color = document.getElementById('popupTextColorPicker').value;
        textObj.size = document.getElementById('popupTextSizeInput').value;
        textObj.weight = document.getElementById('popupFontWeightSelect').value;
        textObj.font = document.getElementById('popupFontFamilySelect').value;
        redrawCanvas();
        document.getElementById('textEditPopup').style.display = 'none';
        editingTextIndex = -1;
    }
});

// 모달 닫기 버튼 클릭 시 모달 닫기
document.getElementById('closeTextPopup').addEventListener('click', function(event) {
    document.getElementById('textEditPopup').style.display = 'none';
    editingTextIndex = -1;
});

// 추가된 변수들
let editingTextIndex = -1;


canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mouseup', onMouseUp);
canvas.addEventListener('mouseleave', onMouseUp);
brush.addEventListener('click', onBrush);
eraser.addEventListener('click', onErase);
drawing.addEventListener('click', onDraw);
color.addEventListener('change', onColorChange);
resetBtn.addEventListener('click', onDelete);


