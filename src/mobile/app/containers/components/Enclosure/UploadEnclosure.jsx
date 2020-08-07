import React, { PropTypes } from 'react'
import { Map, List, toJS, fromJS } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Container, Row, ScrollView, Icon, Button } from 'app/components'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import { showImg, EXIF } from 'app/utils'
import { ImagePicker, Modal, InputItem } from 'antd-mobile'
import { SwitchText, SinglePicker } from 'app/components'
import { getFileNameNoExt } from 'app/utils'
import plupload from 'plupload'
import { ROOTCARD } from 'app/constants/fetch.constant.js'

@immutableRenderDecorator
export default
class UploadEnclosure extends React.Component {

	constructor() {
		super()
		this.state = {
			// secondUpload: false,
		}
	}

	componentDidMount() {

		const that = this
        var uploader = new plupload.Uploader({
            browse_button : 'browse', //触发文件选择对话框的按钮，为那个元素id
			multi_selection: true, // 单选
            url: `${ROOTCARD}/aliyun/oss/callback`, //服务器端的上传页面地址
			filters: {
				mime_types:{
					Image:[{ title : "Image files", extensions : "jpg,png,bmp,jpeg,gif,svg,webp" }]
				}[this.props.type] || '',
				// mime_types : [ //只允许上传图片和zip文件
				// { title : "Image files", extensions : "jpg,png,bmp" },
				// { title : "Zip files", extensions : "zip,rar" },
				// { title : "Doc files", extensions : "xls,xlsx" }
				// ],
				max_file_size : '10mb', //最大只能上传10mb的文件
				prevent_duplicates : false //不允许选取重复文件
			},
        })

		uploader.init();

		let fileSize = 0
		let index = 0
		let isReUpload = false

		uploader.bind('FilesAdded', function(up, files) {
			// console.log('files', files, files[0].name);
			//每个事件监听函数都会传入一些很有用的参数，
			//我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作

			if (that.props.uploadKeyJson.get('checkMoreFj') !== undefined && that.props.uploadKeyJson.get('checkMoreFj') === false) {
				files.forEach((v, i) => {
					up.removeFile(v.id)
				})
				return thirdParty.Alert('贵公司的附件容量已用完')
			}

			if (files.length > 0) {
				// 判断是回炉重传的图片直接上传
				if (that.state.secondUpload) {
				// 	console.log('上传');

				// 	// that.setUploadParam(uploader, '', true)
					return
				}

				thirdParty.toast.loading('上传中', 0)
				let enclosureCountNumber = that.props.enclosureList.size + files.length
				if (that.props.enclosureList.size > 9 || enclosureCountNumber > 9) {
					thirdParty.toast.hide()
					files.forEach((v, i) => {
						up.removeFile(v.id)
					})
					return thirdParty.Alert('最多上传九个附件', '确定')
				}

				let checkedAllFileIsOk = true
				for (let j = 0; j < files.length; j++) { // 校验

					const fileCurrent = files[j]
					const fileName = fileCurrent['name']

					const suffix = that.get_suffix(fileName)

					if (!suffix && !fileCurrent.type) { // 有些手机的微信图片有问题
					// 	files[j].name = fileName + '.jpg'
					// 	files[j].type = 'image/jpeg'
						that.setState({secondUpload: true})
					}

					// 文件名中不允许包含@符号
					// if (fileName.indexOf('@') > -1) {
					// 	thirdParty.Alert('文件名中不允许包含@符号', '确定')
					// 	//清空value,并退出
					// 	checkedAllFileIsOk = false
					// 	files.forEach((v, j) => {
					// 		uploader.removeFile(v.id)
					// 	})
					// 	thirdParty.toast.hide()
					// 	break
					// }

					// 限制附件名称长度不超过40字
					// if (fileName.length > 40 && fileCurrent['type'].substr(0,5) != 'image') {
					// 	thirdParty.Alert('文件名称不能超过40字符', '确定')
					// 	checkedAllFileIsOk = false
					// 	//清空value,并退出
					// 	files.forEach(v => {
					// 		uploader.removeFile(v.id)
					// 	})
					// 	thirdParty.toast.hide()
					// 	break
					// }

					// const isReturn = that.checkEnclosureExist(files[j])
					// if (isReturn) {
					// 	//清空value避免上传同一个文件时没响应
					// 	thirdParty.Alert('文件名已存在', '确定')
					// 	checkedAllFileIsOk = false
					// 	files.forEach((v, i) => {
					// 		uploader.removeFile(v.id)
					// 	})
					// 	thirdParty.toast.hide()
					// 	break
					// }

					if (fileCurrent['type'].substr(0,5) == 'image' && fileCurrent['size'] > 200*1024) {
						that.setState({secondUpload: true})
					}
				}

				if (checkedAllFileIsOk) { // 校验没有问题后

					// console.log('ccc', that.state.secondUpload);

					if (!isReUpload) {
						fileSize = files.length
					}

					for (let i = 0; i < files.length; i++) {
						let reader = new FileReader()
						let img = new Image()
						let canvas = document.createElement('canvas')
						const context = canvas.getContext('2d')
						let fileItem = files[i].getNative()
						const fileName = fileItem.name

						if (!fileItem['type'] && !that.get_suffix(fileName) && fileName.indexOf('mmexport') === 0) { // 微信出现type为空的图片的处理
							reader.readAsDataURL(fileItem)
						} else if (fileItem['type'].substr(0,5) == 'image') { // 如果选择的文件是图片，进行判断是否要压缩
							reader.readAsDataURL(fileItem)
						} else {
							if (i+1 === files.length) {
								that.setUploadParam(uploader, '', true) // 执行上传
								// thirdParty.toast.hide()
							}
						}

						// 获取图片的方向属性（ios拍照）
						let Orientation = null
						EXIF.getData(fileItem, function(){
							EXIF.getAllTags(fileItem)
							Orientation = EXIF.getTag(fileItem, 'Orientation')
						})

						reader.onload = function(e) {
							img.src = e.currentTarget.result
						}

						// base64地址图片加载完毕后
						img.onload = () => {

							if (fileItem['size'] > 200*1024 || (!fileItem['type'] && !that.get_suffix(fileItem.name) && fileName.indexOf('mmexport') === 0)) {

								if (that.props.isCompression || (!fileItem['type'] && !that.get_suffix(fileItem.name) && fileName.indexOf('mmexport') === 0)) { // 选择压缩
									// 图片原始尺寸
									// try {




										const originWidth = img.width
										const originHeight = img.height

										let zoom = 1

										// 目标尺寸
										const targetWidth = originWidth * zoom
										const targetHeight = originHeight * zoom

										// canvas对图片进行缩放
										canvas.width = targetWidth
										canvas.height = targetHeight

										// 清除画布
										context.clearRect(0, 0, targetWidth, targetHeight)

										const proportionH = targetHeight / targetWidth //高宽比
										const proportionW = targetWidth / targetHeight //宽高比

										// 钉钉window端不支持 canvas.toBlob

										//根据方向旋转图片
										if (Orientation && Orientation !== 1) {
											switch (Orientation) {
												case 6 :
													canvas.width = targetHeight
													canvas.height = targetWidth
													context.rotate(Math.PI / 2)
													context.drawImage(img, 0, -targetWidth * proportionH, targetHeight * proportionW, targetWidth * proportionH )
												break;
												case 3 :
													context.rotate(Math.PI)
													context.drawImage(img, -targetWidth, -targetHeight, targetWidth, targetHeight )
												break;
												case 8 :
													canvas.width = targetHeight
													canvas.height = targetWidth
													context.rotate(3 * Math.PI / 2)
													context.drawImage(img, -targetWidth * proportionH, 0,targetHeight * proportionW, targetWidth * proportionH)
												break;

											}
										} else {
											context.drawImage(img, 0, 0, targetWidth, targetHeight )
										}

										// 图片压缩base64地址图片
										if (!fileItem['type'] && !that.get_suffix(fileItem.name) && fileName.indexOf('mmexport') === 0) {

											let dataurl;
											if (fileItem['size'] > 200*1024 && that.props.isCompression) {
												dataurl = canvas.toDataURL('image/jpeg', 0.3)
											} else {
												dataurl = canvas.toDataURL('image/jpeg', 0.99)
											}

											// 将base64地址变为二进制
											let blob = that.dataURLtoBlob(dataurl)
											// 将文件名称赋给blob对象
											blob.name = fileItem['name']

											up.removeFile(files[i].id)
											isReUpload = true
											that.callback(uploader, files[i].id, blob)

											if (i+1 === files.length) {
												that.setUploadParam(uploader, '', true)
												// thirdParty.toast.hide()
											}

										} else {
											const dataurl = canvas.toDataURL('image/jpeg', 0.3)



											// 将base64地址变为二进制
											let blob = that.dataURLtoBlob(dataurl)
											// 将文件名称赋给blob对象
											blob.name = fileItem['name']

											if (fileItem['size'] < blob.size) { // 原图比压缩的小

												if (fileItem.size <= 2*1024*1024) { // 小于2M允许上传
													if (i+1 === files.length) {
														that.setUploadParam(uploader, '', true)
														// thirdParty.toast.hide()
													}
												} else {
													thirdParty.Alert('压缩上传失败，文件过大', '确定')
													if (i+1 === files.length) {
														thirdParty.toast.hide()
													}
													return
												}
											} else { // 压缩的比原图小
												if (blob.size <= 2*1024*1024) { // 小于2M允许上传
													up.removeFile(files[i].id)
													isReUpload = true

													that.callback(uploader, files[i].id, blob)

													if (i+1 === files.length) {
														that.setUploadParam(uploader, '', true)
														// thirdParty.toast.hide()
													}
													// if (i+1 === files.length) {
													// 	thirdParty.toast.hide()
													// }
												} else {
													thirdParty.Alert('压缩上传失败，文件过大', '确定')
													if (i+1 === files.length) {
														thirdParty.toast.hide()
													}
													return
												}
											}
										}
								} else { // 选择原图

									if (i+1 === files.length) {
										that.setUploadParam(uploader, '', true)
										// thirdParty.toast.hide()
									}
								}
							} else { // 小于等于200kb
								if (i+1 === files.length) {
									that.setUploadParam(uploader, '', true)
									// thirdParty.toast.hide()
								}
							}
						}
					}
				}
			}
		})
		uploader.bind('FileUploaded', function(up, files, info) {
			up.removeFile(files.id)
			index = index + 1
			if (info.status == 200) {
				let callbackJson = JSON.parse(info.response)
				const filesName = that.getFileName(callbackJson.data.enclosurePath)
				that.props.uploadFiles([callbackJson, files, filesName, index===fileSize])
            } else if (info.status == 203) {
				thirdParty.toast.info('上传到OSS成功，但是oss访问用户设置的上传回调服务器失败，失败原因是:' + info.response, 2);
            } else {
				thirdParty.toast.info(info.response, 2);
			}

			if (index === fileSize) {
				index = 0
				fileSize = 0
				isReUpload = false
				up.files.forEach(v => {
					up.removeFile(v.id)
				})
				// console.log('结束重制');
				// alert('结束重制');

			}
		})
		uploader.bind('BeforeUpload', function(up, files) {

			// console.log('BeforeUpload');
			let filesName = files.name

			if (files.type.indexOf('image') > -1) {
				filesName = that.calculateImgFileName(filesName)
			}
			that.setUploadParam(uploader, filesName, true) // 真正开始传文件
		})
		uploader.bind('Error', function(up, err) {
			if (err.code == -600) {
				thirdParty.Alert('文件最大不能超过10M', '确定')
            } else if (err.code == -601) {
				thirdParty.Alert('不能上传所选择的文件类型', '确定')
            } else if (err.code == -602) {
				thirdParty.Alert('这个文件已经上传过一遍了', '确定')
            } else {
				if (err.status === 0) {
					thirdParty.Alert("服务器正忙，请稍后再试", '确定')
				} else {
					thirdParty.Alert("上传出错:" + err.code + '-' + err.response, '确定')
				}
				// thirdParty.Alert("上传出错", '确定')
				index = index + 1
				if (index === fileSize) {
					index = 0
					fileSize = 0
					up.files.forEach(v => {
						up.removeFile(v.id)
					})
					thirdParty.toast.hide()
					// console.log('结束重制');
					// alert('结束重制');
				}
            }
		})
	}

