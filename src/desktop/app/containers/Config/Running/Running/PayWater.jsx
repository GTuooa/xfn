import React from 'react'
import { toJS, fromJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Checkbox, Tooltip } from 'antd'

import * as runningConfActions from 'app/redux/Config/Running/runningConf/runningConf.action'

@immutableRenderDecorator
export default class PayWater extends React.Component {

	static displayName = 'RunningConfigPayWater'

    render(){
        const {
            flags,
            dispatch,
            showModal,
            insertOrModify,
            runningTemp,
            runningCategory,
            categoryTypeObj,
		} = this.props

        const beAccrued = runningTemp.getIn([categoryTypeObj, 'beAccrued'])
        const level = runningTemp.get('level')
        const propertyPay = runningTemp.get('propertyPay')
        const beWelfare = runningTemp.getIn([categoryTypeObj,'beWelfare'])
        const canWelfare = runningTemp.getIn([categoryTypeObj,'canWelfare'])
        const currentWelfare = runningTemp.getIn([categoryTypeObj, 'currentWelfare'])

        const beWithholding = runningTemp.getIn(['acPayment', 'beWithholding'])
        const canWithHoldFund = runningTemp.getIn(['acPayment', 'canWithHoldFund'])
        const canWithHoldSocial = runningTemp.getIn(['acPayment', 'canWithHoldSocial'])
        const beWithholdSocial = runningTemp.getIn(['acPayment', 'beWithholdSocial'])
        const canHoldFund = runningTemp.getIn(['acPayment', 'canHoldFund'])
        const canHoldSocial = runningTemp.getIn(['acPayment', 'canHoldSocial'])
        const canHoldTax = runningTemp.getIn(['acPayment', 'canHoldTax'])
        const currentFund = runningTemp.getIn(['acPayment', 'currentFund'])
        const currentSocial = runningTemp.getIn(['acPayment', 'currentSocial'])
        const currentTax = runningTemp.getIn(['acPayment', 'currentTax'])
        const beWithholdTax = runningTemp.getIn(['acPayment', 'beWithholdTax'])
		const canAccrued = runningTemp.getIn([categoryTypeObj,'canAccrued'])
		const currentAccrued = runningTemp.getIn([categoryTypeObj, 'currentAccrued'])
        const hasChild = runningTemp.get('hasChild')
        const canDelete = runningTemp.get('canDelete')
        let runningName
        switch(propertyPay) {
          case 'SX_GZXJ':
            runningName = '工资薪金'
            break
          case 'SX_SHBX':
            runningName = '社保'
            break
          case 'SX_ZFGJJ':
            runningName = '公积金'
            break
          case 'SX_FLF':
            runningName = '福利费'
            break
          case 'SX_QTXC':
            runningName = '其他薪酬'
            break
          default:
            runningName= ''
        }

        return(
            <div style={{width:'100%'}} className='accountConf-modal-list-blockitem no-margin' style={{display: categoryTypeObj === 'acPayment' ? '' : 'none'}}>
                <div className='accountConf-modal-list-blockitem accountConf-modal-flex' style={{display: categoryTypeObj === 'acPayment' && propertyPay && propertyPay!=='SX_FLF' ? '' : 'none'}}>
                    <div>
                        <span onClick={(e) => {
							if ((insertOrModify == 'insert' && !currentAccrued|| insertOrModify == 'modify' && !canAccrued) && level !== 1 && propertyPay === 'SX_GZXJ')return;
                            dispatch(runningConfActions.changeRunningConfCommonString('running', [categoryTypeObj, 'beAccrued'], !beAccrued))
                        }}>
                            <Checkbox
								checked={beAccrued}
								disabled={(insertOrModify == 'insert' && !currentAccrued|| insertOrModify == 'modify' && !canAccrued) && level !== 1 && propertyPay === 'SX_GZXJ'}
							/>
							<Tooltip placement="topLeft" className='no-padding' title={`${(insertOrModify == 'insert' && !currentAccrued || insertOrModify == 'modify' && !canAccrued) && level !== 1 && propertyPay === 'SX_GZXJ'?'上级未启用':''}`}>{`计提${runningName}`}</Tooltip>
                            <span></span>
                        </span>
                    </div>
                </div>
                <div className='accountConf-modal-list-blockitem accountConf-modal-flex no-margin' style={{display: categoryTypeObj === 'acPayment' && propertyPay ==='SX_FLF'  ? '' : 'none'}}>
                    <div className="accountConf-modal-list-item">
                        <span onClick={() => {
                            dispatch(runningConfActions.changeRunningConfCommonString('running', [categoryTypeObj, 'beWelfare'], !beWelfare))
                        }}>
                            <Checkbox
                                checked={beWelfare}
                                // disabled={(insertOrModify == 'insert' && !currentWelfare|| insertOrModify == 'modify' && !canWelfare) && level !== 1 }
                           />
						   计提福利费
                           {/* <Tooltip placement="topLeft" className='no-padding' title={`${(insertOrModify == 'insert' && !currentWelfare || insertOrModify == 'modify' && !canWelfare) && level !== 1?'上级未启用':''}`}>计提福利费</Tooltip> */}
                        </span>
                    </div>
                </div>
                <div style={{display: (categoryTypeObj === 'acPayment' && propertyPay === 'SX_GZXJ') && beAccrued? '' : 'none'}} className="accountConf-modal-list-blockitem small-margin">
                    <div className='accountConf-modal-block child-chosen'>
                        <span>
                            {
                                propertyPay === 'SX_SHBX' || propertyPay === 'SX_ZFGJJ'? '代缴款项：' : '代扣款项：'
                            }
                        </span>
                        <span
                            style={{display:propertyPay === "SX_GZXJ"?'':'none'}}
                            onClick={() =>
                                canWithHoldFund && dispatch(runningConfActions.changeRunningConfCommonString('running', ['acPayment', 'beWithholding'], !beWithholding))
                            }
                        >
                            <Checkbox checked={beWithholding} disabled={!canWithHoldFund || (insertOrModify == 'insert' && !currentFund || insertOrModify == 'modify' && !canHoldFund) && level !== 1}/>
                            <Tooltip placement="topLeft" className='no-padding' title={`${!canWithHoldFund ?'工资薪金未开启': (insertOrModify == 'insert' && !currentFund || insertOrModify == 'modify' && !canHoldFund) && level !== 1?'上级未启用':''}`}>个人公积金</Tooltip>
                        </span>
                        <span
                            style={{display:propertyPay === "SX_GZXJ"?'':'none'}}
                            onClick={() =>
                                canWithHoldSocial && dispatch(runningConfActions.changeRunningConfCommonString('running', ['acPayment', 'beWithholdSocial'], !beWithholdSocial))
                            }
                        >
                            <Checkbox checked={beWithholdSocial} disabled={!canWithHoldSocial || (insertOrModify == 'insert' && !currentSocial || insertOrModify == 'modify' && !canHoldSocial) && level !== 1}/>
                            <Tooltip placement="topLeft" className='no-padding' title={`${!canWithHoldSocial ?'工资薪金未开启': (insertOrModify == 'insert' && !currentSocial || insertOrModify == 'modify' && !canHoldSocial) && level !== 1?'上级未启用':''}`}>个人社保</Tooltip>
                        </span>
                        <span
                            style={{display:propertyPay === "SX_GZXJ" || propertyPay === "SX_GRSF"?'':'none'}}
                            onClick={() =>
                                dispatch(runningConfActions.changeRunningConfCommonString('running', ['acPayment', 'beWithholdTax'], !beWithholdTax))
                            }
                        >
                            <Checkbox checked={beWithholdTax} disabled={(insertOrModify == 'insert' && !currentTax || insertOrModify == 'modify' && !canHoldTax) || level === 1}/>
                            <Tooltip placement="topLeft" className='no-padding' title={`${(insertOrModify == 'insert' && !currentTax || insertOrModify == 'modify' && !canHoldTax) && level !== 1?'上级未启用':''}`}>个人税费</Tooltip>
                        </span>
                    </div>
                </div>
				<div className='accountConf-modal-list-blockitem accountConf-modal-flex no-margin' style={{display: categoryTypeObj === 'acPayment' && (propertyPay ==='SX_ZFGJJ' || propertyPay ==='SX_SHBX')  ? '' : 'none'}}>
                    <div className="accountConf-modal-list-item">
						<span
							style={{display:propertyPay === "SX_ZFGJJ"?'':'none'}}
							onClick={() =>
								canWithHoldFund && dispatch(runningConfActions.changeRunningConfCommonString('running', ['acPayment', 'beWithholding'], !beWithholding))
							}
						>
							<Checkbox checked={beWithholding} disabled={!canWithHoldFund || (insertOrModify == 'insert' && !currentFund || insertOrModify == 'modify' && !canHoldFund) && level !== 1}/>
							<Tooltip placement="topLeft" className='no-padding' title={`${!canWithHoldFund ?'工资薪金未开启': (insertOrModify == 'insert' && !currentFund || insertOrModify == 'modify' && !canHoldFund) && level !== 1?'上级未启用':''}`}>个人公积金</Tooltip>
						</span>
						<span
							style={{display:propertyPay === "SX_SHBX"?'':'none'}}
							onClick={() =>
								canWithHoldSocial && dispatch(runningConfActions.changeRunningConfCommonString('running', ['acPayment', 'beWithholdSocial'], !beWithholdSocial))
							}
						>
							<Checkbox checked={beWithholdSocial} disabled={!canWithHoldSocial || (insertOrModify == 'insert' && !currentSocial || insertOrModify == 'modify' && !canHoldSocial) && level !== 1}/>
							<Tooltip placement="topLeft" className='no-padding' title={`${!canWithHoldSocial ?'工资薪金未开启': (insertOrModify == 'insert' && !currentSocial || insertOrModify == 'modify' && !canHoldSocial) && level !== 1?'上级未启用':''}`}>个人社保</Tooltip>
						</span>
					</div>
				</div>
            </div>
        )
    }
}
