// import React, { PropTypes } from 'react'
// import { Map, List, toJS, fromJS } from 'immutable'
// import { immutableRenderDecorator } from 'react-immutable-render-mixin'

// import thirdParty from 'app/thirdParty'
// import { getFileNameNoExt } from 'app/utils'
// import { message, Icon, Modal } from 'antd'
// import { ROOTPKT } from 'app/constants/fetch.constant.js'
// import plupload from 'plupload'
// //import PDF from 'react-pdf-js';

// import { switchLoadingMask } from 'app/redux/Home/All/all.action.js'

// @immutableRenderDecorator
// export default
// class UploadSearclosure extends React.Component {

// 	constructor() {
// 		super()
// 		this.state = {
// 			uploadingModal:false, //上传信息的组件状态
// 			errMessage:'', //上传错误的提示信息
// 			secondUpload: false,
// 			compressFileLength: 0,
// 		}
// 	}

// 	componentDidMount() {

// 		const that = this
//         var uploader = new plupload.Uploader({
//             browse_button : this.props.id, //触发文件选择对话框的按钮，为那个元素id
// 			drop_element : "drag-area", // 拖动上传感应区域
// 			multi_selection: true, // 单选
//             url: `${ROOTPKT}/aliyun/oss/callback`, //服务器端的上传页面地址
// 			filters: {
// 				// mime_types : [ //只允许上传图片和zip文件
// 				// { title : "Image files", extensions : "jpg,gif,png,bmp" },
// 				// { title : "Zip files", extensions : "zip,rar" },
// 				// { title : "Doc files", extensions : "xls,xlsx" }
// 				// ],
// 				max_file_size : '10mb', //最大只能上传10mb的文件
// 				prevent_duplicates : false, //不允许选取重复文件
// 			},
//         })

// 		uploader.init();

// 		uploader.bind('FilesAdded', function(uploader, files) {
// 			//每个事件监听函数都会传入一些很有用的参数，
// 			//我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
// 			if (that.props.uploadKeyJson.get('checkMoreFj') !== undefined && that.props.uploadKeyJson.get('checkMoreFj') === false) {
// 				files.forEach((v, i) => {
// 					uploader.removeFile(v.id)
// 				})
// 				that.setState({
// 					'uploadingModal': true,
// 					'errMessage': '贵公司的附件容量已用完'
// 				})
// 				return
// 			}

// 			// 上传起始
// 			if (files.length > 0) {
// 				// 判断是回炉重传的图片直接上传
// 				if (that.state.secondUpload) {
// 					that.setUploadParam(uploader, files[0].name, '')
// 					if (that.state.compressFileLength==1) {
// 						that.setState({
// 							'secondUpload': false,
// 							'compressFileLength': 0
// 						})
// 					} else {
// 						that.setState({
// 							compressFileLength: that.state.compressFileLength - 1
// 						})
// 					}
// 					return
// 				}

// 				that.props.dispatch(switchLoadingMask())
// 				if (files.length > 9 || files.length + that.props.enclosureList.size > 9) {
// 					message.error('最多上传9个附件', 3)
// 					files.forEach((v, i) => {
// 						uploader.removeFile(v.id)
// 					})
// 					that.props.dispatch(switchLoadingMask())
// 					return
// 				}

// 				let file = null
// 				let isCompression = false

// 				let checkedAllFileIsOk = true
// 				let isCompressionModalShow = false
// 				for (let i = 0; i < files.length; i++) { // 校验
// 					const fileCurrent = files[i]
// 					const fileName = fileCurrent['name']

// 					// 文件名中不允许包含@符号
// 					if (fileName.indexOf('@') > -1) {
// 						that.setState({
// 							'uploadingModal': true,
// 							'errMessage': '文件名中不允许包含@符号'
// 						})
// 						//清空value,并退出
// 						checkedAllFileIsOk = false
// 						files.forEach((v, i) => {
// 							uploader.removeFile(v.id)
// 						})
// 						that.props.dispatch(switchLoadingMask())
// 						break
// 					}