	setUploadParam = (up, filename, ret) => {

		// console.log('filename:'+filename);
		const key = this.props.uploadKeyJson.get('dir')
		let g_object_name = key
		let suffix = ''
		if (filename != '') {
			suffix = this.get_suffix(filename)
			g_object_name = this.calculateObjectName(filename, g_object_name)
		}
		let new_multipart_params = {
			'key' : g_object_name,
			'policy': this.props.uploadKeyJson.get('policy'),
			'OSSAccessKeyId': this.props.uploadKeyJson.get('accessKeyId'),
			'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
			'callback' : this.props.uploadKeyJson.get('callback'),
			'signature': this.props.uploadKeyJson.get('signature'),
		}
		up.setOption({
			'url': this.props.uploadKeyJson.get('host'),
			'multipart_params': new_multipart_params
		})
		up.start()
	}

	checkEnclosureExist = (file) => {
		const enclosureList = this.props.enclosureList ? this.props.enclosureList : fromJS([])
		let isReturn = false
		for (let i = 0; i < enclosureList.size; i ++) {
			if (enclosureList.getIn([i, 'fileName']) == file['name']) {
				isReturn = true
				break
			}
		}
		return isReturn
	}

	callback = (up, id, newFile) => {  // 将压缩后的回炉重传
		this.setState({resizeTime: 1})
		// setTimeout(() => up.addFile(newFile), 1500)
		up.addFile(newFile)
	}

