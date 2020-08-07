import React from 'react'
import { toJS, fromJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Form, Radio, Icon, Single } from 'app/components'
import * as thirdParty from 'app/thirdParty'
const { Label, Control, Item } = Form

import * as runningConfActions from 'app/redux/Config/Running/runningConf/runningConf.action'

@immutableRenderDecorator
export default
class SelectRadio extends React.Component {

	static displayName = 'SelectRadio'

    render() {
        const {
            runningTemp,
            dispatch,
            direction,
            categoryTypeObj,
			insertOrModify,
			newJr,
			allStockRange,
			currentStockRange,
			isOpenedInventory,
			history,
        } = this.props

        const categoryType = runningTemp.get('categoryType')
        const propertyCarryover = runningTemp.get('propertyCarryover')
        const canInsertSocial = runningTemp.getIn([categoryTypeObj,'canInsertSocial'])
        const canInsertFixed = runningTemp.getIn([categoryTypeObj,'canInsertFixed'])
        const canInsertUnVisible = runningTemp.getIn([categoryTypeObj,'canInsertUnVisible'])
        const canInsertEstate = runningTemp.getIn([categoryTypeObj,'canInsertEstate'])
		const canInsertAmortization = runningTemp.getIn([categoryTypeObj,'canInsertAmortization'])
        const canInsertFund = runningTemp.getIn([categoryTypeObj,'canInsertFund'])
        const canInsertWelfare = runningTemp.getIn([categoryTypeObj,'canInsertWelfare'])
        const canInsertEnt = runningTemp.getIn([categoryTypeObj,'canInsertEnt'])
        const canInsertPer = runningTemp.getIn([categoryTypeObj,'canInsertPer'])
		const currentPropertyPay = runningTemp.get('currentPropertyPay')
		const currentPropertyTax = runningTemp.get('currentPropertyTax')
		const propertyInvest = runningTemp.get('propertyInvest')
		const propertyTax = runningTemp.get('propertyTax')
		const propertyAssets = runningTemp.get('propertyAssets')
		const propertyPay = runningTemp.get('propertyPay')
		const defaultAc = runningTemp.getIn([categoryTypeObj, 'defaultAc'])
		const parentName = runningTemp.get('parentName')
		const canModifyProperty = runningTemp.getIn([categoryTypeObj,'canModifyProperty'])
		const currentPropertyAssets = runningTemp.get('currentPropertyAssets')
		const salaryList = [{key: '其他薪酬', value: 'SX_QTXC'}]
		const taxList = [{key: '其他税费', value: 'SX_QTSF'}]
		const assetList = []
		const level = runningTemp.get('level')

		if (categoryType === 'LB_XCZC') {
			if (canInsertFund || currentPropertyPay === 'SX_ZFGJJ') {
				salaryList.unshift({key: '住房公积金', value: 'SX_ZFGJJ'})
			}
			if (canInsertWelfare || currentPropertyPay === 'SX_FLF') {
				salaryList.unshift({key: '福利费', value: 'SX_FLF'})
			}
			if (canInsertSocial || currentPropertyPay === 'SX_SHBX') {
				salaryList.unshift({key: '社会保险', value: 'SX_SHBX'})
			}
		} else if (categoryType === 'LB_SFZC') {
			if (canInsertPer || currentPropertyTax === 'SX_GRSF') {
				taxList.unshift({key: '个人税费', value: 'SX_GRSF'})
			}
			if (canInsertEnt || currentPropertyTax === 'SX_QYSDS') {
				taxList.unshift({key: '企业所得税', value: 'SX_QYSDS'})
			}
		}
		if (categoryType === 'LB_CQZC') {
			if (canInsertFixed || currentPropertyAssets === 'SX_GDZC') {
				assetList.unshift({key: '固定资产', value: 'SX_GDZC'})
			}
			if (canInsertUnVisible || currentPropertyAssets === 'SX_WXZC') {
				assetList.unshift({key: '无形资产', value: 'SX_WXZC'})
			}
			if (canInsertEstate || currentPropertyAssets === 'SX_TZXFDC') {
				assetList.unshift({key: '投资性房地产', value: 'SX_TZXFDC'})
			}
			if (canInsertAmortization || currentPropertyAssets === 'SX_CQFYTX') {
				assetList.unshift({key: '长期待摊费用', value: 'SX_CQFYTX'})
			}
		}

		let propertyCarryoverList = [{key: '货物', value: 'SX_HW'},{key: '服务', value: 'SX_FW'}]
		if (newJr) {
			propertyCarryoverList = [{key: '服务', value: 'SX_FW'}]
			if (isOpenedInventory) {
				propertyCarryoverList.push({key: '货物', value: 'SX_HW'})
				if (categoryType === 'LB_YYSR') {
					propertyCarryoverList.push({key: '货物 + 服务', value: 'SX_HW_FW'})
				}
			}
		}

		const stockRange = runningTemp.getIn([categoryTypeObj,'stockRange'])
		const stockNameList = stockRange ? stockRange.map(v => allStockRange.find(w => w.get('uuid') === v).get('name')) : []

        return(
            <div className='form-item-wrap'>
				{
					categoryType === 'LB_CQZC'?
						<div className='form-item form-single'>
							<span>资产属性：</span>
							<Single
								title='资产属性'
								district={assetList}
								value={propertyAssets}
								onOk={(value) => {
									switch (value.label) {
										case '固定资产':
											dispatch(runningConfActions.emptyAccountCheck([{tab:'running',place:[categoryTypeObj, 'beWithholding'],value:false},{tab:'running',place:[categoryTypeObj, 'beAccrued'],value:false},{tab:'running',place:[categoryTypeObj, 'beWelfare'],value:false}]))
											dispatch(runningConfActions.changeRunningTemp('propertyAssets' ,'SX_GDZC'))
											dispatch(runningConfActions.changeRunningTemp('name' ,'固定资产'))
												break
										case '无形资产':
											dispatch(runningConfActions.emptyAccountCheck([{tab:'running',place:[categoryTypeObj, 'beWithholding'],value:false},{tab:'running',place:[categoryTypeObj, 'beAccrued'],value:false},{tab:'running',place:[categoryTypeObj, 'beWelfare'],value:false}]))
											dispatch(runningConfActions.changeRunningTemp('propertyAssets' ,'SX_WXZC'))
											dispatch(runningConfActions.changeRunningTemp('name' ,'无形资产'))
												break
										case '投资性房地产':
											dispatch(runningConfActions.emptyAccountCheck([{tab:'running',place:[categoryTypeObj, 'beWithholding'],value:false},{tab:'running',place:[categoryTypeObj, 'beAccrued'],value:false},{tab:'running',place:[categoryTypeObj, 'beWelfare'],value:false}]))
											dispatch(runningConfActions.changeRunningTemp('propertyAssets' ,'SX_TZXFDC'))
											dispatch(runningConfActions.changeRunningTemp('name' ,'投资性房地产'))
												break
										case '长期待摊费用':
											dispatch(runningConfActions.emptyAccountCheck([{tab:'running',place:[categoryTypeObj, 'beWithholding'],value:false},{tab:'running',place:[categoryTypeObj, 'beAccrued'],value:false},{tab:'running',place:[categoryTypeObj, 'beWelfare'],value:false}]))
											dispatch(runningConfActions.changeRunningTemp('propertyAssets' ,'SX_CQFYTX'))
											dispatch(runningConfActions.changeRunningTemp('name' ,'长期待摊费用'))
												break
										default:

									}
								}}
							>
								<span>
									{{'SX_GDZC':'固定资产',
									'SX_WXZC':'无形资产',
									'SX_TZXFDC':'投资性房地产',
									'SX_CQFYTX':'长期待摊费用'}[propertyAssets]}
									<Icon type='triangle' className='config-triangle'/>
								</span>
							</Single>
						</div>
						:null
				}
				{
					categoryType === 'LB_YYSR' || categoryType === 'LB_YYZC'?
						<div className='form-item form-single'>
							<span>{`${direction === 'debit'?'收入':'成本'}属性：`}</span>
							<span className='checkbox-words gray' 
							    onClick={() => {
									if (insertOrModify === 'insert' && level !== 1 || insertOrModify === 'modify' && !canModifyProperty) {
										return
									}
									history.push('/config/running/stock')
								}}>
								{{'SX_HW':'货物', 'SX_FW':'服务', 'SX_HW_FW': '货物 + 服务'}[propertyCarryover]}
								<Icon type='arrow-right' className='config-triangle'/>
							</span>
						</div>
						:null
				}
				{
					['SX_HW', 'SX_HW_FW'].includes(propertyCarryover) && stockRange.size ? 
					<div className='form-item form-single'>
						<span className='over-dian gray'>
							存货范围：
							{
								stockNameList.map((v,i)=> <span key={i}>{`${v}${i<stockNameList.size-1?'、':''}`}</span>)
							}
						</span>
					</div> : null
				}
				{
					categoryType === 'LB_XCZC'?
						<div className='form-item form-single'>
							<span>薪酬属性：</span>
							<Single
								title='薪酬属性'
								district={salaryList}
								value={propertyPay}
								disabled={insertOrModify === 'insert' && parentName !=='薪酬支出' || insertOrModify === 'modify' && !canModifyProperty || currentPropertyPay === 'SX_GZXJ'}
								onOk={(value) => {
									switch (value.label) {
										case '社会保险':
											dispatch(runningConfActions.emptyAccountCheck([{tab:'running',place:[categoryTypeObj, 'beWithholding'],value:false},{tab:'running',place:[categoryTypeObj, 'beAccrued'],value:false},{tab:'running',place:[categoryTypeObj, 'beWelfare'],value:false}]))
											dispatch(runningConfActions.changeRunningTemp('propertyPay' ,'SX_SHBX'))
											break
										case '住房公积金':
											dispatch(runningConfActions.emptyAccountCheck([{tab:'running',place:[categoryTypeObj, 'beWithholding'],value:false},{tab:'running',place:[categoryTypeObj, 'beAccrued'],value:false},{tab:'running',place:[categoryTypeObj, 'beWelfare'],value:false}]))
											dispatch(runningConfActions.changeRunningTemp('propertyPay' ,'SX_ZFGJJ'))
											break
										case '福利费':
											dispatch(runningConfActions.emptyAccountCheck([{tab:'running',place:[categoryTypeObj, 'beWithholding'],value:false},{tab:'running',place:[categoryTypeObj, 'beAccrued'],value:false},{tab:'running',place:[categoryTypeObj, 'beWelfare'],value:false}]))
											dispatch(runningConfActions.changeRunningTemp('propertyPay' ,'SX_FLF'))
											break
										case '其他薪酬':
											dispatch(runningConfActions.emptyAccountCheck([{tab:'running',place:[categoryTypeObj, 'beWithholding'],value:false},{tab:'running',place:[categoryTypeObj, 'beAccrued'],value:false},{tab:'running',place:[categoryTypeObj, 'beWelfare'],value:false}]))
											dispatch(runningConfActions.changeRunningTemp('propertyPay' ,'SX_QTXC'))
											break
										default:
									}
								}}
							>
								<span
									style={{
										color:insertOrModify === 'insert' && parentName !=='薪酬支出' || insertOrModify === 'modify' && !canModifyProperty || currentPropertyPay === 'SX_GZXJ'?'#ccc':'#333'
									}}
									>
									{{'SX_GZXJ':'工资薪金',
									'SX_SHBX':'社会保险',
									'SX_ZFGJJ':'住房公积金',
									'SX_FLF':'福利费',
									'SX_QTXC':'其他薪酬'}[propertyPay]}
									<Icon type='triangle' className='config-triangle'/>
								</span>
							</Single>
						</div>
						:null
				}

				{
					categoryType === 'LB_SFZC'?
						<div className='form-item form-single'>
							<span>税费属性：</span>
							<Single
								title='税费属性'
								district={taxList}
								value={propertyTax}
								disabled={insertOrModify === 'insert' && parentName !=='税费支出' || insertOrModify === 'modify' && !canModifyProperty}
								onOk={(value) => {
									switch (value.label) {
										case '个人税费':
											dispatch(runningConfActions.emptyAccountCheck([{tab:'running',place:[categoryTypeObj, 'beInAdvance'],value:false},{tab:'running',place:[categoryTypeObj, 'beTurnOut'],value:false},{tab:'running',place:[categoryTypeObj, 'beAccrued'],value:false}]))
											dispatch(runningConfActions.changeRunningTemp('propertyTax' ,'SX_GRSF'))
												break
										case '企业所得税':
											dispatch(runningConfActions.emptyAccountCheck([{tab:'running',place:[categoryTypeObj, 'beInAdvance'],value:false},{tab:'running',place:[categoryTypeObj, 'beTurnOut'],value:false},{tab:'running',place:[categoryTypeObj, 'beAccrued'],value:false}]))
											dispatch(runningConfActions.changeRunningTemp('propertyTax' ,'SX_QYSDS'))
											break
										case '其他税费':
											dispatch(runningConfActions.emptyAccountCheck([{tab:'running',place:[categoryTypeObj, 'beInAdvance'],value:false},{tab:'running',place:[categoryTypeObj, 'beTurnOut'],value:false},{tab:'running',place:[categoryTypeObj, 'beAccrued'],value:false}]))
											dispatch(runningConfActions.changeRunningTemp('propertyTax' ,'SX_QTSF'))
											break
										default:

									}
								}}
							>
								<span
									style={{
										color:insertOrModify === 'insert' && parentName !=='税费支出' || insertOrModify === 'modify' && !canModifyProperty?'#ccc':'#333'
									}}
									>
									{{'SX_ZZS':'增值税',
									'SX_GRSF':'个人税费',
									'SX_QYSDS':'企业所得税',
									'SX_QTSF':'其他税费'}[propertyTax]}
									<Icon type='triangle' className='config-triangle'/>
								</span>
							</Single>
						</div>
						:null
				}
				{
					categoryType === 'LB_TZ'?
						<div className='form-item form-single'>
							<span>投资属性：</span>
							<Single
								title='投资属性'
								district={[{key: '股权', value: 'SX_GQ'}, {key: '债权', value: 'SX_ZQ'}]}
								value={propertyInvest}
								onOk={(value) => {
									dispatch(runningConfActions.changeRunningTemp('propertyInvest', value.value))
								}}
							>
								<span>
									{{'SX_GQ':'股权', 'SX_ZQ':'债权'}[propertyInvest]}
									<Icon type='triangle' className='config-triangle'/>
								</span>
							</Single>
						</div>
						:null
				}

            </div>
        )
    }
}
