import React from 'react'
import PropTypes from 'prop-types'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

@immutableRenderDecorator
export default
class ImgPreview extends React.Component {

	static displayName = 'ImgPreview'

	static propTypes = {
		imgUrl: PropTypes.string,
		imgWpercent: PropTypes.number,
		rotate: PropTypes.number,
		maxLimit:PropTypes.number,
		minLimit:PropTypes.number,
	}
	constructor(props){
		super(props)
		this.state={
			imgHeight:0,
			imgWidth:0
		}
	}
	componentDidMount() {
        this.drawImgScal(this.props.imgUrl, this.props.imgWpercent,this.props.maxLimit,this.props.minLimit)
	}

	componentWillReceiveProps(nextprops) {
        if (this.props.imgUrl !== nextprops.imgUrl) {
            this.drawImgScal(nextprops.imgUrl, nextprops.imgWpercent,this.props.maxLimit,this.props.minLimit)
        }
        // if (this.props.imgUrl === nextprops.imgUrl && this.props.imgWpercent !== nextprops.imgWpercent) {
        if (this.props.imgUrl === nextprops.imgUrl && this.props.imgWpercent !== nextprops.imgWpercent) {
            this.drawImgScal(this.props.imgUrl, nextprops.imgWpercent,this.props.maxLimit,this.props.minLimit)
        }
	}

    drawImgScal = (imgUrl, imgWpercent,maxLimit,minLimit) => {

		const that = this

		var canvas, context;
		var img,//图片对象
			imgIsLoaded,//图片是否加载完成;
			//console.log(imgWpercent)
			imgScale = imgWpercent/100,
			//imgScale = imgWpercent*10,
			targerWidth,
			targerHeight,
			max = maxLimit/100,
			min = minLimit/100
			;
		const loadImg = () => {
			img = new Image();
			img.onload = function () {
				imgIsLoaded = true;
				drawImage();
			}
			img.src = imgUrl

		}

		canvas = that.refs.bargraphCanvas; //画布对象
		context = canvas.getContext('2d');//画布显示二维图片
		loadImg()

		const drawImage = () => {
			if( -min <= imgScale && imgScale <= max){
				if(imgScale===0){
					targerWidth = img.width>960? 960:img.width * (Number(1+imgScale))
					targerHeight = img.width>960? 960 * img.height / img.width:img.height * (Number(1+imgScale))
				}else{
					targerWidth = img.width>960?960* (Number(1+imgScale)):img.width * (Number(1+imgScale))
					targerHeight = img.width>960?960 * img.height / img.width* (Number(1+imgScale)) :img.height * (Number(1+imgScale))
				}
				// targerWidth = img.width * imgScale
				// targerHeight = img.height * imgScale
				// targerWidth = 960 + imgScale
				// targerHeight = 960 * img.height / img.width + imgScale * img.height / img.width
				this.setState({imgHeight:targerHeight,imgWidth:targerWidth})
				canvas.width = targerWidth
				canvas.height = targerHeight

				context.clearRect(0, 0, targerWidth, targerHeight)
				context.drawImage(
					img, //规定要使用的图像、画布或视频。
					0,0, //开始剪切的 x 坐标位置。
					img.width,img.height, //被剪切图像的高度。
					0, 0,//在画布上放置图像的 x 、y坐标位置。
					targerWidth, targerHeight  //要使用的图像的宽度、高度
				)
			}else{
				return
			}
        }
	}
	 isVertail(number) {//上下为假 左右为真
	   if (number<90) {
	      return false;
	   }
	   if (number === 90) {
	      return true;
	  } else if (number % 180 === 0) {
	      return false;
	   }
	   return true
	}
	render() {
		const { imgUrl, imgWpercent, rotate } = this.props
		const {imgHeight,imgWidth} =this.state
		let ifVettail = this.isVertail(rotate)
		let marginLeft = 0
		let marginTop = 0
		let paddingTop = 0
		let paddingBottom = 0
		let paddingLeft = 0
		let paddingRight = 0


		if(ifVettail){//左右
			if(rotate == 90 || rotate===270){
				if(imgWidth>=imgHeight){
					if(imgHeight>960){//高大于960
						marginLeft = imgWidth-680
					}
					if(imgWidth>680){//宽大于960
						marginTop = imgWidth-680
					}
				}else{
					if(imgHeight>960){//高大于960
						marginLeft = imgHeight-960
					}
					if(imgWidth>680){//宽大于960
						//上下边距居中
						// marginTop = imgWidth-960
						//紧贴上边
						marginTop = imgWidth - 680
					}
				}
			}
		}else{//上下
			if(imgWidth>960){
				marginLeft = imgWidth-960
			}
			if(imgHeight>680){
				marginTop = imgHeight - 680
			}
		}
		

		return (
            <div className="img-box">
                <div className="img-box-contain">
                    {/* <img
                        ref='img-show'
                        src={previewItem.get(enclosureUrl)}
                        className={'scaleDrawDown1'}
                        // style={{transform:`rotate(${rotate}deg)`, width:`${imgWpercent}%`}}
                        style={{transform:`rotate(${rotate}deg) scale(${imgWpercent/100})`}}
                    /> */}
					<div className="img-box-contain-overflow">
							<canvas
								ref="bargraphCanvas"
								style={{transform:`rotate(${rotate}deg)`,
								marginLeft:`${marginLeft}px`,
								marginTop:`${marginTop}px`,
								display:"block"
							}}
							></canvas>
					</div>
                </div>
            </div>
		)
	}
}
