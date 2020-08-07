import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Modal } from 'antd'
import Searchclosure from 'app/containers/components/Searchclosure'
import { allDownloadEnclosure } from 'app/redux/Home/All/all.action'
import { searchRunningAllActions } from 'app/redux/Search/SearchRunning/searchRunningAll.js'
import './style.less'

@immutableRenderDecorator
export default
class SearchModal extends React.Component {

    render() {
        const {
			lrPermissionInfo,
			enclosureList,
            label,
			closedBy,
            reviewedBy,
			enCanUse,
			checkMoreFj,
            uploadKeyJson,
			dispatch,
			visible,
			onCancel,
			className,
			title,
			okText,
			onOk,
			id
		} = this.props
        return(
            <Modal
				visible={visible}
				onCancel={onCancel}
				className={className}
				title={title}
				okText={okText}
				onOk={onOk}
			>
                <div>
                    {this.props.children}
                    <Searchclosure
						id={id}
						type="ls"
						className="cxls-enclosure-wrap"
						dispatch={dispatch}
						permission={lrPermissionInfo.getIn(['edit', 'permission'])}
						enclosureList={enclosureList}
						label={label}
						closed={closedBy}
						reviewed={reviewedBy}
						enCanUse={enCanUse}
						checkMoreFj={checkMoreFj}
						getUploadTokenFetch={() => dispatch(searchRunningAllActions.getUploadTokenFetch())}
						getLabelFetch={() => dispatch(searchRunningAllActions.getRunningLabelFetch())}
						deleteUploadImgUrl={(index) => dispatch(searchRunningAllActions.deleteRunningEnclosureUrl(index))}
						changeTagName={(index, tagName) => dispatch(searchRunningAllActions.changeRunningTagName(index, tagName))}
						downloadEnclosure={(enclosureUrl, fileName) => dispatch(allDownloadEnclosure(enclosureUrl, fileName))}
						uploadEnclosureList={(value) => {
							dispatch(searchRunningAllActions.uploadFiles(...value))
						}}
						uploadKeyJson={uploadKeyJson}
					/>
                </div>
            </Modal>
        )
    }
}
