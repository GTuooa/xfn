export default function createDraggableObject(preview) {
	let modalWidth = document.documentElement.clientWidth
	let modalHeight = document.documentElement.clientHeight
	window.onresize = function(){
		modalWidth = document.documentElement.clientWidth
		modalHeight = document.documentElement.clientHeight
	}

	console.log('sdf', preview);

	if(preview){/*更改事件为冒泡后－－阻止事件的冒泡*/
		preview.addEventListener('mousedown',function(e){
			e.stopPropagation()
		},false)
	}
	return {
		obj: null,
		left: 0,
		top: 0,
		oldX: 0,
		oldY: 0,
		width: 0,
		height: 0,
		isMouseLeftButtonDown: false,
		init: function (obj) {
			this.obj = obj;
			var that = this;
			/*当有附件预览时鼠标按下总是先触发凭证弹框的移动--更改事件为捕获*/
			this.obj.addEventListener('mousedown',function(){},true)
			this.obj.onmousedown = function (args) {
				var evt = args || event;
				evt.preventDefault();//阻止浏览器默认行为
				that.isMouseLeftButtonDown = true;
				that.oldX = evt.clientX;
				that.oldY = evt.clientY;
				if (this.currentStyle) {
					that.left = parseInt(this.currentStyle.left);
					that.top = parseInt(this.currentStyle.top);
					that.width = parseInt(this.currentStyle.width);
					that.height = parseInt(this.currentStyle.height);
				}
				else {
					var divStyle = document.defaultView.getComputedStyle(this, null);
					that.left = parseInt(divStyle.left);
					that.top = parseInt(divStyle.top);
					that.width = parseInt(divStyle.width);
					that.height = parseInt(divStyle.height);
				}
			};
			this.obj.onmousemove = function (args) {
					that.move(args || event);
			};
			this.obj.onmouseup = function () {
				that.isMouseLeftButtonDown = false;
			};
		},
		move: function (evt) {
			if (this.isMouseLeftButtonDown) {
				let dx = parseInt(evt.clientX - this.oldX);
				let dy = parseInt(evt.clientY - this.oldY);

				let allWidth = this.left + dx + this.width
				let allHeight = this.top + dy + this.height

				let shouldLeft = this.left + dx
				let shouldTop  = this.top  + dy

				if(allWidth > modalWidth){//距离超过浏览器的宽时－－距离为浏览器的宽减去modal的宽
					shouldLeft = modalWidth - this.width
				}
				if(allHeight > modalHeight){//距离超过浏览器的高时－－距离为浏览器的高减去modal的高
					shouldTop = modalHeight - this.height
				}

				if((this.left + dx) <= 0){//距离小于最左端时－－距离为0
					shouldLeft = 0
				}
				if((this.top + dy) <= 0){//距离小于最顶端时－－距离为0
					shouldTop = 0
				}
				this.obj.style.left = shouldLeft + 'px';
				this.obj.style.top  = shouldTop  + 'px';
			}
		}
	}
}
