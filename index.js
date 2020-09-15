var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d');
canvas.setAttribute('width', canvas.offsetWidth)
canvas.setAttribute('height', canvas.offsetHeight)

// 画板
var board = {
    type: 'pencil', //画笔类型
    draw: false, //是否允许绘画
    beginX: 0,  //起始点X坐标
    beginY: 0,  //起始点Y坐标
    width: 4,  //线条宽度
    imageData: null, //图像数据
    color: '#000', //画笔颜色
    pencil: function (e) {
        var x = e.pageX - canvas.offsetLeft
        var y = e.pageY - canvas.offsetTop
        context.lineTo(x, y);  //保证线条连贯性
        context.strokeStyle = this.color;
        context.stroke();
    },
    rectangle: function (e) {
        var x = e.pageX - canvas.offsetLeft
        var y = e.pageY - canvas.offsetTop
        context.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        if (this.imageData !== null) {
            context.putImageData(this.imageData, 0, 0, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
        }
        context.beginPath();
        context.rect(this.beginX, this.beginY, x - this.beginX, y - this.beginY);
        context.strokeStyle = this.color;
        context.stroke();
        context.closePath();
    },
    circle: function (e) {
        var x = e.pageX - canvas.offsetLeft
        var y = e.pageY - canvas.offsetTop
        context.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        if (this.imageData !== null) {
            context.putImageData(this.imageData, 0, 0, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
        }
        context.beginPath();
        var rx = Math.abs(x - this.beginX) / 2  //椭圆X轴的半径。
        var ry = Math.abs(y - this.beginY) / 2  //椭圆Y轴的半径。
        var centerX = 0  //圆心X
        var centerY = 0  //圆心Y
        x - this.beginX > 0 ?
            centerX = this.beginX + (x - this.beginX) / 2 :
            centerX = x + (this.beginX - x) / 2;
        y - this.beginY > 0 ?
            centerY = this.beginY + (y - this.beginY) / 2 :
            centerY = y + (this.beginY - y) / 2;
        context.ellipse(centerX, centerY, rx, ry, 0, 0, Math.PI / 180 * 360)
        context.strokeStyle = this.color;
        context.stroke();
        context.closePath();
    },
    eraser: function (e) {
        var x = e.pageX - canvas.offsetLeft
        var y = e.pageY - canvas.offsetTop
        context.lineTo(x, y);
        context.strokeStyle = this.color;
        context.stroke();
    }
}
// 添加active类名
function addActiveClass(arr, ele) {
    arr.forEach(element => {
        element.id === ele ? element.classList.add('active') :
            element.classList.remove('active')
    });
}
// 图形
var pencil = document.getElementById('pencil')
var rectangle = document.getElementById('rectangle')
var circle = document.getElementById('circle')
var eraser = document.getElementById("eraser")
var shapeArr = [pencil, rectangle, circle, eraser]
pencil.onclick = function () {
    addActiveClass(shapeArr, 'pencil')
    board.type = 'pencil'
}
rectangle.onclick = function () {
    addActiveClass(shapeArr, 'rectangle')
    board.type = 'rectangle'
}
circle.onclick = function () {
    addActiveClass(shapeArr, 'circle')
    board.type = 'circle'
}
eraser.onclick = function () {
    addActiveClass(shapeArr, 'eraser')
    board.type = 'eraser'
}
// 粗细
var narrow = document.getElementById('narrow')
var normal = document.getElementById('normal')
var wide = document.getElementById('wide')
var widthArr = [narrow, normal, wide]
narrow.onclick = function () {
    addActiveClass(widthArr, 'narrow')
    board.width = 4
}
normal.onclick = function () {
    addActiveClass(widthArr, 'normal')
    board.width = 8
}
wide.onclick = function () {
    addActiveClass(widthArr, 'wide')
    board.width = 12
}
// 颜色
var color = document.getElementById('color')
color.onchange = function (e) {
    board.color = color.value
}
// 清空
var deleteBtn = document.getElementById('delete')
deleteBtn.onclick = function () {
    context.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    board.imageData = null
}
// 下载
var download = document.getElementById("download")
download.onclick = function () {
    var url = canvas.toDataURL();
    var link = document.querySelector('#download a')
    link.setAttribute('href', url)
}

// 监听鼠标按下事件
canvas.onmousedown = function (e) {
    board.draw = true
    context.lineWidth = board.width;  //线宽
    context.lineCap = 'round';  //线条的结束端点样式
    context.lineJoin = 'round';  //两条线相交时，所创建的拐角类型。
    //新图像如何绘制到已有的图像上。:默认。在目标图像上显示源图像。
    context.globalCompositeOperation = 'source-over';
    var x = e.pageX - canvas.offsetLeft
    var y = e.pageY - canvas.offsetTop
    board.beginX = x
    board.beginY = y
    if (board.type === 'pencil') {
        context.beginPath();
        context.moveTo(x, y);
    } else if (board.type === 'eraser') {
        context.beginPath();
        context.moveTo(x, y);
        //新图像如何绘制到已有的图像上。:在源图像之外显示目标图像。只有源图像之外的目标图像部分会被显示，源图像是透明的。
        context.globalCompositeOperation = "destination-out";
    }
}
// 监听鼠标移动事件
canvas.onmousemove = function (e) {
    if (board.draw) {
        board[board.type](e)
    }
}
// 监听鼠标抬起事件
canvas.onmouseup = function () {
    board.imageData = context.getImageData(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    board.draw = false
    if (board.type === 'pencil' || board.type === 'eraser') {
        context.closePath();
    }
}