// 					// 限制附件名称长度不超过40字
// 					if (fileName.length > 40) {
// 						that.setState({
// 							'uploadingModal': true,
// 							'errMessage': '文件名称不能超过40字符'
// 						})
// 						checkedAllFileIsOk = false
// 						//清空value,并退出
// 						files.forEach((v, i) => {
// 							uploader.removeFile(v.id)
// 						})
// 						that.props.dispatch(switchLoadingMask())
// 						break
// 					}

// 					const isReturn = that.checkEnclosureExist(files[i])
// 					if (isReturn) {
// 						//清空value避免上传同一个文件时没响应
// 						that.setState({
// 							'uploadingModal': true,
// 							'errMessage': '文件名已存在'
// 						})
// 						checkedAllFileIsOk = false
// 						files.forEach((v, i) => {
// 							uploader.removeFile(v.id)
// 						})
// 						that.props.dispatch(switchLoadingMask())
// 						break
// 					}

// 					if (fileCurrent['type'].substr(0,5) == 'image' && fileCurrent['size'] > 200*1024) {
// 						isCompressionModalShow = true
// 					}
// 				}

// 				if (checkedAllFileIsOk) { // 校验没有问题后
// 					if (isCompressionModalShow) {
// 						that.props.dispatch(switchLoadingMask())
// 						thirdParty.Confirm({
// 							message: '请选择是否原图上传',
// 							title: "提示",
// 							buttonLabels: ['压缩上传', '原图上传'],
// 							onSuccess : (result) => {
// 								that.props.dispatch(switchLoadingMask())
// 								isCompression = result.buttonIndex === 1 ? false : true

// 								for (let j = 0; j < files.length; j++) {

// 									const reader = new FileReader()
// 									const img = new Image()
// 									let canvas = document.createElement('canvas')
// 									const context = canvas.getContext('2d')

// 									if (files[j]['type'].substr(0,5) == 'image') {
// 										// console.log('file', file);
// 										const fileCurrent = files[j].getNative()
// 										// console.log('files[j]', fileCurrent);
// 										reader.readAsDataURL(fileCurrent)

// 										reader.onload = function(e) {
// 											img.src = e.target.result
// 										}

// 										// base64地址图片加载完毕后
// 										img.onload = () => {

// 											let fileItem = files[j]
// 											if (fileItem['size'] > 200*1024) {

// 												if (isCompression) { // 选择压缩

// 													try {
// 														// 图片原始尺寸
// 														const originWidth = img.width
// 														const originHeight = img.height

// 														let zoom = 1

// 														// 目标尺寸
// 														const targetWidth = originWidth * zoom
// 														const targetHeight = originHeight * zoom

// 														// canvas对图片进行缩放
// 														canvas.width = targetWidth
// 														canvas.height = targetHeight

// 														// 清除画布
// 														context.clearRect(0, 0, targetWidth, targetHeight)

// 														// 钉钉window端不支持 canvas.toBlob

// 														// 图片压缩
// 														context.drawImage(img, 0, 0, targetWidth, targetHeight)
// 														// 图片压缩base64地址图片
// 														const dataurl = canvas.toDataURL('image/jpeg', 0.3)
// 														// 将base64地址变为二进制
// 														let blob = that.dataURLtoBlob(dataurl)
// 														// 将文件名称赋给blob对象
// 														blob.name = fileItem['name']

