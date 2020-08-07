import React, { PropTypes } from 'react'
import { Map, List, toJS, fromJS } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

// import * as thirdParty from 'app/thirdParty'
import { DateLib } from 'app/utils'
import { message, Icon } from 'antd'
// import { ROOTPKT, ROOT } from 'app/constants/fetch.constant.js'

import ClipBoardModal from './ClipBoardModal'

@immutableRenderDecorator
export default
class ClipBoard extends React.Component {

	constructor() {
		super()
		this.state = {
            clipBoardModalShow: false,
            clipBoardFile: '',
            clipBoardBlob: '',
            isCustomName: false,
            fileName: '',
            widthHeigthRate: 1
		}
    }
    
    componentDidMount() {

        // const element = document.getElementById('clipBoard')
        const element = document.getElementById(this.props.formPage ? this.props.formPage : "clipBoard")

        element.addEventListener(
            'paste',
            (e) => {
                let items = event.clipboardData && event.clipboardData.items;
                let file = null;
                if (items && items.length) {
                    for (let i = 0; i < items.length; i++) {
                        if (items[i].type.indexOf('image') !== -1) {
                            file = items[i].getAsFile(); // 此时file就是剪切板中的图片文件
                            break;
                        }
                    }
                };
                
                if (file) {

                    console.log('file', file);
                    

                    this.props.getUploadTokenFetch()

                    const reader = new FileReader()
                    const img = new Image()
                    // let canvas = document.createElement('canvas')
                    // const context = canvas.getContext('2d')

                    reader.readAsDataURL(file)
                    const that = this
                    reader.onload = function(e) {

                        img.src = e.target.result

                        img.onload = () => {
                            const originWidth = img.width
                            const originHeight = img.height
                            
                            that.setState({'clipBoardFile': file, 'clipBoardModalShow': true, 'clipBoardBlob': e.target.result, 'widthHeigthRate': originWidth/originHeight})
                        }  
                    }
                } else {
                    message.info('没有可粘贴的图片')
                }
            }
        )
    }

    get_suffix = (filename) => {
		let pos = filename.lastIndexOf('.')
		let suffix = ''
		if (pos != -1) {
			suffix = filename.substring(pos)
		}
		return suffix
	}
    
	render() {

		const {
            formPage,
			dispatch,
			enclosureList,
			uploadEnclosureList,
			style,
			uploadKeyJson,
            getUploadTokenFetch,
            clipUploadFile,
        } = this.props
        // const { clipBoardModalShow } = this.state

        const { clipBoardModalShow, clipBoardFile, clipBoardBlob, isCustomName, customName, widthHeigthRate } = this.state

		return (
			<div
				className='enclosure-clipboard-add-file'
				style={style}
				id="drag-area"
			>
				{/*<a className='enclosure-item-input' id={this.props.id === undefined ? 'browse' : this.props.id} onClick={() => {
					getUploadTokenFetch()
					this.setState({
						secondUpload: false
					})
				}} ></a>*/}
                <input id={formPage ? formPage : "clipBoard"} value='' className="enclosure-clipboard-add-btn" />
                <div className="enclosure-clipboard-add-fake-btn">
                    <p>在此区域内点击右键</p>
                    <p className="enclosure-clipboard-add-fake-btn-text">“粘贴”剪贴板中的图片</p>
                </div>
                <ClipBoardModal
                    clipBoardModalShow={clipBoardModalShow}
                    clipBoardFile={clipBoardFile}
                    clipBoardBlob={clipBoardBlob}
                    widthHeigthRate={widthHeigthRate}
                    onCancel={() => this.setState({'clipBoardModalShow': false, 'isCustomName': false, 'customName': ''})}
                    onOK={() => {
                        let fileName = ''
                        if (isCustomName) { // 自定义图片名称
                            if (customName) {

                                // 文件名中不允许包含@符号
                                if (customName.indexOf('@') > -1) {
                                    return message.info('文件名中不允许包含@符号')
                                }
            
                                // 限制附件名称长度不超过40字
                                if (customName.length > 40) {
                                    return message.info('文件名称不能超过40字符')
                                }

                                fileName = customName + '.jpg'
                            } else { 
                                return message.info('请输入自定义名称')
                            }
                        } else {  // 不自定义名称
                            fileName = '粘贴图片' + new DateLib().getFullDate() + '.jpg'
                        }
                        const file = new File([clipBoardFile], fileName, {type:clipBoardFile.type})
                        clipUploadFile(file)
                        this.setState({'clipBoardModalShow': false, 'isCustomName': false, 'customName': ''})
                    }}
                    isCustomName={isCustomName}
                    customName={customName}
                    changeIsCustomName={() => {
                        this.setState({
                            'isCustomName': !isCustomName
                        })
                    }}
                    changeCustomName={e => {
                        this.setState({
                            'customName': e.target.value
                        })
                    }}
                />
			</div>
		)
	}
}


// import React from 'react'
// import { connect }	from 'react-redux'
// import { fromJS } from 'immutable'
// import html2canvas from 'html2canvas'
// import Button from '../Button'
// import './style.less'
// import * as thirdParty from 'app/thirdParty'


// import plupload from 'plupload'
// import { ROOTCARD } from 'app/constants/fetch.constant.js'

// import { enclosureActions } from 'app/redux/Home/All/enclosure.js'

// @connect(state => state)
// export default
// class ScreenShot extends React.Component {

