import React from 'react'
import { connect }	from 'react-redux'
// import { Container, Row, ScrollView, Icon, Button } from 'app/components'
// import * as thirdParty from 'app/thirdParty'
// import { fromJS, toJS }	from 'immutable'
// import * as Limit from 'app/constants/Limit.js'
// import { showImg, EXIF } from 'app/utils'
// import './index.less'
// import { ImagePicker, Modal, InputItem } from 'antd-mobile'
// import { SwitchText,SinglePicker } from 'app/components'
// import { upfile, getFileNameNoExt } from 'app/utils'
// const alert = Modal.alert
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import Enclosure from 'app/containers/components/Enclosure'

@connect(state => state)
export default
class UploadFj extends React.Component {
	// constructor(props) {
	// 	super(props)
	// 	this.state = {
	// 		isChoose: false, //是否选择过
	// 		isCompression: true,
	// 	}
    // }
	//
	// // 将地址转为二进制对象
	// dataURLtoBlob = (dataurl) => {
	// 	let arr = dataurl.split(',')
	// 	let mime = arr[0].match(/:(.*?);/)[1]
	// 	let	bstr = atob(arr[1])
	// 	let n = bstr.length
	// 	let u8arr = new Uint8Array(n)
	//
	// 	while (n--) {
	// 		u8arr[n] = bstr.charCodeAt(n)
	// 	}
	//
	// 	return new Blob([u8arr], {type:'image/png'})
	// }
	//
	// callback = (file,i,length,e,enclosureCountNumber,Orientation) => {
	// 	this.props.dispatch(homeAccountActions.uploadFiles(this.props.dirUrl, file, this.props.PageTab,this.props.paymentType,i,length,enclosureCountNumber,Orientation))
	// 	if(i+1 === length && e.currentTarget){
	// 		e.currentTarget.value = ''
	// 	}
	// }