	get_suffix = (filename) => {
		let pos = filename.lastIndexOf('.')
		let suffix = ''
		if (pos != -1) {
			suffix = filename.substring(pos)
		}
		return suffix
	}

	calculateObjectName = (filename, g_object_name) => {
		// console.log('filenamecalculateObjectName', filename);
		const timestamp = new Date().getTime()
		const name = g_object_name + timestamp + '/' + `${filename}`
		return name
	}

	calculateImgFileName = (filename) => {
		let suffix = this.get_suffix(filename)
		const timestamp = new Date().getTime()
		const name = timestamp + suffix
		return name
	}
	getFileName = (filename) => {
		let pos = filename.lastIndexOf('/')
		const name = filename.substring(pos+1)
		return name
	}

	// 将地址转为二进制对象
	dataURLtoBlob = (dataurl) => {
		let arr = dataurl.split(',')
		let mime = arr[0].match(/:(.*?);/)[1]
		let	bstr = atob(arr[1])
		let n = bstr.length
		let u8arr = new Uint8Array(n)
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n)
		}
		return new Blob([u8arr], {type:'image/jpeg'})
	}

	render() {

		const {
			enclosureList,
			showckpz,
			getUploadGetTokenFetch,
			uploadFiles,
			isCompression
		} = this.props

		// const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent)

		return (
			<div
				className="enclosure-part-input-icon"
				style={{display: showckpz ? 'none' : ''}}
			>
				<a className='enclosure-part-upload-input needsclick' id="browse" onClick={(e) => {
					getUploadGetTokenFetch()
					this.setState({
						secondUpload: false
					})
				}}>
				</a>
				<Icon type='add' />
			</div>
		)
	}
}