// 														if (fileItem.size < blob.size) { // 原图比压缩的小
// 															if (fileItem.size <= 2*1024*1024) { // 小于2M允许上传
// 																// that.callback(fileItem, j, files.length)
// 																// console.log('fileItem', fileItem);
// 																// that.setUploadParam(uploader, fileItem.name, '')
// 																if (j+1 === files.length) {
// 																	that.setUploadParam(uploader, '', false)
// 																	that.props.dispatch(switchLoadingMask())
// 																	// that.setState({
// 																	// 	secondUpload: false
// 																	// }) // 拖拽上传
// 																}
// 															} else {
// 																message('压缩上传失败，仅可上传原图')
// 																if (j+1 === files.length) {
// 																	that.props.dispatch(switchLoadingMask())
// 																	// that.setState({
// 																	// 	secondUpload: false
// 																	// })
// 																}
// 															}
// 														} else { // 压缩的比原图小
// 															if (blob.size <= 2*1024*1024) { // 小于2M允许上传
// 																// that.callback(blob, j, files.length)
// 																that.callback(uploader, fileItem.id, blob)
// 																that.setState({compressFileLength: that.state.compressFileLength+1, secondUpload: true})
// 																if (j+1 === files.length) {

// 																	that.setUploadParam(uploader, '', false)
// 																	that.props.dispatch(switchLoadingMask())
// 																	// that.setState({
// 																	// 	secondUpload: false
// 																	// })
// 																}
// 															} else {
// 																message('压缩上传失败，仅可上传原图')
// 																if (j+1 === files.length) {
// 																	that.props.dispatch(switchLoadingMask())
// 																	// that.setState({
// 																	// 	secondUpload: false
// 																	// })
// 																}
// 															}
// 														}
// 													} catch(err) {
// 														if (j+1 === files.length) {
// 															that.props.dispatch(switchLoadingMask())
// 															// that.setState({
// 															// 	secondUpload: false
// 															// })
// 														}
// 														that.setState({
// 															'uploadingModal': true,
// 															'errMessage': '图片压缩异常，不支持该图片压缩'
// 														})
// 													}

// 												} else { // 选择原图
// 													// that.setUploadParam(uploader, fileItem.name, '')
// 													if (j+1 === files.length) {

// 														that.setUploadParam(uploader, '', false)

// 														that.props.dispatch(switchLoadingMask())
// 														// that.setState({
// 														// 	secondUpload: false
// 														// })
// 													}
// 												}
// 											} else { // 小于等于200kb
// 												// that.setUploadParam(uploader, fileItem.name, '')
// 												if (j+1 === files.length) {

// 													that.setUploadParam(uploader, '', false)

// 													that.props.dispatch(switchLoadingMask())
// 													// that.setState({
// 													// 	secondUpload: false
// 													// })
// 												}
// 											}
// 										}

// 									} else {
// 										// that.setUploadParam(uploader, files[j].name, '')
// 										if (j+1 === files.length) {

// 											that.setUploadParam(uploader, '', false)

// 											that.props.dispatch(switchLoadingMask())
// 											// that.setState({
// 											// 	secondUpload: false
// 											// })
// 										}
// 									}
// 								}
// 							}
// 						})
// 					} else {
// 						for (let w = 0; w < files.length; w++) {

// 							that.setUploadParam(uploader, '', false)

// 							if (w+1 === files.length) {
// 								that.props.dispatch(switchLoadingMask())
// 								// that.setState({
// 								// 	secondUpload: false
// 								// })
// 							}
// 						}
// 					}
// 				}
// 			}
// 		})
// 		uploader.bind('FileUploaded', function(uploader, files, info) {
// 			uploader.removeFile(files.id) // 传成功的文件删除

// 			if (info.status == 200) {
// 				that.props.uploadEnclosureList([files.name, files, JSON.parse(info.response)])
//             } else if (info.status == 203) {
// 				message.info('上传到OSS成功，但是oss访问用户设置的上传回调服务器失败，失败原因是:' + info.response);
//             } else {
// 				message.info(info.response)
//             }
// 		})
// 		uploader.bind('BeforeUpload', function(uploader, files) {
// 			that.setUploadParam(uploader, files.name, true)
// 		})
// 		uploader.bind('Error', function(uploader, err) {
// 			if (err.code == -600) {
// 				message.info('文件最大不能超过10M')
//             } else if (err.code == -601) {
// 				message.info('不能上传所选择的文件类型')
//             } else if (err.code == -602) {
// 				message.info('这个文件已经上传过一遍了')
//             } else {
// 				message.info("Error xml:" + err.response)
//             }
// 		})
// 	}

