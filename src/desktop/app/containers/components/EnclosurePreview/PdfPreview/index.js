import React from 'react'
import PropTypes from 'prop-types'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import './style.less'

import { Menu, message }	from 'antd'
import { XfnIcon, Icon } from 'app/components'
import thirdParty from 'app/thirdParty'

import * as pzBombActions from 'app/redux/Edit/PzBomb/pzBomb.action.js'

@immutableRenderDecorator
export default
class PdfPreview extends React.Component {

	static displayName = 'PdfPreview'

	static propTypes = {
		pdfUrl: PropTypes.string,
		dispatch: PropTypes.func,
		magnificationRate: PropTypes.number
	}

	constructor(props) {
		super(props)
		this.state = {
			base64: '',
			broken: false,
			networkFaild: false
		}
	}

	componentDidMount() {

		this.props.dispatch(pzBombActions.getCxpzUploadEnclosure(this.props.pdfUrl, (value) => {
			if (!value)
				return

			this.setState({base64: value, broken: false})

			this.renderPdf(value)
		}))
	}

	componentWillReceiveProps(nextprops) {
		if (this.props.magnificationRate !== nextprops.magnificationRate) {
			this.renderPdf(this.state.base64)
		}

		if (this.props.pdfUrl !== nextprops.pdfUrl) {
		// if (this.props.preview == false &&  nextprops.preview === true) {
			this.props.dispatch(pzBombActions.getCxpzUploadEnclosure(nextprops.pdfUrl, (value) => {
				if (!value)
					return

				this.setState({base64: value, broken: false, networkFaild: false})

				this.renderPdf(value)
			}))
		}
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
		// var loadingTask= PDFJS.getDocument(url)
		let pageSum = 0
		let pageCount = 0

		// loadingTask.onProgress = (e) => {
		// 	pageCount++
		// 	if (e.loaded === e.total || pageCount+1 >= pageSum) {
		// 	}
		// }
		const that = this

		loadingTask.promise.then(function (pdfDocument) {

			let canvas= ''
			pageSum = pdfDocument.numPages

			for (let i= 0; i < pdfDocument.numPages; i++) {
				canvas = document.createElement('canvas')
				canvas.id = `pdf_canvas_${i}`
				wrapperCanvas.appendChild(canvas)
			}

			for (let i= 0; i< pdfDocument.numPages; i++) {
				pdfDocument.getPage(i+ 1).then(function (pdfPage) {
					// Display page on the existing canvas with 100% scale.
					var viewport= pdfPage.getViewport(that.props.magnificationRate)
					var canvas= document.getElementById(`pdf_canvas_${i}`)
					canvas.width= viewport.width
					canvas.height= viewport.height
					var ctx= canvas.getContext('2d')
					var renderTask= pdfPage.render({
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
			// console.error('PDFPreviewError: ' + reason)
		})
	}

	render() {

		const { pdfUrl, dispatch, magnificationRate } = this.props
		const { broken, networkFaild } = this.state

		return (
			<div className="img-box">
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
			</div>
		)
	}
}
