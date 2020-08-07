import React, { PropTypes } from 'react'
import { Map, List, toJS, fromJS } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

// import thirdParty from 'app/thirdParty'
// import { getFileNameNoExt } from 'app/utils'
import { message, Icon, Modal, Checkbox } from 'antd'
import { XfInput } from 'app/components'
// import { ROOTPKT, ROOT } from 'app/constants/fetch.constant.js'
// import plupload from 'plupload'
// //import PDF from 'react-pdf-js';

// import { switchLoadingMask } from 'app/redux/Home/All/all.action.js'
// import { xfnFetchErrorToDeveloper } from 'app/constants/fetchFunc.jsx'
// import loader from 'sass-loader'

@immutableRenderDecorator
export default
class ClipBoardModal extends React.Component {

	// constructor() {
	// 	super()
	// 	this.state = {
	// 	}
    // }

    // componentDidMount() {

    //     const element = document.getElementById('clipBoardImg')

    //     console.log('element', element);

    // }

	render() {

		const {
            clipBoardModalShow,
            clipBoardFile,
            clipBoardBlob,
            onOK,
            onCancel,
            isCustomName,
            customName,
            changeIsCustomName,
            changeCustomName,
            widthHeigthRate
        } = this.props
        
		return (
            <Modal
                title="上传附件"
                maskClosable={false}
                visible={clipBoardModalShow}
                onOk={onOK}
                onCancel={onCancel}
            >
                <div className="clip-board-preview-img" style={widthHeigthRate >= 1 ? { maxHeight: '500px' } : { height: '500px' }}>
                    <img id={'clipBoardImg'} src={clipBoardBlob} style={widthHeigthRate >= 1 ? { width: '100%' } : { height: '100%' }} />
                </div>
                <div className="clip-board-preview-name">
                    <Checkbox checked={isCustomName} onChange={changeIsCustomName} /> <span>自定义名称</span>
                    <XfInput className="clip-board-preview-name-input" style={{'display': isCustomName ? '' : 'none'}} value={customName} onChange={changeCustomName} />
                </div>
            </Modal>
		)
	}
}