// 	setUploadParam = (up, filename, ret) => {

// 		const key = this.props.uploadKeyJson.get('dir')
// 		let g_object_name = key
// 		let suffix = ''
// 		if (filename != '') {
// 			suffix = this.get_suffix(filename)
// 			g_object_name = this.calculateObjectName(filename, g_object_name)
// 		}
// 		let new_multipart_params = {
// 			'key': g_object_name,
// 			'policy': this.props.uploadKeyJson.get('policy'),
// 			'OSSAccessKeyId': this.props.uploadKeyJson.get('accessKeyId'),
// 			'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
// 			'callback' : this.props.uploadKeyJson.get('callback'),
// 			'signature': this.props.uploadKeyJson.get('signature'),
// 		}
// 		up.setOption({
// 			'url': this.props.uploadKeyJson.get('host'),
// 			'multipart_params': new_multipart_params
// 		})
// 		up.start()
// 	}

// 	callback = (uploader, id, newFile) => {  // 将压缩后的回炉重传
// 		uploader.removeFile(id) // yanzheng
// 		uploader.addFile(newFile)
// 	}
// 	reUploadFile = (uploader, oldFile, newFile) => {  // 将压缩后的回炉重传
// 		uploader.removeFile(oldFile.id) // yanzheng
// 		uploader.addFile(newFile.getNative())
// 	}

// 	get_suffix = (filename) => {
// 		let pos = filename.lastIndexOf('.')
// 		let suffix = ''
// 		if (pos != -1) {
// 			suffix = filename.substring(pos)
// 		}
// 		return suffix
// 	}

// 	calculateObjectName = (filename, g_object_name) => {
// 		const timestamp = new Date().getTime()
// 		const name = g_object_name + timestamp + '/' + `${filename}`
// 		return name
// 	}

// 	checkEnclosureExist = (file) => {
// 		const enclosureList = this.props.enclosureList ? this.props.enclosureList : fromJS([])
// 		let isReturn = false
// 		for (let i = 0; i < enclosureList.size; i ++) {
// 			if (enclosureList.getIn([i, 'fileName']) == file['name']) {
// 				isReturn = true
// 				break
// 			}
// 		}
// 		return isReturn
// 	}

// 	dataURLtoBlob = (dataurl) => {
// 		let arr = dataurl.split(',')
// 		let mime = arr[0].match(/:(.*?);/)[1]
// 		let	bstr = atob(arr[1])
// 		let n = bstr.length
// 		let u8arr = new Uint8Array(n)
// 		while (n--) {
// 			u8arr[n] = bstr.charCodeAt(n)
// 		}
// 		return new Blob([u8arr], {type:'image/jpeg'})
// 	}

// 	render() {

// 		const {
// 			dispatch,
// 			enclosureList,
// 			uploadEnclosureList,
// 			style,
// 			uploadKeyJson,
// 			getUploadTokenFetch
// 		} = this.props

// 		const { uploadingModal, errMessage, secondUpload } = this.state

// 		return (
// 			<div
// 				className='enclosure-item enclosure-add-file'
// 				style={style}
// 				id="drag-area"
// 				onClick={() => {
// 					getUploadTokenFetch()
// 					this.setState({
// 						secondUpload: false
// 					})
// 				}}
// 			>
// 				<a className='enclosure-item-input' id={this.props.id === undefined ? 'browse' : this.props.id}></a>
// 				<Icon type="plus"/>
// 				<Modal
//                     title="上传失败"
//                     visible={uploadingModal}
// 					onOk={() => this.setState({uploadingModal: false})}
// 					onCancel={() => this.setState({uploadingModal: false})}>
// 					<p>{errMessage}</p>
// 				</Modal>
// 			</div>
// 		)
// 	}
// }