//     componentDidMount() {
// 		const that = this
//         var uploader = new plupload.Uploader({
//             browse_button : 'screenshot', //触发文件选择对话框的按钮，为那个元素id
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
//         that.props.dispatch(enclosureActions.getScreenShotUploadGetTokenFetch())

//         uploader.init();

//         uploader.bind('FileUploaded', function(up, files, info) {
			
// 			if (info.status == 200) {
// 				const callbackJson = JSON.parse(info.response)
//                 that.props.dispatch(enclosureActions.shareToOther(callbackJson, that.props.imgName))
//             } else if (info.status == 203) {
// 				thirdParty.toast.info('上传到OSS成功，但是oss访问用户设置的上传回调服务器失败，失败原因是:' + info.response, 2);
//             } else {
// 				thirdParty.toast.info(info.response, 2);
// 			}
// 			thirdParty.toast.hide()
//             up.files.forEach(v => {
//                 up.removeFile(v.id)
//             })
// 		})

//         // 第二种 监听点击事件
//         that.props.setFunction(() => {

//             thirdParty.toast.loading('加载中', 0)
//             let element
//             if (that.props.shotId) {
//                 element = document.getElementById(that.props.shotId)
//             } else if (that.props.shotClassArr instanceof Array) {
//                 element = that.props.shotClassArr.reduce((pre,cur) => {
//                     return pre.getElementsByClassName(cur)[0]
//                 },document)
//             }
//             var node = document.createElement("i")
//             element.appendChild(node)
//             // thirdParty.toast.loading('加载中...', 0)
//             // setTimeout(() => {
//             html2canvas(element, {
//                 windowWidth: element.scrollWidth,
//                 height: element.scrollHeight,
//                 windowHeight: element.scrollHeight + 200,
//                 // backgroundColor:'#cccccc'
//             })
//             .then(canvas => {
//                 let context = canvas.getContext("2d");
//                 const userInfo = that.props.homeState.getIn(['data', 'userInfo'])
//                 let userName = userInfo ? userInfo.get('username') : ''
//                 let corpId = userInfo ? userInfo.get('corpId') : ''

//                 let printText = `${userName} ${corpId}`
//                 let xRepeatTimes =  Math.ceil(element.scrollWidth/188) // 188 是1个提示文字端大致宽度
//                 for (let i = 0; i < xRepeatTimes; i++) {
//                     if (i > 0) {
//                         printText = printText + `                        ${userName} ${corpId}`
//                     }
//                 }

//                 let yRepeatTimes =  Math.ceil(element.scrollHeight/100) + xRepeatTimes // 100 上下行的距离
                
//                 // 绘制水印到canvas上
//                 context.rotate((-30 * Math.PI) / 180); // 水印初始偏转角度
//                 for (let i = 0; i < yRepeatTimes; i++) {
//                     context.font = "12px Arial";
//                     context.fillStyle = "rgba(0, 0, 0, 0.1)";
//                     context.fillText(printText, 10 -i*58, i * 100);
//                 }

//                 // 图片压缩base64地址图片
//                 const dataUrl = canvas.toDataURL("image/png")
//                 const blob = that.dataURLtoBlob(dataUrl);
//                 uploader.addFile(blob);
//                 that.setUploadParam(uploader);
//             })
//         })
//         // div.addEventListener('click', function(event) {

           
//         // })
//         // const printElement = document.getElementById('print-name')
         
//         // html2canvas(printElement, {
//         //     windowWidth: printElement.clientWidth ,
//         //     height: printElement.clientHeight,
//         //     windowHeight: printElement.clientHeight + 200,
           
//         // })
//         // .then(canvas => {
//         //     const dataUrl = canvas.toDataURL("image/png")
//         //     // var blob = that.dataURLtoBlob(dataUrl);
//         //     // console.log('blob', dataUrl);
//         //     that.setState({printBase64: dataUrl})
//         // })
//     }

//     setUploadParam = (up, filename, ret) => {

// 		// console.log('filename:'+filename);
        
//         const uploadKeyJson = this.props.enclosureState.get('uploadKeyJson')
// 		// const key = this.props.uploadKeyJson.get('dir')
// 		// let g_object_name = key
// 		// let suffix = ''
// 		// if (filename != '') {
// 		// 	suffix = this.get_suffix(filename)
// 		// 	g_object_name = this.calculateObjectName(filename, g_object_name)
//         // }
//         const timestamp = new Date().getTime()
//         const g_object_name = `${uploadKeyJson.get('dir')}${timestamp}.png`

// 		let new_multipart_params = {
// 			'key' : g_object_name,
// 			'policy': uploadKeyJson.get('policy'),
// 			'OSSAccessKeyId': uploadKeyJson.get('accessKeyId'),
// 			'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
// 			'callback' : uploadKeyJson.get('callback'),
// 			'signature': uploadKeyJson.get('signature'),
//         }
        
// 		up.setOption({
// 			'url': uploadKeyJson.get('host'),
// 			'multipart_params': new_multipart_params
// 		})
// 		up.start()
// 	}

//     dataURLtoBlob = (dataurl) => {
//         var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
//             bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
//         while(n--){
//             u8arr[n] = bstr.charCodeAt(n);
//         }
//         return new Blob([u8arr], {type:mime});
//     }

//     render() {
//         const { shotClassArr, imgName, shotId, buttonName, fixHeight, enclosureState, setFunction } = this.props

//         return(
//             <div>
//                 <a id="screenshot"></a>
//                 <div
//                     id="onclickdiv"
//                     onClick={(event) =>{}}>
//                 </div>
//             </div>
//         )
//     }
// }
