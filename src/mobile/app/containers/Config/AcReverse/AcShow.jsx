import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { formatMoney } from 'app/utils'

@immutableRenderDecorator
export default
class AcShow extends React.Component {

	render() {
		const {
			categoryList,
			openingbalance,
			acunitOpen,
			cardNum,
			acCount,
			hasChildren
		} = this.props



		return (

            <dl className="greycontainer" style={{marginTop:'.1rem'}}>
                <dt className="greycontainer-title">该科目已使用的内容：</dt>
				{
					categoryList.size > 0 ?
					<dd className="greycontainer-item">辅助核算：{categoryList.reduce((v ,pre) => v + '、' + pre)}</dd> : ''
				}
				{
					openingbalance > 0 ?
					<dd className="greycontainer-item">期初值：{formatMoney(openingbalance, 2, '')}</dd> :
					''
				}
				{
					cardNum > 0 ?
					<dd className="greycontainer-item">关联资产卡片：有</dd> :
					''
				}
				{
					hasChildren === '1' ?
					<dd className="greycontainer-item">下级科目：有</dd> :
					''
				}
				{
					acCount > 0 ?
					<dd className="greycontainer-item">有相关的凭证</dd> :
					''
				}

            </dl>
		)
	}
}