	render() {
		const { dispatch, enCanUse, editPermission, enclosureList, showlsfj, checkMoreFj, label, enclosureCountUser, allState, history } = this.props

		const uploadKeyJson = allState.get('uploadKeyJson')

		let previewImageList = []
		enclosureList.map(v => {
			if(v.get('imageOrFile') === 'TRUE'){
				previewImageList.push(v.get('signedUrl'))
			}

		})
		previewImageList = previewImageList.slice(0,9);
		// const preview = (i,v)=>{//附件预览
		// 	if(v.get('imageOrFile')==='TRUE'){
		//
		// 		const imageList = enclosureList.filter((w, j) => j<i && w.get('imageOrFile')==='TRUE')
		// 		const preIdx = imageList.size
		//
		// 		thirdParty.previewImage({
		// 			urls: previewImageList,//图片地址列表
		// 			current: previewImageList[preIdx],//当前显示的图片链接
		// 			onSuccess : function(result) {},
		// 			onFail : function() {}
		// 		})
		// 	}else{
		// 		thirdParty.Alert('文件格式暂不支持预览')
		// 	}
		// }

		// let showFj = true;
		// let deleteAndLabel=false;
		// if(editPermission){
		// 	deleteAndLabel = true;//出现
		// }
		// const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);

		return (
			<Enclosure
				formPage={'oldRunning'}
				className={''}
				dispatch={dispatch}
				enCanUse={enCanUse}
				editPermission={editPermission}
				enclosureList={enclosureList}
				showPzfj={showlsfj}
				checkMoreFj={checkMoreFj}
				label={label.toJS()}
				enclosureCountUser={enclosureCountUser}
				previewImageList={previewImageList}
				showckpz={false}
				uploadFiles={(value) => {
					dispatch(homeAccountActions.uploadFiles(...value))
				}}
				getUploadGetTokenFetch={() => {
					dispatch(homeAccountActions.getUploadGetTokenFetch())
				}}
				getLabelFetch={() => dispatch(homeAccountActions.getLabelFetch())}
				deleteUploadImgUrl={(index) => dispatch(homeAccountActions.deleteUploadFJUrl(index))}
				changeTagName={(index, tagValue) => dispatch(homeAccountActions.changeTagName(index, tagValue))}
				uploadKeyJson={uploadKeyJson}
				history={history}
			/>
		// 	<div className="lrls-fj">
		// 		<div
		// 			className="lrls-fj-upload-part"
		// 			style={{display : (showFj && enCanUse) ? '' : 'none'}}
		// 		>
		// 			{
		// 				pbFlag ?
		// 				<div
		// 					className="lrls-fj-title"
		// 					style={{display:deleteAndLabel && checkMoreFj ? '' : 'none'}}
		// 				>
		// 					<span className="lrls-fj-tips">附件 <span>(最多选择9个文件)</span></span>
		// 					<span className="lrls-fj-input-icon"
		// 						onClick={(e) => {
		// 							dispatch(homeAccountActions.getUploadGetTokenFetch())
		// 							dispatch(homeAccountActions.getLabelFetch())
		// 						}}>
		// 					<input
		// 						type='file'
		// 						ref='fjDemo'
		// 						className='lsfj-fj-input'
		// 						multiple='multiple'
		// 						onChange={(e, type, index) => {
		//
		// 							thirdParty.toast.loading('上传中', 0)
		// 							let canvas = document.createElement('canvas')
		// 							const context = canvas.getContext('2d')
		// 							const files = e.currentTarget.files
		//
		// 							let enclosureCountNumber = enclosureList.size + files.length
		// 							if(enclosureList.size > 9 || enclosureCountNumber > 9){
		// 								thirdParty.Alert('最多上传九个附件', '确定')
		// 								enclosureCountNumber = 9
		// 							}
		// 							if(files.length === 0){
		// 								thirdParty.toast.hide()
		// 								return
		// 							}
		// 							for(let i = 0; i < files.length; i++ ){
		// 								if(i+enclosureList.size >8 ){
		// 									thirdParty.toast.hide()
		// 									return
		// 								}
		// 								let reader = new FileReader()
		// 								let img = new Image()
		// 								let fileItem = files[i]
		// 								// 文件名中不允许包含@符号  (手机端不选择原图会有@符号，暂时去掉)
		// 								// if (fileItem['name'].indexOf('@') > -1) {
		// 								// 	thirdParty.Alert('文件名中不允许包含@符号', '确定')
		// 								// 	//清空value,并退出
		// 								// 	// e.currentTarget.value=''
		// 								// 	if(i+1 === files.length){
		// 								// 		thirdParty.toast.hide()
		// 								// 	}
		// 								// 	enclosureCountNumber--
		// 								// 	continue
		// 								// }
		// 								// 限制附件名称长度不超过40字
		// 								const filesLength = getFileNameNoExt(fileItem['name'])
		// 								if (filesLength.length > 40) {
		// 									thirdParty.Alert('文件名称不能超过40字符', '确定')
		// 									if(i+1 === files.length){
		// 										thirdParty.toast.hide()
		// 									}
		// 									enclosureCountNumber--
		// 									continue
		// 								}
		//
		// 								// 如果选择的文件是图片，进行判断是否要压缩
		// 								if (fileItem['type'].substr(0,5) == 'image') {
		// 									reader.readAsDataURL(fileItem)
		// 								} else {
		// 									this.callback(fileItem, i,files.length,e,enclosureCountNumber)
		// 								}
		//
		// 								reader.onload = function(e) {
		// 									img.src = e.currentTarget.result
		// 								}
		// 								// 获取图片的方向属性（ios拍照）
		// 								let Orientation = null
		// 								EXIF.getData(files[i], function(){
		// 									EXIF.getAllTags(files[i])
		// 									Orientation = EXIF.getTag(files[i], 'Orientation')
		// 								});
		// 								console.log(files[i]);
		// 								// base64地址图片加载完毕后
		// 								img.onload = () => {
		// 									// thirdParty.toast.loading(Limit.LOADING_TIP_TEXT, 0)
		// 									// 图片原始尺寸
		// 									const originWidth = img.width
		// 									const originHeight = img.height
		//
		// 									let zoom = 1
		//
		// 									// if (file['size'] >= 4*1024*1024 && file['size'] < 7*1024*1024) {
		// 									// 	zoom = 0.7
		// 									// } else if (file['size'] >= 7*1024*1024 && file['size'] < 9*1024*1024) {
		// 									// 	zoom = 0.6
		// 									// } else if (file['size'] >= 9*1024*1024 && file['size'] <= 10*1024*1024) {
		// 									// 	zoom = 0.5
		// 									// } else if (file['size'] > 10*1024*1024) {
		// 									// 	thirdParty.Alert('文件大小不能超过10M', 3)
		// 									// 	// eleFile.value = ''
		// 									// 	// this.props.dispatch(lrpzActions.switchLoadingMask())
		// 									// 	return
		// 									// }
		//
		// 									// 目标尺寸
		// 									const targetWidth = originWidth * zoom
		// 									const targetHeight = originHeight * zoom
		//
		// 									// canvas对图片进行缩放
		// 									canvas.width = targetWidth
		// 									canvas.height = targetHeight
		//
		// 									// 清除画布
		// 									context.clearRect(0, 0, targetWidth, targetHeight)
		//
		// 									const proportionH = targetHeight / targetWidth //高宽比
		// 									const proportionW = targetWidth / targetHeight //宽高比
		//
		// 									// 钉钉window端不支持 canvas.toBlob
		//
		// 									//根据方向旋转图片
		// 									if(Orientation && Orientation !== 1){
		// 										switch(Orientation){
		// 											case 6 :
		// 												canvas.width = targetHeight
		// 												canvas.height = targetWidth
		// 												context.rotate(Math.PI / 2)
		// 												context.drawImage(img, 0, -targetWidth * proportionH, targetHeight * proportionW, targetWidth * proportionH )
		// 											break;
		// 											case 3 :
		// 												context.rotate(Math.PI)
		// 												context.drawImage(img, -targetWidth, -targetHeight, targetWidth, targetHeight )
		// 											break;
		// 											case 8 :
		// 												canvas.width = targetHeight
		// 												canvas.height = targetWidth
		// 												context.rotate(3 * Math.PI / 2)
		// 												context.drawImage(img, -targetWidth * proportionH, 0,targetHeight * proportionW, targetWidth * proportionH)
		// 											break;
		//
		// 										}
		// 									}else{
		// 										context.drawImage(img, 0, 0, targetWidth, targetHeight )
		// 									}
		// 									if(fileItem['size'] > 200*1024 && fileItem['size'] < 10*1024*1024){
		// 										// if(isChoose){
		//
		// 										if(isCompression){
		//
		//
		//
		// 											// 图片压缩base64地址图片
		// 											const dataurl = canvas.toDataURL('image/jpeg', 0.3)
		//
		// 											// 将base64地址变为二进制
		// 											let blob = this.dataURLtoBlob(dataurl)
		// 											//
		// 											if(blob.size > 2097152){
		// 												thirdParty.Alert('压缩上传失败，请上传原图', '确定')
		// 												if(i+1 === files.length){
		// 													thirdParty.toast.hide()
		// 												}
		// 												return
		//
		// 											}
		// 											// 将文件名称赋给blob对象
		// 											blob.name = fileItem['name']
		// 											// 压缩后大小 大与原图，上传原图
		// 											if (fileItem['size'] < blob.size) {
		// 												this.callback(fileItem, i,files.length,e,enclosureCountNumber,Orientation)
		// 											} else {
		// 												this.callback(blob, i,files.length,e,enclosureCountNumber,Orientation)
		// 											}
		// 										} else {
		//
		// 											this.callback(fileItem, i,files.length,e,enclosureCountNumber,Orientation)
		// 										}
		// 									} else if (fileItem['size'] < 200*1024) {
		// 										this.callback(fileItem, i,files.length,e,enclosureCountNumber,Orientation)
		// 									} else {
		// 										thirdParty.Alert('文件大小不能超过10M', '确定')
		// 										if(i+1 === files.length){
		// 											thirdParty.toast.hide()
		// 										}
		// 										return
		// 									}
		// 								}
		// 							}
		// 						}}
		// 					/>
		// 					<Icon type='add' />
		// 					</span>
		//
		// 					<span className="lrls-fj-switch-text">
		//
		// 					{
		// 						<SwitchText
		// 							checked={isCompression}
		// 							checkedChildren='压缩'
		// 							unCheckedChildren='原图'
		// 							className='topBarSwitch'
		// 							onChange={() => {
		// 								this.setState({isCompression: !isCompression})
		// 							}}
		// 						/>
		// 					}
		//
		//
		//
		// 					</span>
		// 				</div> : ''
		// 			}
		//
		// 			<div>
		// 				{(enclosureList||[]).map((v,i) =>
		// 					<div className='lrls-fj-upload' key={i}>
		// 						<span
		// 						className='fj-close'
		// 						style={{'display':(!showlsfj&&deleteAndLabel)?'':'none'}}
		// 						onClick={()=>{ dispatch(homeAccountActions.deleteUploadFJUrl(i)) }}
		// 						>删除</span>
		// 						<img src={showImg(v.get('imageOrFile'),v.get('fileName'))} onClick={()=>preview(i,v)}/>
		// 						<ul onClick={()=>preview(i,v)}>
		// 							<li>{v.get('fileName')}</li>
		// 							<li>{v.get('size')+'kb'}</li>
		// 						</ul>
		// 						<SinglePicker district={label.toJS()} disabled={showlsfj} value='' onOk={(result) => {
		// 							dispatch(homeAccountActions.changeTagName(i,result.key))
		// 						}}>
		// 							<span className='fj-label' style={{display: deleteAndLabel ? '' : 'none'}}>
		// 								{v.get('label')==='无标签'?
		// 								<span>添加标签</span> :
		// 								<span className='fj-label-have'>{v.get('label')}</span>}
		// 							</span>
		// 						</SinglePicker>
		// 					</div>
		// 				)}
		// 			</div>
		// 			{
		// 				pbFlag ?
		// 				<div>
		// 					<span
		// 						style={{display : showlsfj || enclosureList.size > 8 ? 'none' : ''}}
		// 						onClick={(e) => {
		// 							dispatch(homeAccountActions.getUploadGetTokenFetch())
		// 						}}
		// 					>
		//
		// 					</span>
		// 				</div> : ''
		// 			}
		//
		// 		</div>
		// 		<ul className="form-tip" style={{display: !showlsfj && enCanUse && checkMoreFj ? '' : 'none'}}>
		// 			<li className="form-tip-item">
		// 				{/*手机端暂不支持上传附件*/}
		// 				建议不要选择上传“原图”，手机端操作上传单个附件超过200KB，图片格式会被自动压缩。
		// 			</li>
		// 		</ul>
		// 	</div>
		)
	}
}