// import React, { PropTypes } from 'react'
// import { Map, List, toJS, fromJS } from 'immutable'
// import { immutableRenderDecorator } from 'react-immutable-render-mixin'

// import { Container, Row, ScrollView, Icon, Button } from 'app/components'
// import thirdParty from 'app/thirdParty'
// import * as Limit from 'app/constants/Limit.js'
// import { showImg, EXIF } from 'app/utils'
// import { ImagePicker, Modal, InputItem } from 'antd-mobile'
// import { SwitchText, SinglePicker } from 'app/components'
// import { getFileNameNoExt } from 'app/utils'
// const alert = Modal.alert
// import plupload from 'plupload'
// import { ROOTCARD } from 'app/constants/fetch.constant.js'

// @immutableRenderDecorator
// export default
// class UploadEnclosure extends React.Component {

// 	constructor() {
// 		super()
// 		this.state = {
// 			secondUpload: false,
// 		}
// 	}

// 	componentDidMount() {

// 		const that = this
//         var uploader = new plupload.Uploader({
//             browse_button : 'browse', //触发文件选择对话框的按钮，为那个元素id
// 			multi_selection: true, // 单选
//             url: `${ROOTCARD}/aliyun/oss/callback`, //服务器端的上传页面地址
// 			filters: {
// 				// mime_types : [ //只允许上传图片和zip文件
// 				// { title : "Image files", extensions : "jpg,gif,png,bmp" },
// 				// { title : "Zip files", extensions : "zip,rar" },
// 				// { title : "Doc files", extensions : "xls,xlsx" }
// 				// ],
// 				max_file_size : '10mb', //最大只能上传10mb的文件
// 				prevent_duplicates : false //不允许选取重复文件
// 			},
//         })

