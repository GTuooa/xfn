import React, { PropTypes } from 'react'
import { connect }	from 'react-redux'

import thirdParty from 'app/thirdParty'
import { USER_PAY_GUIDE } from 'app/constants/fetch.constant.js'
import { Container, Row, Icon, ScrollView } from 'app/components'
import './style.less'
import { previewEnclosureActions } from 'app/redux/Edit/PreviewEnclosure/index.js'

@connect(state => state)
export default
	class PreviewPdf extends React.Component {

	htmlWidth = 0//滚动容器的高度	

	constructor(props) {
		super(props)
		this.state = {
			// base64: '',
			broken: false,
			networkFaild: false
		}
	}

	componentDidMount() {
		thirdParty.setTitle({ title: 'PDF预览' })
		thirdParty.setIcon({
			showIcon: false
		})
		thirdParty.setRight({ show: false })

		if (this.props.previewEnclosureState.get('base64')) {
			this.setState({broken: false})
			
			this.renderPdf(this.props.previewEnclosureState.get('base64'))
		}
	
		// this.props.dispatch(previewEnclosureActions.getCxpzUploadEnclosure(this.props.previewEnclosureState.get('pdfUrl'), (value) => {
		// 	if (!value)
		// 		return

		// 	this.setState({base64: value, broken: false})

		// 	this.renderPdf(value)
		// }))

		const htmlWidth = document.getElementById('canvas_wrapper')
        this.htmlWidth = Number(window.getComputedStyle(htmlWidth).width.replace('px',''))
	}

	componentWillReceiveProps(nextprops) {

		console.log('dededfef');
		
		// if (this.props.magnificationRate !== nextprops.magnificationRate) {
		// 	this.renderPdf(this.state.base64)
		// }

		// if (this.props.previewEnclosureState.get('pdfUrl') !== nextprops.previewEnclosureState.get('pdfUrl')) {
		// // if (this.props.preview == false &&  nextprops.preview === true) {
		// 	this.props.dispatch(pzBombActions.getCxpzUploadEnclosure(nextprops.previewEnclosureState.get('pdfUrl'), (value) => {
		// 		if (!value)
		// 			return

		// 		this.setState({base64: value, broken: false, networkFaild: false})

		// 		this.renderPdf(value)
		// 	}))
		// }
	}

	renderPdf = (value) => {

		let wrapperCanvas = document.getElementById('canvas_wrapper')
	
		wrapperCanvas.innerHTML = ""
		

		let pdfData = atob(value)

		let PDFJS = window['PDFJS']

		if (PDFJS) {
			PDFJS.cMapUrl = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.0.288/cmaps/'
			PDFJS.cMapPacked = true
		} else {
			this.setState({networkFaild: true})
			return message.info('网路问题导致PDF预览相关文件加载失败', 2)
		}

		if (!PDFJS.getDocument) {
			this.setState({networkFaild: true})
			return message.info('网路问题导致PDF预览相关文件加载失败', 2)
		}

		let loadingTask = PDFJS.getDocument({data: pdfData})
	
	
		const that = this

		loadingTask.promise.then(function (pdfDocument) {

			let canvas= ''
			let pageSum = pdfDocument.numPages

			for (let i= 0; i < pdfDocument.numPages; i++) {
				canvas = document.createElement('canvas')
				canvas.id = `pdf_canvas_${i}`
				wrapperCanvas.appendChild(canvas)
			}

			for (let i= 0; i< pdfDocument.numPages; i++) {
				pdfDocument.getPage(i+ 1).then(function (pdfPage) {
					// Display page on the existing canvas with 100% scale.
					// var viewport= pdfPage.getViewport(that.props.magnificationRate)
					const width = pdfPage.pageInfo.view[2]
		
					const PIXEL_RATIO = (() => {
						var canvas= document.getElementById(`pdf_canvas_${i}`)
						const ctx= canvas.getContext('2d'),
						 	dpr = window.devicePixelRatio || 1,
						  	bsr = ctx.webkitBackingStorePixelRatio ||
							ctx.mozBackingStorePixelRatio ||
							ctx.msBackingStorePixelRatio ||
							ctx.oBackingStorePixelRatio ||
							ctx.backingStorePixelRatio || 1;
					  
						return dpr / bsr;
					})()
					
					var viewport= pdfPage.getViewport((that.htmlWidth-20)/width)
					var canvas= document.getElementById(`pdf_canvas_${i}`)
					console.log('viewport.width', viewport.width);
					canvas.style.width = viewport.width + 'px';
					canvas.style.height = viewport.height + 'px';
					canvas.width= viewport.width * PIXEL_RATIO
					canvas.height= viewport.height * PIXEL_RATIO

					var ctx = canvas.getContext('2d')
					var renderTask= pdfPage.render({
						transform: [PIXEL_RATIO,0,0,PIXEL_RATIO,0,0],
						canvasContext: ctx,
						viewport: viewport
					});
					return renderTask.promise
				});
			}
		}).catch(function (reason) {

			let wrapperCanvas = document.getElementById('canvas_wrapper')
			wrapperCanvas.innerHTML = ""

			that.setState({broken: true})
			// thirdParty.Alert("PDF文件破损，无法预览")
			console.error('PDFPreviewError: ' + reason)
		})
	}

	render() {

		// const { pdfUrl, dispatch, magnificationRate } = this.props
		const { dispatch, previewEnclosureState } = this.props
		const { broken, networkFaild } = this.state

		return <Container className="img-box">
			<div className="img-box-contain">
				<div className="pdf-box-contain-overflow">
					<div className="pdf_canvas_main">
						<div className="pdf_canvas_pdf">
							<div id="canvas_wrapper">
							</div>
						</div>
					</div>
					{broken ?
						<div className='noSupport'>
							<Icon type="file" />
							<p>PDF文件损坏，无法预览</p>
						</div>
						: ''
					}
					{networkFaild ?
						<div className='noSupport'>
							<Icon type="file" />
							<p>网络异常，无法预览</p>
						</div>
						: ''
					}
				</div>
			</div>
		</Container>
	}
}
