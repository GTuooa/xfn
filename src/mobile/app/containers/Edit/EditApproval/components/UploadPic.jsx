import { fromJS } from 'immutable'
import React from 'react'
import { connect }	from 'react-redux'
import { Row, Icon, ChosenPicker } from 'app/components'
import UploadEnclosure from 'app/containers/components/Enclosure/UploadEnclosure'
import * as editApprovalActions from 'app/redux/Edit/EditApproval/editApproval.action.js'
import thirdParty from 'app/thirdParty'

export default
class CategoryComp extends React.Component {
    state = {
        visible: false,
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
            uploadKeyJson
        } = this.props
        const { visible } = this.state
        const enclosureList = item.get('value') || fromJS([])
        return (
            <Row className='approval-pic'>
                <div>图片</div>
                <div className='pic-container'>
                    {
                        enclosureList.map((v,index) =>
                            <div
                                className='mx-img'
                                >
                                <img
                                    onClick={() => {
                                        if (v.get('size') > 8*1024) {
                                            return thirdParty.toast.info('文件过大，暂不支持预览。')
                                        }
                                        const previewImageList = enclosureList.toJS().map(v => v.signedUrl)
                                        thirdParty.previewImage({
                                            urls: previewImageList, //图片地址列表
                                            current: v.get('signedUrl'), //当前显示的图片链接
                                            onSuccess : function(result) {},
                                            onFail : function() {}
                                        })
                                    }}
                                    src={v.get('signedUrl')}
                                />
                                <Icon
                                    className='pic-close'
                                    type='preview'
                                    onClick={() => {
                                        dispatch(editApprovalActions.changeModelString([...placeArr,'value'],enclosureList.splice(index,1)))
                                    }}
                                />
                            </div>

                        )
                    }
                    <div className='add-icon'>
                        <UploadEnclosure
                            type='Image'
                            enclosureList={enclosureList}
                            uploadKeyJson={uploadKeyJson}
                            isCompression={false}
                            uploadFiles={(value) => {
                                dispatch(editApprovalActions.uploadFiles(enclosureList,[...placeArr,'value'],...value))
                            }}
                            getUploadGetTokenFetch={() => {
                                dispatch(editApprovalActions.getUploadGetTokenFetch())
                            }}
                        />
                    </div>
                </div>

            </Row>
        )
    }
}