// 		uploader.init();

// 		let fileSize = 0
// 		let index = 0

// 		uploader.bind('FilesAdded', function(up, files) {
// 			// console.log('files', files, files[0].name);
// 			//每个事件监听函数都会传入一些很有用的参数，
// 			//我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作

// 			if (that.props.uploadKeyJson.get('checkMoreFj') !== undefined && that.props.uploadKeyJson.get('checkMoreFj') === false) {
// 				files.forEach((v, i) => {
// 					up.removeFile(v.id)
// 				})
// 				return thirdParty.Alert('贵公司的附件容量已用完')
// 			}

// 			if (files.length > 0) {
// 				// 判断是回炉重传的图片直接上传
// 				if (that.state.secondUpload) {
// 					// that.setUploadParam(uploader, '', true)
// 					return
// 				}

// 				// alert('压缩');

// 				thirdParty.toast.loading('上传中', 0)
// 				let enclosureCountNumber = that.props.enclosureList.size + files.length
// 				if (that.props.enclosureList.size > 9 || enclosureCountNumber > 9) {
// 					thirdParty.toast.hide()
// 					files.forEach((v, i) => {
// 						up.removeFile(v.id)
// 					})
// 					return thirdParty.Alert('最多上传九个附件', '确定')
// 				}

// 				let checkedAllFileIsOk = true
// 				for (let j = 0; j < files.length; j++) { // 校验

// 					const fileCurrent = files[j]
// 					const fileName = fileCurrent['name']

// 					// 文件名中不允许包含@符号
// 					// if (fileName.indexOf('@') > -1) {
// 					// 	thirdParty.Alert('文件名中不允许包含@符号', '确定')
// 					// 	//清空value,并退出
// 					// 	checkedAllFileIsOk = false
// 					// 	files.forEach((v, j) => {
// 					// 		uploader.removeFile(v.id)
// 					// 	})
// 					// 	thirdParty.toast.hide()
// 					// 	break
// 					// }

// 					// 限制附件名称长度不超过40字
// 					// if (fileName.length > 40 && fileCurrent['type'].substr(0,5) != 'image') {
// 					// 	thirdParty.Alert('文件名称不能超过40字符', '确定')
// 					// 	checkedAllFileIsOk = false
// 					// 	//清空value,并退出
// 					// 	files.forEach(v => {
// 					// 		uploader.removeFile(v.id)
// 					// 	})
// 					// 	thirdParty.toast.hide()
// 					// 	break
// 					// }

// 					// const isReturn = that.checkEnclosureExist(files[j])
// 					// if (isReturn) {
// 					// 	//清空value避免上传同一个文件时没响应
// 					// 	thirdParty.Alert('文件名已存在', '确定')
// 					// 	checkedAllFileIsOk = false
// 					// 	files.forEach((v, i) => {
// 					// 		uploader.removeFile(v.id)
// 					// 	})
// 					// 	thirdParty.toast.hide()
// 					// 	break
// 					// }
// 					const suffix = that.get_suffix(fileName)

// 					if (!suffix && !fileCurrent.type) { // 有些手机的微信图片有问题
// 						that.setState({secondUpload: true})
// 					}

// 					if (fileCurrent['type'].substr(0,5) == 'image' && fileCurrent['size'] > 200*1024) {
// 						that.setState({secondUpload: true})
// 					}
// 				}

// 				if (checkedAllFileIsOk) { // 校验没有问题后

// 					fileSize = files.length
// 					for (let i = 0; i < files.length; i++) {
// 						let reader = new FileReader()
// 						let img = new Image()
// 						let canvas = document.createElement('canvas')
// 						const context = canvas.getContext('2d')
// 						let fileItem = files[i].getNative()

