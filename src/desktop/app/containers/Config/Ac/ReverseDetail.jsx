import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as configActions from 'app/redux/Config/Ac/acConfig.action.js'

import { Modal } from 'antd'
import { formatMoney } from 'app/utils'

@immutableRenderDecorator
export default
class ReverseDetail extends React.Component {
	render() {

        const {
			type,
			dispatch,
			idNewAcReverseId,
			reverseconfirmModalshow,
			revenseAcid,
			NewAcReverseId,
			NewAcReverseName,
			revenseAcname,
			categoryList,
			acCount,
			category,
			upAcName,
			direction,
			upperId,
			acunitOpen,
			cardNum,
			openingbalance,
			successCallback,
			hasChildren
		} = this.props

        return (
            <Modal
                title="信息确认"
                visible={reverseconfirmModalshow}
                onOk={() => {
					if (type === 'class') {
						dispatch(configActions.getReportAcRegretUse(revenseAcid, revenseAcid+''+NewAcReverseId, NewAcReverseName, successCallback))
					} else if (type === 'id') {
						dispatch(configActions.getReportAcRegretIdUse(revenseAcid, upperId+''+idNewAcReverseId, successCallback))
					}

                }}
                onCancel={() => {
					dispatch(configActions.switchReverseConfirmModalShow())
				}}
                >
                <dl className="greycontainer">
                    <dt className="greycontainer-title">修改后科目修改为：</dt>
                        <dd className="greycontainer-item">科目：{type === 'class' ? revenseAcid+''+NewAcReverseId+'_'+NewAcReverseName : upperId+''+idNewAcReverseId+'_'+revenseAcname}</dd>
                        <dd className="greycontainer-item">上级科目：{type === 'class' ? revenseAcid+'_'+revenseAcname : (upAcName ? upperId+'_'+upAcName : '无')}</dd>
                        <dd className="greycontainer-item">科目类别：{category}</dd>
						<dd className="greycontainer-item">期初值：{formatMoney(openingbalance, 2, '')}</dd>

                        <dd className="greycontainer-item">余额方向：{direction == 'credit' ? '贷' : '借'}</dd>
                        <dd className="greycontainer-item">数量核算：{acunitOpen == '0' ? '无' : '有'}</dd>
						<dd className="greycontainer-item">下级科目：{hasChildren === '1' ? '有' : '无'}</dd>
                        <dd className="greycontainer-item">辅助核算：{categoryList.size ? categoryList.reduce((v ,pre) => v + '、' + pre) : '无'}</dd>
						<dd className="greycontainer-item">关联资产卡片：{cardNum == 0 ? '无' : '有'}</dd>
                    {
                        acCount > 0 ?
                        <dd className="greycontainer-item">有相关的凭证</dd> :
                        <dd className="greycontainer-item">没有相关的凭证</dd>
                    }
                </dl>
            </Modal>
        )
    }
}
