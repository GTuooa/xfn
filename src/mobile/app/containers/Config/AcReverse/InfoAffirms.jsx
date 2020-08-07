import React, { PropTypes }	from 'react'
import { Map, toJS } from 'immutable'
import { connect }	from 'react-redux'
import * as acconfigActions from 'app/redux/Config/Ac/acconfig.action'
import './ac-reverse.less'
import { Button, ButtonGroup, Icon, Container, Row, Form, Amount, ScrollView, PopUp } from 'app/components'
import { formatMoney } from 'app/utils'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

@immutableRenderDecorator
export default
class InfoAffirms extends React.Component {


	render() {
		const {
			allState,
			acconfigState,
			dispatch,
            showInfoAffirmStatus,
			history
		} = this.props

        const type = acconfigState.get('type')
        const NewAcReverseId = acconfigState.get('NewAcReverseId')
		const NewAcReverseName = acconfigState.get('NewAcReverseName')
		const idNewAcReverseId = acconfigState.get('idNewAcReverseId')
		const reverseAc = acconfigState.get('reverseAc')
        const revenseAcid = reverseAc.get('acid')
        const revenseAcname = reverseAc.get('acname')
        const category = reverseAc.get('category')
		const upAcName = reverseAc.get('upAcName')
		const direction = reverseAc.get('direction')
		const upperId = reverseAc.get('upperId')
		const acunitOpen = reverseAc.get('acunitOpen')
		const cardNum = reverseAc.get('cardNum')
		const hasChildren = reverseAc.get('hasChildren')
        const acCount = reverseAc.get('acCount')
        const openingbalance = reverseAc.get('openingbalance')
        const categoryList = reverseAc.get('categoryList')

        // console.log('showInfoAffirmStatus ' + showInfoAffirmStatus)

		return (
            <PopUp
                title={'信息确认'}
                onCancel={() => dispatch(acconfigActions.showInfoAffirm(false))}
                visible={showInfoAffirmStatus}
                footerVisible={false}
                footer={[
                    <span onClick={() => dispatch(acconfigActions.showInfoAffirm(false))}>取消</span>,
                    <span
                        onClick={() => {
                        if (type === 'class') {
                            dispatch(acconfigActions.getReportAcRegretUse(revenseAcid, revenseAcid+''+NewAcReverseId, NewAcReverseName, history))
                        } else if (type === 'id') {
                            dispatch(acconfigActions.getReportAcRegretIdUse(revenseAcid, upperId+''+idNewAcReverseId, history))
                        }
                    }}>
                        确定
                    </span>
                ]}
                >
                <dl className="greycontainer">
                    <dt className="greycontainer-title">修改后科目修改为：</dt>
                    <dd className="greycontainer-item">科目：{type === 'class' ? revenseAcid+''+NewAcReverseId+'_'+NewAcReverseName : upperId+''+idNewAcReverseId+'_'+revenseAcname}</dd>
                    <dd className="greycontainer-item">上级科目：{type === 'class' ? revenseAcid+'_'+revenseAcname : (upAcName ? upperId+'_'+upAcName : '无')}</dd>
                    <dd className="greycontainer-item">科目类型：{category}</dd>
                    <dd className="greycontainer-item">期初值：{formatMoney(openingbalance, 2, '')}</dd>
                    <dd className="greycontainer-item">余额方向：{direction == 'credit' ? '贷' : '借'}</dd>
                    <dd className="greycontainer-item">数量核算：{acunitOpen == '0' ? '无' : '有'}</dd>
                    <dd className="greycontainer-item">下级科目：{hasChildren === '1' ? '有' : '无'}</dd>
                    <dd className="greycontainer-item">辅助核算：{categoryList.size ? categoryList.reduce((v ,pre) => v + '、' + pre) : '无'}</dd>
                    <dd className="greycontainer-item">关联资产卡片：{cardNum == 0 ? '无' : '有'}</dd>
                    <dd className="greycontainer-item">{acCount > 0 ? '有相关的凭证' : '没有相关的凭证'}</dd>
                </dl>
            </PopUp>
		)
	}
}