// 						// 如果选择的文件是图片，进行判断是否要压缩
// 						if (fileItem['type'].substr(0,5) == 'image') {
// 							reader.readAsDataURL(fileItem)
// 						} else {
// 							if (i+1 === files.length) {
// 								that.setUploadParam(uploader, '', true) // 执行上传
// 								// thirdParty.toast.hide()
// 							}
// 						}

// 						// 获取图片的方向属性（ios拍照）
// 						let Orientation = null
// 						EXIF.getData(fileItem, function(){
// 							EXIF.getAllTags(fileItem)
// 							Orientation = EXIF.getTag(fileItem, 'Orientation')
// 						})

// 						reader.onload = function(e) {
// 							img.src = e.currentTarget.result
// 						}
// 						// base64地址图片加载完毕后
// 						img.onload = () => {
// 							if (fileItem['size'] > 200*1024) {

// 								if (that.props.isCompression) { // 选择压缩
// 									// 图片原始尺寸
// 									// try {
// 										const originWidth = img.width
// 										const originHeight = img.height

// 										let zoom = 1

// 										// 目标尺寸
// 										const targetWidth = originWidth * zoom
// 										const targetHeight = originHeight * zoom

// 										// canvas对图片进行缩放
// 										canvas.width = targetWidth
// 										canvas.height = targetHeight

// 										// 清除画布
// 										context.clearRect(0, 0, targetWidth, targetHeight)

// 										const proportionH = targetHeight / targetWidth //高宽比
// 										const proportionW = targetWidth / targetHeight //宽高比

// 										// 钉钉window端不支持 canvas.toBlob

// 										//根据方向旋转图片
// 										if (Orientation && Orientation !== 1) {
// 											switch (Orientation) {
// 												case 6 :
// 													canvas.width = targetHeight
// 													canvas.height = targetWidth
// 													context.rotate(Math.PI / 2)
// 													context.drawImage(img, 0, -targetWidth * proportionH, targetHeight * proportionW, targetWidth * proportionH )
// 												break;
// 												case 3 :
// 													context.rotate(Math.PI)
// 													context.drawImage(img, -targetWidth, -targetHeight, targetWidth, targetHeight )
// 												break;
// 												case 8 :
// 													canvas.width = targetHeight
// 													canvas.height = targetWidth
// 													context.rotate(3 * Math.PI / 2)
// 													context.drawImage(img, -targetWidth * proportionH, 0,targetHeight * proportionW, targetWidth * proportionH)
// 												break;

// 											}
// 										} else {
// 											context.drawImage(img, 0, 0, targetWidth, targetHeight )
// 										}

// 										// 图片压缩base64地址图片
// 										const dataurl = canvas.toDataURL('image/jpeg', 0.3)
// 										// 将base64地址变为二进制
// 										let blob = that.dataURLtoBlob(dataurl)
// 										// 将文件名称赋给blob对象
// 										blob.name = fileItem['name']

// 										if (fileItem['size'] < blob.size) { // 原图比压缩的小
// 											if (fileItem.size <= 2*1024*1024) { // 小于2M允许上传
// 												if (i+1 === files.length) {
// 													that.setUploadParam(uploader, '', true)
// 													// thirdParty.toast.hide()
// 												}
// 											} else {
// 												thirdParty.Alert('压缩上传失败，文件过大', '确定')
// 												if (i+1 === files.length) {
// 													thirdParty.toast.hide()
// 												}
// 												return
// 											}
// 										} else { // 压缩的比原图小
// 											if (blob.size <= 2*1024*1024) { // 小于2M允许上传
// 												up.removeFile(files[i].id)
// 												that.callback(uploader, files[i].id, blob)

// 												if (i+1 === files.length) {
// 													that.setUploadParam(uploader, '', true)
// 													// thirdParty.toast.hide()
// 												}
// 												// if (i+1 === files.length) {
// 												// 	thirdParty.toast.hide()
// 												// }
// 											} else {
// 												thirdParty.Alert('压缩上传失败，文件过大', '确定')
// 												if (i+1 === files.length) {
// 													thirdParty.toast.hide()
// 												}
// 												return
// 											}
// 										}

