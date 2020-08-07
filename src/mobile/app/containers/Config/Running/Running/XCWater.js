import React from 'react'
import { fromJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Switch, Form, Icon } from 'app/components'
const { Item } = Form

import * as runningConfActions from 'app/redux/Config/Running/runningConf/runningConf.action'

@immutableRenderDecorator
export default
class XCWater extends React.Component {

    static displayName = 'XCWater'

    render(){
        const {
            dispatch,
			runningTemp,
            categoryTypeObj,
            insertOrModify,
            checkList,
            history,
		} = this.props

        const parentName = runningTemp.get('parentName')
        const categoryType = runningTemp.get('categoryType')

		const beAccrued = runningTemp.getIn([categoryTypeObj, 'beAccrued'])
        const propertyPay = runningTemp.get('propertyPay')
        const beWelfare = runningTemp.getIn([categoryTypeObj,'beWelfare'])

        const beWithholding = runningTemp.getIn(['acPayment', 'beWithholding'])
        const canWithHoldFund = runningTemp.getIn(['acPayment', 'canWithHoldFund'])
        const canWithHoldSocial = runningTemp.getIn(['acPayment', 'canWithHoldSocial'])
        const beWithholdSocial = runningTemp.getIn(['acPayment', 'beWithholdSocial'])
        const beWithholdTax = runningTemp.getIn(['acPayment', 'beWithholdTax'])
        const canHoldFund = runningTemp.getIn(['acPayment', 'canHoldFund'])
        const canHoldSocial = runningTemp.getIn(['acPayment', 'canHoldSocial'])
        const canHoldTax = runningTemp.getIn(['acPayment', 'canHoldTax'])
        const currentFund = runningTemp.getIn(['acPayment', 'currentFund'])
        const currentSocial = runningTemp.getIn(['acPayment', 'currentSocial'])
        const currentTax = runningTemp.getIn(['acPayment', 'currentTax'])
        const currentWelfare = runningTemp.getIn(['acPayment', 'currentWelfare'])
        const canWelfare = runningTemp.getIn(['acPayment', 'canWelfare'])
        const level = runningTemp.get('level')
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
			case 'SX_QTXC':
				runningName = '其他薪酬'
				break
			default: runningName= ''
        }
        
        const checkedObj = {beWithholding:'个人公积金',beWithholdSocial:'个人社保',beWithholdTax:'个人税费'}

        

        return(
            <div className='form-item-wrap' style={{display: categoryTypeObj === 'acPayment' && propertyPay  ? '' : 'none'}}>
                {
                    categoryTypeObj === 'acPayment' && propertyPay ==='SX_FLF'  ?
                        <Item label={'计提福利费：'} className='noTextSwitch m-top'>
                            <Switch
                                checked={beWelfare}
                                onClick={()=> {
                                    dispatch(runningConfActions.changeRunningTemp([categoryTypeObj, 'beWelfare'], !beWelfare))
                                }}
                                disabled={(insertOrModify == 'insert' && !currentWelfare|| insertOrModify == 'modify' && !canWelfare) && level !== 1 }
                                disabledToast={'上级未启用'}
                            />
                        </Item> : null
                }
                <div style={{display: propertyPay !== 'SX_FLF' ? '' : 'none'}}>
                    <Item label={`计提${runningName}：`} className='noTextSwitch m-top'>
                        {propertyPay==='SX_GZXJ' ? 
                            <span className='checkbox-words gray' onClick={() => {history.push('/config/running/gzxj')}}>
								{beAccrued ? '已开启' : '未开启'}
                                <Icon type='arrow-right' className='config-triangle gray'/>
                            </span>
                            : 
                            <Switch
                                checked={beAccrued}
                                onClick={()=> {
                                    dispatch(runningConfActions.changeRunningTemp([categoryTypeObj, 'beAccrued'], !beAccrued))
                                }}
                            />
                        }
                    </Item>

                    {
                        propertyPay === "SX_GZXJ" && beAccrued && checkList.length ?
                        <div className='form-item form-single'>
                            <span className='over-dian gray'>
                                代扣款项：{ checkList.reduce((p, c) => `${p}${p?'、':''}${checkedObj[c]}`, '') }
						    </span>
                            </div> : null
                    }

                    {
                        propertyPay === "SX_SHBX" ?
                        <Item label={'代缴个人社保：'} className='noTextSwitch'>
                            <Switch
                                checked={beWithholdSocial}
                                onClick={()=> {
                                    dispatch(runningConfActions.changeRunningTemp([categoryTypeObj, 'beWithholdSocial'], !beWithholdSocial))
                                }}
                                disabled={!canWithHoldSocial || (insertOrModify == 'insert' && !currentSocial || insertOrModify == 'modify' && !canHoldSocial) || level === 1}
                                disabledToast={`${!canWithHoldSocial?'工资薪金未启用':'上级未启用'}`}
                            />
                        </Item>
                        : null
                    }
                    {
                        propertyPay === "SX_ZFGJJ" ?
                        <Item label={'代缴个人公积金：'} className='noTextSwitch'>
                            <Switch
                                checked={beWithholding}
                                onClick={()=> {
                                    dispatch(runningConfActions.changeRunningTemp([categoryTypeObj, 'beWithholding'], !beWithholding))
                                }}
                                disabled={!canWithHoldFund || (insertOrModify == 'insert' && !currentFund || insertOrModify == 'modify' && !canHoldFund) || level === 1}
                                disabledToast={`${!canWithHoldFund?'工资薪金未启用':'上级未启用'}`}
                            />
                        </Item>
                        : null
                    }
                </div>
            </div>
        )
    }
}
