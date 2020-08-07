// import React, { PropTypes } from 'react'
// import { Map, List, toJS } from 'immutable'
// import { immutableRenderDecorator } from 'react-immutable-render-mixin'
//
// import thirdParty from 'app/thirdParty'
// import { upfile, showImg, getFileNameNoExt } from 'app/utils'
// import { Icon, Input, Button, Menu, Dropdown, Spin, message, Radio, Modal } from 'antd'
// const RadioGroup = Radio.Group
// import EnclosurePreview from 'app/containers/components/EnclosurePreview'
// //import PDF from 'react-pdf-js';
//
// import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
// import * as pzBombActions from 'app/redux/Edit/PzBomb/pzBomb.action.js'
//
// @immutableRenderDecorator
// export default
// class UploadImg extends React.Component {
//
// 	constructor() {
// 		super()
// 		this.state = {
// 			tagModal: false, //标签组件的状态
// 			tagValue: '无标签', //标签名
// 			currentIdx:'',//单前操作的id
// 			uploadingModal:false,//上传信息的组件状态
// 			fileTotal:'',//当前选择的文件数
// 			canFileTotal:'',//能上传的文件数
// 			fileMesage:[],//当前选择文件的信息
// 			errMessage:'',//上传错误的提示信息
// 			preview:false,//预览的图片的组件状态
// 			// rotate: 0, //旋转的角度
// 			// page: 0//当前预览图片的下标
// 		}
// 	}
//
// 	componentDidMount () {
//
// 		const eleFile = this.refs.fileDemo
// 		let file = null
// 		const reader = new FileReader()
// 		const img = new Image()
// 		let canvas = document.createElement('canvas')
// 		const context = canvas.getContext('2d')
//
// 		// 监听eleFile的change事件
// 		eleFile.addEventListener('change', (event) => {
//
// 			if (!event.target.files[0]) {
// 				return
// 			}
//
// 			this.props.dispatch(lrpzActions.switchLoadingMask())
//
// 			file = event.target.files[0]
//
// 			// 文件名中不允许包含@符号
// 			if (file['name'].indexOf('@') > -1) {
// 				this.setState({
// 					'uploadingModal': true,
// 					'errMessage': '文件名中不允许包含@符号'
// 				})
// 				//清空value,并退出
// 				event.target.value=''
// 				this.props.dispatch(lrpzActions.switchLoadingMask())
// 				return
// 			}
//
// 			// 限制附件名称长度不超过40字
// 			const filesLength = getFileNameNoExt(file['name'])
// 			if (filesLength.length > 40) {
// 				this.setState({
// 					'uploadingModal': true,
// 					'errMessage': '文件名称不能超过40字符'
// 				})
// 				//清空value,并退出
// 				event.target.value = ''
// 				this.props.dispatch(lrpzActions.switchLoadingMask())
// 				return
// 			}
//
// 			// 校验文件名是否已存在，存在就清空并退出
//
// 			const isReturn = this.checkEnclosureExist(file)
//
// 			if (isReturn) {
// 				//清空value避免上传同一个文件时没响应
// 				event.target.value = ''
// 				this.props.dispatch(lrpzActions.switchLoadingMask())
// 				return
// 			}
//
// 			// 如果选择的文件是图片，进行判断是否要压缩
// 			if (file['type'].substr(0,5) == 'image') {
// 				reader.readAsDataURL(file)
// 			} else {
// 				callback(file, 'FALSE')
// 			}
// 		})
//
// 		reader.onload = function(e) {
// 			img.src = e.target.result
// 		}
//
// 		// base64地址图片加载完毕后
// 		img.onload = () => {
//
// 			if (file['size'] > 2*1024*1024) {
//
// 				// 图片原始尺寸
// 				const originWidth = img.width
// 				const originHeight = img.height
//
// 				let zoom = 0.8
//
// 				if (file['size'] >= 4*1024*1024 && file['size'] < 7*1024*1024) {
// 					zoom = 0.7
// 				} else if (file['size'] >= 7*1024*1024 && file['size'] < 9*1024*1024) {
// 					zoom = 0.6
// 				} else if (file['size'] >= 9*1024*1024 && file['size'] <= 14*1024*1024) {
// 					zoom = 0.5
// 				} else if (file['size'] > 14*1024*1024) {
// 					message.error('文件大小不能超过14M', 3)
// 					eleFile.value = ''
// 					this.props.dispatch(lrpzActions.switchLoadingMask())
// 					return
// 				}
//
// 				// 目标尺寸
// 				const targetWidth = originWidth * zoom
// 				const targetHeight = originHeight * zoom
//
// 				// canvas对图片进行缩放
// 				canvas.width = targetWidth
// 				canvas.height = targetHeight
//
// 				// 清除画布
// 				context.clearRect(0, 0, targetWidth, targetHeight)
//
// 				// 钉钉window端不支持 canvas.toBlob
//
// 				// 图片压缩
// 				context.drawImage(img, 0, 0, targetWidth, targetHeight)
// 				// 图片压缩base64地址图片
// 				const dataurl = canvas.toDataURL('image/jpeg', 0.92)
// 				// 将base64地址变为二进制
// 				let blob = dataURLtoBlob(dataurl)
// 				// 将文件名称赋给blob对象
// 				blob.name = file['name']
//
// 				callback(blob, 'TRUE')
// 			} else {
// 				callback(file, 'TRUE')
// 			}
// 		}
//
// 		// 将地址转为二进制对象
// 		function dataURLtoBlob(dataurl) {
//
// 			let arr = dataurl.split(',')
// 			let mime = arr[0].match(/:(.*?);/)[1]
// 			let	bstr = atob(arr[1])
// 			let n = bstr.length
// 			let u8arr = new Uint8Array(n)
//
// 			while (n--) {
// 				u8arr[n] = bstr.charCodeAt(n)
// 			}
//
// 			return new Blob([u8arr], {type:'image/png'})
// 		}
//
// 		const callback = (file, imageOrFile) => {
//
// 			if (this.props.vcIndex) {
// 				this.props.dispatch(lrpzActions.checkEnclosureList(this.props.year, this.props.month, this.props.vcIndex, this.props.dirUrl, file['name'], imageOrFile, file))
// 				eleFile.value = ''
// 			} else {
// 				message.error('日期或凭证号加载异常，请重试')
// 			}
// 			this.props.dispatch(lrpzActions.switchLoadingMask())
// 		}
// 	}
// 	checkEnclosureExist = (file) => {
//
// 		const enclosureList = this.props.enclosureList
//
// 		let isReturn = false
// 		for (let i = 0; i < enclosureList.size; i ++) {
// 			if (enclosureList.getIn([i, 'fileName']) == file['name']) {
// 				message.error('该文件已存在')
// 				isReturn = true
// 				break
// 			}
// 		}
// 		return isReturn
// 	}
//
// 	render() {
//
// 		const {
// 			year,
// 			month,
// 			vcIndex,
// 			dispatch,
// 			PzPermissionInfo,//如果是 他的值时false
// 			closedBy,
// 			reviewedBy,
// 			token,
// 			sobid,
// 			dirUrl,
// 			enclosureList,
// 			label,
// 			//tagModal,
// 			enCanUse,
// 			checkMoreFj,
// 		} = this.props
// 		const { tagValue, currentIdx, uploadingModal, fileTotal, canFileTotal, fileMesage, errMessage, preview, tagModal, page } = this.state
// 		const radioStyle = {
// 			display: 'block',
// 			height: '30px',
// 			lineHeight: '30px'
// 		};
// 		const previewImgArr = enclosureList.filter(v => v.get('imageOrFile') === 'TRUE' || v.get('mimeType') === 'application/pdf')
//
// 		let deleteAndLabel=false;//删除图标和标签图标出现的状态
// 		if(PzPermissionInfo.getIn(['edit', 'permission']) && !closedBy && !reviewedBy){//是管理员观察员且未结账未审核
// 			deleteAndLabel = true;//出现
// 		}
// 		let showFj = true;
// 		if((closedBy || reviewedBy) && !enclosureList.size){//结账或审核且没有附件
// 			showFj = false
// 		}
//
// 		return (
// 			<div className="upload-part" style={{display : (showFj && enCanUse) ? '' : 'none'}}>
// 				<span style={{display: deleteAndLabel && enclosureList.size<9 && (checkMoreFj ? '' : 'none')}}>
// 					附件(最多上传九个)
// 				</span>
// 				<div>
// 					{/* 先展示 */}
// 					<div>
// 						{(enclosureList||[]).map((v,i) => (
// 							<div className='upload' key={i}>
// 								<div className='plus' onClick={() => {
// 									if (v.get('imageOrFile') === 'TRUE' || v.get('mimeType') == 'application/pdf') {
// 										let idx = 0
// 										previewImgArr.forEach((w,j) => {
// 											if (v.get('enclosurepath') === w.get('enclosurepath')) {
// 												idx = j;
// 												return
// 											}
// 										})
// 										console.log('idx', idx);
// 										this.setState({'preview':true,rotate:0, page: idx})
// 									} else {
// 										message.warn('仅图片格式支持预览')
// 									}
// 								}}>
// 									<img src={showImg(v.get('imageOrFile'), v.get('fileName'))}/>
// 								</div>
// 								<div>
// 									<p>{v.get('fileName')}</p>
// 									<span>
// 										{v.get('size')>=1024 ? (v.get('size')/1024).toFixed(2)+'M' :v.get('size')+'kb'}
// 									</span>
// 									<a href={v.get('enclosurepath')} download
// 										style={{display: PzPermissionInfo.getIn(['edit', 'permission']) ? '' : 'none'}}>
// 										<Icon type="download" />
// 									</a>
// 									<span className='tag'
// 										style={{display: deleteAndLabel ? '' : 'none'}}
// 										onClick={()=>{
// 											this.setState({currentIdx:i,tagValue:v.get('label'),"tagModal":true});
// 											dispatch(lrpzActions.getLabelFetch())
// 										}}
// 										>{v.get('label')==='无标签'? '添加标签':v.get('label')}
// 									</span>
// 								</div>
// 								<div className='icon-close' style={{display: deleteAndLabel ? '' : 'none'}}
// 									onClick={()=>{ dispatch(lrpzActions.deleteUploadImgUrl(i)) }}
// 									>
// 									<Icon type="close" />
// 								</div>
// 							</div>
// 						))}
// 					</div>
// 					{/* 上传 */}
// 					<div className='addFile'
// 						style={{display:deleteAndLabel && enclosureList.size<9 && checkMoreFj ? '' : 'none'}}>
// 						<input
// 							type="file"
// 							ref='fileDemo'
// 						/>
// 						<Icon type="plus"/>
// 					</div>
// 				</div>
// 				<Modal title="添加标签" visible={tagModal}
// 					onOk={()=>{
// 						dispatch(lrpzActions.changeTagName(currentIdx,tagValue))
// 						this.setState({"tagModal":false})
// 					}}
// 					onCancel={()=>this.setState({"tagModal":false})}>
// 					<RadioGroup onChange={(e)=>this.setState({tagValue:e.target.value})} value={tagValue}>
// 						{label.map((v, i) => <Radio style={radioStyle} key={i} value={v}>{v==='无标签' ? '取消标签' : v}</Radio>)}
// 					</RadioGroup>
// 				</Modal>
// 				<Modal title="上传失败" visible={uploadingModal}
// 					onOk={()=>this.setState({uploadingModal:false})}
// 					onCancel={()=>this.setState({uploadingModal:false})}>
// 					<p>{errMessage}</p>
// 				</Modal>
// 				<EnclosurePreview
// 					page={page}
// 					dispatch={dispatch}
// 					preview={preview}
// 					downloadPermission={PzPermissionInfo.getIn(['edit', 'permission'])}
// 					previewImgArr={previewImgArr}
// 					closePreviewModal={() => this.setState({preview:false})}
// 				/>
// 			</div>
// 		)
// 	}
// }