// 								} else { // 选择原图
// 									if (i+1 === files.length) {
// 										that.setUploadParam(uploader, '', true)
// 										// thirdParty.toast.hide()
// 									}
// 								}
// 							} else { // 小于等于200kb
// 								if (i+1 === files.length) {
// 									that.setUploadParam(uploader, '', true)
// 									// thirdParty.toast.hide()
// 								}
// 							}
// 						}
// 					}
// 				}
// 			}
// 		})
// 		uploader.bind('FileUploaded', function(up, files, info) {
// 			up.removeFile(files.id)

// 			index = index + 1

// 			if (info.status == 200) {
// 				const callbackJson = JSON.parse(info.response)
// 				const filesName = that.getFileName(callbackJson.data.enclosurePath)
// 				that.props.uploadFiles([callbackJson, files, filesName, index===fileSize])
//             } else if (info.status == 203) {
// 				thirdParty.toast.info('上传到OSS成功，但是oss访问用户设置的上传回调服务器失败，失败原因是:' + info.response, 2);
//             } else {
// 				thirdParty.toast.info(info.response, 2);
// 			}

// 			if (index === fileSize) {
// 				index = 0
// 				fileSize = 0
// 				up.files.forEach(v => {
// 					up.removeFile(v.id)
// 				})
// 				// console.log('结束重制');
// 				// alert('结束重制');

// 			}
// 		})
// 		uploader.bind('BeforeUpload', function(up, files) {

// 			console.log('BeforeUpload');
// 			let filesName = files.name
// 			if (files.type.indexOf('image') > -1) {
// 				filesName = that.calculateImgFileName(filesName)
// 			}
// 			that.setUploadParam(uploader, filesName, true) // 真正开始传文件
// 		})
// 		uploader.bind('Error', function(up, err) {
// 			if (err.code == -600) {
// 				thirdParty.Alert('文件最大不能超过10M', '确定')
//             } else if (err.code == -601) {
// 				thirdParty.Alert('不能上传所选择的文件类型', '确定')
//             } else if (err.code == -602) {
// 				thirdParty.Alert('这个文件已经上传过一遍了', '确定')
//             } else {
// 				// thirdParty.Alert("Error xml:" + err.response, '确定')
// 				thirdParty.Alert("上传出错", '确定')
// 				index = index + 1
// 				if (index === fileSize) {
// 					index = 0
// 					fileSize = 0
// 					up.files.forEach(v => {
// 						up.removeFile(v.id)
// 					})
// 					thirdParty.toast.hide()
// 					// console.log('结束重制');
// 					// alert('结束重制');
// 				}
//             }
// 		})
// 	}

// 	setUploadParam = (up, filename, ret) => {

// 		// console.log('filename:'+filename);

// 		const key = this.props.uploadKeyJson.get('dir')
// 		let g_object_name = key
// 		let suffix = ''
// 		if (filename != '') {
// 			suffix = this.get_suffix(filename)
// 			g_object_name = this.calculateObjectName(filename, g_object_name)
// 		}
// 		let new_multipart_params = {
// 			'key' : g_object_name,
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

// 	callback = (up, id, newFile) => {  // 将压缩后的回炉重传
// 		this.setState({resizeTime: 1})
// 		up.addFile(newFile)
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
// 		// console.log('filenamecalculateObjectName', filename);
// 		const timestamp = new Date().getTime()
// 		const name = g_object_name + timestamp + '/' + `${filename}`
// 		return name
// 	}

// 	calculateImgFileName = (filename) => {
// 		let suffix = this.get_suffix(filename)
// 		const timestamp = new Date().getTime()
// 		const name = timestamp + suffix
// 		return name
// 	}
// 	getFileName = (filename) => {
// 		let pos = filename.lastIndexOf('/')
// 		const name = filename.substring(pos+1)
// 		return name
// 	}

// 	// 将地址转为二进制对象
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
// 			enclosureList,
// 			showckpz,
// 			getUploadGetTokenFetch,
// 			uploadFiles,
// 			isCompression
// 		} = this.props

// 		// const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent)

// 		return (
// 			<div
// 				className="enclosure-part-input-icon"
// 				style={{display: showckpz ? 'none' : ''}}
// 				onClick={(e) => {
// 					getUploadGetTokenFetch()
// 					this.setState({
// 						secondUpload: false
// 					})

// 				}}
// 			>
// 				<a className='enclosure-part-upload-input needsclick' id="browse">
// 				</a>
// 				<Icon type='add' />
// 			</div>
// 		)
// 	}
// }
