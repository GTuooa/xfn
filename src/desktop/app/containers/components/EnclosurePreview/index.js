import React from 'react'
import PropTypes from 'prop-types'
import { Map, List, toJS } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import './style.less'

import { Icon, Button } from 'antd'
import * as thirdParty from 'app/thirdParty'

import PdfPreview from './PdfPreview'
import ImgPreview from './ImgPreview'

import * as homeActions from 'app/redux/Home/home.action.js'

@immutableRenderDecorator
export default
class EnclosurePreview extends React.Component {

	static displayName = 'EnclosurePreview'

	static propTypes = {
		preview: PropTypes.bool,
		downloadPermission: PropTypes.bool,
		previewImgArr: PropTypes.instanceOf(List),
		closePreviewModal: PropTypes.func,
		dispatch: PropTypes.func,
		page: PropTypes.number,
		type: PropTypes.string,
	}

	constructor(props) {
		super(props)
		this.state = {
			rotate: 0, //旋转的角度
			magnificationRate: 1,
			imgWpercent: 0,
			idx: ''
		}
	}

	componentDidMount() {
		this.props.dispatch(homeActions.setDdConfig())
	}

	componentWillReceiveProps(nextprops, nextstate) {
		if (this.props.preview == false && nextprops.preview == true) {
			this.setState({
				rotate: 0, //旋转的角度
				magnificationRate: 1,
				imgWpercent: 0,
				idx: nextprops.page,
				maxLimit:40,
				minLimit:40,
			})
		}
	}
	handleRotate(rotate){
		if(rotate === 270){
			this.setState({'rotate': 0})
		} else {
			this.setState({'rotate': rotate + 90 })
		}
		
	}
	render() {

		const { preview, downloadPermission, previewImgArr, closePreviewModal, downloadEnclosure, dispatch, page, type, uploadKeyJson } = this.props
		const { idx, rotate, magnificationRate, imgWpercent ,maxLimit,minLimit} = this.state

		const previewItem = previewImgArr.get(idx)
		// const enclosureUrl = type == 'ls' ? 'enclosurePath' : 'enclosurepath'
		const enclosureUrl = 'enclosurePath'

		return (
			<div className='preview' style={{display: preview ? '' : 'none'}} onClick={e => {
				// closePreviewModal()
				// event.stopPropagation()
			}}
			>
				<div className='nav'>
					<button onClick={()=>this.setState({idx: idx - 1, imgWpercent: 0, rotate:0})}
						disabled={idx == 0 ? true : false}>
						<Icon type="left-circle" />
						<div>上一张</div>
					</button>
				{/*** 		<button disabled={previewItem && previewItem.get('imageOrFile') !== 'TRUE'} onClick={()=> this.setState({'rotate': rotate + 90 })}> 	*/}
					<button disabled={previewItem && previewItem.get('imageOrFile') !== 'TRUE'} onClick={(e)=>this.handleRotate(rotate,e)}>  
						<Icon type="reload" />
						<div>旋转</div>
					</button>
					{
						previewItem && previewItem.get('mimeType') === 'application/pdf' ?
						<button
							disabled={magnificationRate === 0.5}
							onClick={() => {
								// if (magnificationRate === 1) {
								// 	this.setState({'magnificationRate': 0.5})
								// } else {
									this.setState({'magnificationRate': magnificationRate - 0.5})
								// }
							}}
						>
							<Icon type="zoom-out" />
							<div>缩小</div>
						</button> :
						<button
							disabled={-minLimit>=imgWpercent}
							onClick={()=> {
								this.setState({'imgWpercent': imgWpercent - 10 })
							}}
						>
							<Icon type="minus-circle" />
							<div>缩小</div>
						</button>
					}
					{
						previewItem && previewItem.get('mimeType') == 'application/pdf' ?
						<button
							disabled={magnificationRate >= 4 || previewItem.get('mimeType') !== 'application/pdf' }
							onClick={() => {
								// if (magnificationRate === 0.5) {
								// 	this.setState({'magnificationRate': 1})
								// } else {
									this.setState({'magnificationRate': magnificationRate + 0.5})
								// }
							}}
						>
							<Icon type="zoom-in" />
							<div>放大</div>
						</button> :
						<button
						 	disabled={imgWpercent>=maxLimit}
							onClick={()=> {
								// if(imgWpercent < 200){
									this.setState({'imgWpercent': imgWpercent + 10 })
								// }

							}}
						>
							<Icon type="plus-circle" />
							<div>放大</div>
						</button>
					}
					<button disabled={!downloadPermission} >
						{
							!downloadPermission ?
							<a>
								<Icon type="download" />
								<div>下载</div>
							</a> :
							// <span onClick={() => downloadEnclosure(previewImgArr.getIn([idx, enclosureUrl]), previewImgArr.getIn([idx, 'fileName']))}>
							<span onClick={() => downloadEnclosure(previewImgArr.getIn([idx, 'signedUrl']), previewImgArr.getIn([idx, 'fileName']))}>
								<Icon type="download" />
								<div>下载</div>
							</span>
							// 后端下载
							// <a href={previewImgArr.getIn([idx, enclosureUrl])} download>
							// 	<Icon type="download" />
							// 	<div>下载</div>
							// </a>
						}
					</button>
					<button disabled={!(previewItem && (previewItem.get('mimeType') == 'application/pdf'))}  onClick={()=>{
						if (previewItem && (previewItem.get('mimeType') == 'application/pdf')) {
							thirdParty.openLink({
								url: previewImgArr.getIn([idx, 'signedUrl'])
							})
						}
					}}>
						<Icon type="printer" />
						<div>打印</div>
					</button>
					<button onClick={()=>this.setState({idx: idx + 1, imgWpercent: 0, rotate:0})}
						disabled={idx === previewImgArr.size-1 ? true : false}>
						<Icon type="right-circle" />
						<div>下一张</div>
					</button>
				</div>
				{previewItem && previewItem.get('imageOrFile') === 'TRUE' && preview ?
					<ImgPreview
						// imgUrl={`${previewItem.get(enclosureUrl)}?${imgGetSuffix}`}
						imgUrl={`${previewItem.get('signedUrl')}`}
						// imgUrl={`${previewUrl}`}
						imgWpercent={imgWpercent}
						rotate={rotate}
						preview={preview}
						maxLimit={maxLimit}
						minLimit={minLimit}
					/>
					: ''
				}
				{previewItem && previewItem.get('mimeType') === 'application/pdf' && preview ?
					<PdfPreview
						pdfUrl={`${previewItem.get('signedUrl')}`}
						dispatch={dispatch}
						magnificationRate={magnificationRate}
						preview={preview}
					/>
					: ''
				}
				<div className="img-box" style={{display: previewItem && (previewItem.get('mimeType') !== 'application/pdf' && previewItem.get('imageOrFile') !== 'TRUE') ? '' : 'none'}}>
					<div className="img-box-contain">
						<div className="img-box-contain-overflow">
							<div className='noSupport'>
								<Icon type="file" />
								<p>仅图片及PDF格式支持预览</p>
							</div>
						</div>
					</div>
				</div>

				<div className="btnBar">
					<div className="title">预览</div>
					<div onClick={closePreviewModal} className="closeBtn"><Icon type="close" /></div>
				</div>
			</div>
		)
	}
	
}
