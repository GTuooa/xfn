import React from 'react'
import { toJS, fromJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import AcBalanceItem from './AcBalanceItem.jsx'

@immutableRenderDecorator
export default
class AcBalanceItemInput extends React.Component {

	constructor() {
		super()
		this.state = {arrowDown: true}
	}

	render() {

		const {
            acitem,
            dispatch,
            acbalist,
            showInput,
			showCountInput,
            showadd,
			asscategorylist,
			asslistSize,
			hasClosed,
			unitDecimalCount
        } = this.props

		const { arrowDown } = this.state

        const acid = acitem.get('acid')
        const acname = acitem.get('acname')
		const acfullname = acitem.get('acfullname')
        const direction = acitem.get('direction')

        // 找到acbalist里所有acid与之相等的acba
        const acbaitem = acbalist.filter(v => v.get('acid') === acid)
		// 是否存在有辅助的科目余额
        const nextItemExist = acbaitem.size ? (acbaitem.getIn([0, 'asslist']) === fromJS([]) ? false : true) : false
        // console.log(nextItemExist)
		const moreass = asslistSize >= acbaitem.size ? true : false

		return (
            <div className="qcye-table-item">
                <AcBalanceItem
                    acid={acid}
					hasClosed={hasClosed}
					arrowDown={arrowDown}
					nextItemExist={nextItemExist}
                    acname={acname}
					acbalist={acbalist}
					acfullname={acfullname}
					dispatch={dispatch}
					direction={direction}
					asscategorylist={asscategorylist}
                    idx={acbaitem ? (nextItemExist ? '' : acbaitem.getIn([0, 'idx'])) : ''}
                    amount={acbaitem ? (nextItemExist ? '' : acbaitem.getIn([0, 'amount'])) : ''}
					count={acbaitem ? (nextItemExist ? '' : acbaitem.getIn([0, 'beginCount'])) : ''}
                    showInput={showInput && !asscategorylist.size}
					showCountInput={showCountInput}
                    showadd={asscategorylist.size === 0 ? false : moreass}
					arrowDown={arrowDown}
					arrowClick={() => this.setState({arrowDown: !arrowDown})}
					unitDecimalCount={unitDecimalCount}
                />
                {
                    nextItemExist ? acbaitem.map((v, i) =>
                        <AcBalanceItem
							key={i}
							hasClosed={hasClosed}
							style={{display: arrowDown ? 'none' : ''}}
							acbalist={fromJS([])}
                            dispatch={dispatch}
							direction={direction}
							acfullname={acfullname}
                            acid={acid}
							showclose={true}
							asslist={v.get('asslist')}
                            acname={acname}
                            idx={v.get('idx')}
                            amount={v.get('amount')}
							count={v.get('beginCount')}
                            showInput={true}
							showCountInput={showCountInput}
							unitDecimalCount={unitDecimalCount}
                        />
                    ) : ''
                }
            </div>
		)
	}
}
