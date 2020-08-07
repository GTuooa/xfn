import { fromJS } from 'immutable'
import React from 'react'
import { connect }	from 'react-redux'
import { Row, Icon, ChosenPicker, Button } from 'app/components'
import thirdParty from 'app/thirdParty'
import { showImg } from 'app/utils'
import UploadEnclosure from 'app/containers/components/Enclosure/UploadEnclosure'
import plupload from 'plupload'
import * as editApprovalActions from 'app/redux/Edit/EditApproval/editApproval.action.js'
import { previewEnclosureActions } from 'app/redux/Edit/PreviewEnclosure/index.js'

export default
class Fjcomp extends React.Component {
    state = {
        visible: false,
    }
    isImage = (name) => {
        const nameList = name.split('.')
        let extension = nameList[nameList.length-1]
        if (['jpeg','jpg','png','bmp','gif','svg','webp'].includes(extension)) {
            return true
        }
        return false

    }
    componentDidMount() {
        // let codeList = []
    	// const promise1 = new Promise(resolve => {
    	// 	thirdParty.requestAuthCode({
    	// 		corpId:sessionStorage.getItem('corpId'),
    	// 		onSuccess:(info) => {
    	// 			codeList.push(info.code)
    	// 			console
    	// 			resolve()
    	// 		}
    	// 		})
    	// })
    	// const promise2 = new Promise(resolve => {
    	// 	thirdParty.requestAuthCode({
    	// 		corpId:sessionStorage.getItem('corpId'),
    	// 		onSuccess:(info) => {
    	// 			codeList.push(info.code)
    	// 			resolve()
    	// 		}
    	// 		})
    	// })
        // Promise.all([promise1, promise2])
        // .then(() => {
        //     console.log(codeList)
        // })
    }
    render() {
        const {
            disabled,
            lastCategory,
            categoryType,
            isOpenedWarehouse,
            placeArr,
            item,
            dispatch,
            spaceId,
            index
        } = this.props
        const { visible } = this.state
        const enclosureList = item.get('value') || fromJS([])
        const YlenclosureList = item.get('valueYl') || fromJS([])
        return (
            <Row className='approval-fj'>
                <div>附件</div>
                <div className='fj-container'>
                    {
                        enclosureList.map((v,index) =>
                            <div
                                className='mx-fj'
                                >
                                <div className='fj-img'>
                                    <img

                                        src={showImg(v.get('type') === 'image'|| this.isImage(v.get('fileName'))?'TRUE':'',v.get('fileName'))}
                                    />
                                </div>
                                <div className='fj-name'>
                                    <span>{v.get('fileName')}</span>
                                    <span>{(v.get('fileSize')/1024).toFixed(2)+'KB'}</span>
                                </div>
                                <span
                                    onClick={() => {
                                        if (v.get('type') === 'image' || this.isImage(v.get('fileName'))) {
                                            thirdParty.toast.info('附件图片不支持预览')
                                            return
                                        }
                                        dispatch(editApprovalActions.getCustomSpaceAndPreview(v,spaceId))
                                        // if (v.get('type') === 'image') {
                                        // const previewImageList = enclosureList.toJS().filter(v => v.type === 'image').map(v => v.signedUrl)
                                        // } else if (v.get('mimeType') === 'application/pdf') {
                                        //     if (v.get('size') > 8*1024) {
                                        //         return thirdParty.toast.info('文件过大，暂不支持预览。')
                                        //     }
                                        //     let previewUrl = v.get('signedUrl')
                                        //     dispatch(previewEnclosureActions.getCxpzUploadEnclosure(previewUrl, () => {
                                        //         history.push('/previewpdf')
                                        //     }))
                                        // }
                                        // thirdParty.toast.info('暂不支持预览。')
                                    }}
                                    >预览</span>
                                <Icon
                                    className='fj-close'
                                    type='preview'
                                    onClick={() => {
                                        dispatch(editApprovalActions.changeModelString([...placeArr,'value'],enclosureList.splice(index,1)))
                                    }}
                                />
                            </div>

                        )
                    }
                    <div className='add-icon' onClick={() => {
                        dispatch(editApprovalActions.getSpaceInfo((resultList) => {
                            dispatch(editApprovalActions.changeModelString([...placeArr,'value'],enclosureList.concat(fromJS(resultList))))
                        }))
                    }}>
                        {/* <input type="file" className='file-input' onChange={e => {
                            const input = e.target
                            const files = e.target.files
                            if(files && files[0]) {
                                Object.keys(files).forEach(i => {
                                    if (files[i].size > 10 * 1024 * 1024) {
                                        return
                                    } else {
                                        let formData = new FormData()
                                        formData.append('file', files[i])
                                        dispatch(editApprovalActions.getSpaceInfo(placeArr,enclosureList))
                                    }
                                })
                            }
                        }}/> */}
                        <Icon
                            type='add'
                        />
                    </div>
                </div>

            </Row>
        )
    }
}
