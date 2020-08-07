import React from 'react'
import { toJS, fromJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as Limit from 'app/constants/Limit.js'
import { RunUpperSelect } from 'app/components'
import { Input, Select, Checkbox, Button, Modal, message,Radio, Tooltip } from 'antd'
const Option = Select.Option
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group

import PayWater from './PayWater'
import BusinessWater from './BusinessWater'
import Management from './Management'
import beforeSaveCheck from './check'

import * as runningConfActions from 'app/redux/Config/Running/runningConf/runningConf.action'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'
import * as accountConfActions from 'app/redux/Config/Account/account.action'

@immutableRenderDecorator
export default class ModifyModal extends React.Component {

	static displayName = 'RunningConfigModifyModal'

	componentWillReceiveProps(nextprops) {
		const showModal = nextprops.showModal
		if (showModal) {
			const content = document.getElementsByClassName('running-content')[0]
			if (content) {
				const input = content.getElementsByClassName('ant-select-search__field')
				for (let i = 0;i < input.length;i++) {
					input[i].onfocus = input[i].select
				}
			}
		}
	}

	render() {

		const {
			flags,
            dispatch,
            showModal,
            insertOrModify,
			runningTemp,
			taxRateTemp,
			runningCategory,
			editPermission,
			newJr,
			enableProject,
			enableInventory
		} = this.props

		const categoryType = runningTemp.get('categoryType')
		let showManagemented, propertyShow, categoryTypeObj
		let direction = 'debit'
		let isShowAbout = false
		let showSf = true
		;({
			'LB_YYSR': () => {
				showManagemented = true
				propertyShow = '营业收入'
				categoryTypeObj = 'acBusinessIncome'
			},
			'LB_YYZC': () => {
				showManagemented = true
				propertyShow = '营业支出'
				categoryTypeObj = 'acBusinessExpense'
				direction = 'credit'
			},
			'LB_YYWSR': () => {
				showManagemented = true
				propertyShow = '营业外收入'
				categoryTypeObj = 'acBusinessOutIncome'
				isShowAbout = true
			},
			'LB_YYWZC': () => {
				showManagemented = true
				propertyShow = '营业外支出'
				categoryTypeObj = 'acBusinessOutExpense'
				direction = 'credit'
				isShowAbout = true

			},
			'LB_JK': () => {
				showManagemented = true
				showSf = false
				propertyShow = '借款'
				categoryTypeObj = 'acLoan'
			},
			'LB_TZ': () => {
				showManagemented = true
				showSf = false
				propertyShow = '投资'
				categoryTypeObj = 'acInvest'
			},
			'LB_ZB': () => {
				showManagemented = true
				propertyShow = '资本'
				showSf = false
				categoryTypeObj = 'acCapital'
			},
			'LB_CQZC': () => {
				showManagemented = true
				propertyShow = '长期资产'
				categoryTypeObj = 'acAssets'
			},
			'LB_FYZC': () => {
				showManagemented = true
				propertyShow = '费用支出'
				categoryTypeObj = 'acCost'
			},
			'LB_ZSKX': () => {
				showManagemented = true
				propertyShow = '暂收款项'
				categoryTypeObj = 'acTemporaryReceipt'
				showSf = false
				isShowAbout = true
			},
			'LB_ZFKX': () => {
				showManagemented = true
				propertyShow = '暂付款项'
				categoryTypeObj = 'acTemporaryPay'
				showSf = false
				direction = 'credit'
			},
			'LB_XCZC': () => {
				showManagemented = false
				propertyShow = '薪酬支出'
				categoryTypeObj = 'acPayment'
			},
			'LB_SFZC': () => {
				showManagemented = false
				propertyShow = '税费支出'
				categoryTypeObj = 'acTax'
			}
		}[categoryType] || (() => ''))()
		const property = runningTemp.get('property')
		const parentName = runningTemp.get('parentName')
		const name = runningTemp.get('name')

		const beCarryover = runningTemp.getIn([categoryTypeObj,'beCarryover'])
		const beDeposited = runningTemp.getIn([categoryTypeObj, 'beDeposited'])
		const propertyList = runningTemp.getIn([categoryTypeObj, 'propertyList'])?runningTemp.getIn([categoryTypeObj, 'propertyList']):fromJS([])
		const beSpecial = runningTemp.get('beSpecial')
		const canDelete = runningTemp.get('canDelete')
		const level = runningTemp.get('level')
		const propertyCostList = runningTemp.get('propertyCostList')? runningTemp.get('propertyCostList') : fromJS([])
		const propertyPay = runningTemp.get('propertyPay')
		const propertyCarryover = runningTemp.get('propertyCarryover')
		const propertyTax = runningTemp.get('propertyTax')
		const beAccrued = runningTemp.getIn([categoryTypeObj, 'beAccrued'])
		const beReduce = runningTemp.getIn([categoryTypeObj, 'beReduce'])
		const currentReduce = runningTemp.getIn([categoryTypeObj, 'currentReduce'])
		const canReduce = runningTemp.getIn([categoryTypeObj, 'canReduce'])
		const currentAccrued = runningTemp.getIn([categoryTypeObj, 'currentAccrued'])
		const currentInAdvance = runningTemp.getIn([categoryTypeObj, 'currentInAdvance'])
		const beInAdvance = runningTemp.getIn([categoryTypeObj, 'beInAdvance'])
		const beTurnOut = runningTemp.getIn([categoryTypeObj, 'beTurnOut'])
		const beZeroInventory = runningTemp.getIn([categoryTypeObj, 'beZeroInventory'])
		const propertyInvest = runningTemp.get('propertyInvest')

		const propertyAssets = runningTemp.get('propertyAssets')
		const beCleaning = runningTemp.getIn([categoryTypeObj, 'beCleaning'])


		// 应收账款、应付账款、其他应收款、其他应付款、预收账款、预付账款
		const beManagemented = runningTemp.getIn([categoryTypeObj, 'beManagemented'])
		const canInsertSocial = runningTemp.getIn([categoryTypeObj,'canInsertSocial'])
		const canInsertFixed = runningTemp.getIn([categoryTypeObj,'canInsertFixed'])
		const canInsertAmortization = runningTemp.getIn([categoryTypeObj,'canInsertAmortization'])
		const canInsertUnVisible = runningTemp.getIn([categoryTypeObj,'canInsertUnVisible'])
		const canInsertEstate = runningTemp.getIn([categoryTypeObj,'canInsertEstate'])
		const canInsertFund = runningTemp.getIn([categoryTypeObj,'canInsertFund'])
		const canInsertWelfare = runningTemp.getIn([categoryTypeObj,'canInsertWelfare'])
		const canInsertEnt = runningTemp.getIn([categoryTypeObj,'canInsertEnt'])
		const canInsertPer = runningTemp.getIn([categoryTypeObj,'canInsertPer'])
		const canAccrued = runningTemp.getIn([categoryTypeObj,'canAccrued'])
		const canInAdvance = runningTemp.getIn([categoryTypeObj,'canInAdvance'])
		const canModifyProperty = runningTemp.getIn([categoryTypeObj,'canModifyProperty'])
		const canInsertClaim = runningTemp.getIn([categoryTypeObj,'canInsertClaim'])
		const canInsertEquity = runningTemp.getIn([categoryTypeObj,'canInsertEquity'])
		const currentPropertyPay = runningTemp.get('currentPropertyPay')
		const currentPropertyTax = runningTemp.get('currentPropertyTax')
		const curPropertyCostList = runningTemp.get('curPropertyCostList')?runningTemp.get('curPropertyCostList'):fromJS([])
		const currentPropertyAssets = runningTemp.get('currentPropertyAssets')
		const currentPropertyInvest = runningTemp.get('currentPropertyInvest')
		const hasChild = runningTemp.get('hasChild')
		const beProject = runningTemp.get('beProject')
		const canProject = runningTemp.get('canProject')
		const currentProject = runningTemp.get('currentProject')
		const allProjectRange = runningTemp.get('allProjectRange')?runningTemp.get('allProjectRange'):fromJS([])
		const projectRange = runningTemp.get('projectRange')?runningTemp.get('projectRange'):fromJS([])
		const currentProjectRange = runningTemp.get('currentProjectRange')?runningTemp.get('currentProjectRange'):fromJS([])
		const canSellOff = runningTemp.getIn([categoryTypeObj,'canSellOff'])
		const currentSellOff = runningTemp.getIn([categoryTypeObj, 'currentSellOff'])
		const beSellOff = runningTemp.getIn([categoryTypeObj,'beSellOff'])
		const currentZeroInventory = runningTemp.getIn([categoryTypeObj,'currentZeroInventory'])
		const canZeroInventory = runningTemp.getIn([categoryTypeObj,'canZeroInventory'])
		const scale = taxRateTemp.get('scale')

		return (
			<Modal
				width="800px"
				okText="保存"
				visible={showModal}
				maskClosable={false}
				className='accountConf-modals'
				title={insertOrModify == 'insert' ? '新增类别' : '编辑类型'}
				onCancel={() => dispatch(runningConfActions.closeRunningConfModal())}
				footer={[
					<Button key="cancel" type="ghost"
						style={{display: insertOrModify == 'insert' ? 'none' : 'inline-block'}}
						onClick={() => {
							dispatch(runningConfActions.closeRunningConfModal())
						}}>
						取 消
					</Button>,
					<Button
						key="ok"
						disabled={!editPermission}
						type={insertOrModify == 'insert' ? 'ghost' : 'primary'}
						onClick={() => {
							const errorList = beforeSaveCheck(runningTemp,categoryTypeObj,isShowAbout)
							if (errorList.length) {
								message.info(errorList.join(','))
							} else {
								dispatch(allRunningActions.saveAccountConfRunningCategory())
							}
						}}
					>
						保 存
					</Button>,
					<Button
						key="addNextAc"
						type="primary"
						disabled={!editPermission}
						style={{display: insertOrModify == 'insert' ? 'inline-block' : 'none'}}
						onClick={() => {
							const errorList = beforeSaveCheck(runningTemp,categoryTypeObj,isShowAbout)
							if (errorList.length) {
								message.info(errorList.join(','))
							} else {
								dispatch(allRunningActions.saveAccountConfRunningCategory(true))
							}
						}}
					>
						保存并新增
					</Button>
				]}
			>
				<div className="accountConf-modal-list running-index running-content">
					<div className="accountConf-modal-list-item" style={{marginRight:'2%'}}>
						<label>类别名称：</label>
						<div>
							<Input
								placeholder="请填入类别名称"
								value={name}
								// disabled={!canDelete}
								disabled={false}

								onChange={(e) => {
									dispatch(runningConfActions.changeRunningConfCommonString('running', 'name', e.target.value))
								}}
							/>
						</div>
					</div>
					<div className="accountConf-modal-list-item">
						<label>上级类别：</label>
						<div>
							<RunUpperSelect
								treeData={runningCategory}
								value={[parentName]}
								placeholder=""
								someDisabled={true}
								categoryType={categoryType}
								// disabled={!canDelete}
								disabled={true}
								onChange={value => {
									dispatch(runningConfActions.selectRunningConfUpperCategory(value))
								}}
							/>
						</div>
					</div>
					<div className="accountConf-modal-list-item accountConf-modal-flex">
						<label>备注：</label>
						<span className='flex-child'>
							<Input
								placeholder="选填(限60个字符)"
								value={runningTemp.get('remark')}
								onChange={(e) => {
									dispatch(runningConfActions.changeRunningConfCommonString('running', 'remark', e.target.value))
								}}
							/>
						</span>
					</div>

					{/* 关联科目－营业收入（支出） 存活*/}
					<BusinessWater
						flags={flags}
						dispatch={dispatch}
						showModal={showModal}
						insertOrModify={insertOrModify}
						runningTemp={runningTemp}
						runningCategory={runningCategory}
						direction={direction}
						categoryTypeObj={categoryTypeObj}
						newJr={newJr}
						enableInventory={enableInventory}
					/>

					{/* 薪酬属性 */}
					{
						categoryType === 'LB_XCZC' ?
							<div>
								<div className="accountConf-modal-list-blockitem small-margin">
									<span>薪酬属性：</span>
									<RadioGroup
										onChange={(e) => {
											dispatch(runningConfActions.emptyAccountCheck([{tab:'running',place:[categoryTypeObj, 'beWithholding'],value:false},{tab:'running',place:[categoryTypeObj, 'beAccrued'],value:false},{tab:'running',place:[categoryTypeObj, 'beWelfare'],value:false}]))
											dispatch(runningConfActions.changeRunningConfCommonString('running', 'propertyPay' ,e.target.value))
										}}
										value={propertyPay}
										disabled={insertOrModify === 'insert' && parentName !=='薪酬支出' || insertOrModify === 'modify' && !canModifyProperty || currentPropertyPay === 'SX_GZXJ'}
									>
										<Radio key="a" value='SX_GZXJ' disabled={true}>工资薪金</Radio>
										<Radio key="b" value='SX_SHBX' disabled={!canInsertSocial && currentPropertyPay !== 'SX_SHBX'}>社会保险</Radio>
										<Radio key="c" value='SX_ZFGJJ' disabled={!canInsertFund && currentPropertyPay !== 'SX_ZFGJJ'}>住房公积金</Radio>
										<Radio key="d" value='SX_FLF' disabled={!canInsertWelfare && currentPropertyPay !== 'SX_FLF'}>福利费</Radio>
										<Radio key="e" value='SX_QTXC'>其他薪酬</Radio>
									</RadioGroup>
								</div>
							</div> : null
						}
						{
							categoryType === 'LB_CQZC' ?
							<div className='accountConf-modal-list-blockitem account-conf-tax-rate-title no-margin'>
								<div className="accountConf-modal-list-blockitem  small-margin">
									<span>资产属性：</span>
									<RadioGroup onChange={(e) => {
										dispatch(runningConfActions.changeRunningConfCommonString('running', 'propertyAssets' ,e.target.value))
										dispatch(runningConfActions.changeRunningConfCommonString('running', 'name' ,{SX_GDZC:'固定资产',SX_WXZC:'无形资产',SX_TZXFDC:'投资性房地产',SX_CQFYTX:'长期待摊费用'}[e.target.value]))
									}}
										value={propertyAssets}
										disabled={parentName !== '长期资产' && (insertOrModify === 'modify' && !canModifyProperty || insertOrModify === 'insert') }
									>
										<Radio key="a" value='SX_GDZC' disabled={!canInsertFixed && currentPropertyAssets !== 'SX_GDZC'}>固定资产</Radio>
										<Radio key="b" value='SX_WXZC' disabled={!canInsertUnVisible && currentPropertyAssets !== 'SX_WXZC'}>无形资产</Radio>
										<Radio key="c" value='SX_TZXFDC' disabled={!canInsertEstate && currentPropertyAssets !== 'SX_TZXFDC'}>投资性房地产</Radio>
										<Radio key="d" value='SX_CQFYTX' disabled={!canInsertAmortization && currentPropertyAssets !== 'SX_CQFYTX'}>长期待摊费用</Radio>
									</RadioGroup>
								</div>
							</div> : null
						}
						{
							categoryType === 'LB_TZ' ?
							<div className='accountConf-modal-list-blockitem account-conf-tax-rate-title'>
								<div className="accountConf-modal-list-item small-margin" style={{width:'57%'}}>
									<span>投资属性：</span>
									<RadioGroup onChange={(e) => {
										dispatch(runningConfActions.changeRunningConfCommonString('running', 'propertyInvest' ,e.target.value))
									}}
										value={propertyInvest}
										disabled={parentName !== '投资'  && (insertOrModify === 'modify' && !canModifyProperty || insertOrModify === 'insert') }
									>
										<Radio key="a" value='SX_ZQ' disabled= {!canInsertClaim && currentPropertyInvest !== 'SX_ZQ'}>债权</Radio>
										<Radio key="b" value='SX_GQ' disabled= {!canInsertEquity && currentPropertyInvest !== 'SX_GQ'}>股权</Radio>
									</RadioGroup>
								</div>
							</div> : null
						}

					{/* 费用属性 */}
					{
						<div className='accountConf-modal-list-blockitem small-margin' style={{display:(categoryType ==='LB_FYZC'||categoryType ==='LB_XCZC') && propertyCostList.some(v => v === 'XZ_FINANCE')? '' : 'none'}} >
							<span>费用性质：</span>
							<CheckboxGroup
								value={['财务费用']}
								options={['财务费用']}
								disabled={true}
							/>
						</div>
					}
					{
						<div className='accountConf-modal-list-blockitem small-margin' style={{display:(categoryType ==='LB_FYZC' || categoryType ==='LB_XCZC'|| categoryType === 'LB_CQZC') && !propertyCostList.some(v => v === 'XZ_FINANCE')? '' : 'none'}} >
							<span>{`${categoryType === 'LB_CQZC'?'折旧/摊销':'费用'}性质：`}</span>
							{
                                ['XZ_SALE','XZ_MANAGE'].map((v,i) =>
                                    <span key={i}>
                                        <Checkbox
                                            checked={propertyCostList.find(w => w === v)}
                                            // disabled={(insertOrModify == 'insert' && !curPropertyCostList.find(w => w === v) || insertOrModify == 'modify' && !propertyList.find(w => w === v)) && level !== 1 }
                                            onChange={(e) => {
												propertyCostList.find(w => w === v)?
												dispatch(runningConfActions.changeRunningConfCommonString('running', 'propertyCostList', propertyCostList.update(w => w.filter(z => z!==v))))
												:
												dispatch(runningConfActions.changeRunningConfCommonString('running', 'propertyCostList', propertyCostList.update(w => w.push(v))))
                                            }}
										/>
										{/* <Tooltip placement="topLeft" className='no-padding' title={`${(insertOrModify == 'insert' && !curPropertyCostList.find(w => w === v) || insertOrModify == 'modify' && !propertyList.find(w => w === v)) && level !== 1 ?'上级未启用':''}`}> */}
											{{XZ_SALE:'销售费用',XZ_MANAGE:'管理费用'}[v]}
										{/* </Tooltip> */}
                                    </span>
                                )
                            }
						</div>
					}
					{
						categoryType === 'LB_SFZC'?
						<div className="accountConf-modal-list-blockitem" >
							<span>税费属性：</span>
							<RadioGroup onChange={(e) => {
								dispatch(runningConfActions.emptyAccountCheck([{tab:'running',place:[categoryTypeObj, 'beInAdvance'],value:false},{tab:'running',place:[categoryTypeObj, 'beTurnOut'],value:false},{tab:'running',place:[categoryTypeObj, 'beAccrued'],value:false}]))
								dispatch(runningConfActions.changeRunningConfCommonString('running', 'propertyTax' ,e.target.value))
								if (e.target.value === 'SX_ZZS' || e.target.value === 'SX_GRSF' ) {
									dispatch(runningConfActions.changeRunningConfCommonString('running', 'beProject' ,false))
								}
							}} value={propertyTax} disabled={insertOrModify === 'insert' && parentName !=='税费支出' || insertOrModify === 'modify' && !canModifyProperty }>
								<Radio key="a" value='SX_ZZS' disabled={true}>增值税</Radio>
								<Radio key="b" value='SX_GRSF' disabled={!canInsertPer && currentPropertyTax !== 'SX_GRSF'}>个人税费</Radio>
								<Radio key="c" value='SX_QYSDS' disabled={!canInsertEnt && currentPropertyTax !== 'SX_QYSDS'}>企业所得税</Radio>
								<Radio key="d" value='SX_QTSF'>其他税费</Radio>
							</RadioGroup>
						</div> : null
					}
					<div className='accountConf-separator'></div>
					{/* 收付管理 */}
					{/* <div className='ac-list'> */}

					<Management
						flags={flags}
						dispatch={dispatch}
						showModal={showModal}
						insertOrModify={insertOrModify}
						runningTemp={runningTemp}
						runningCategory={runningCategory}
						showManagemented={showManagemented}
						beManagemented={beManagemented}
						propertyShow={propertyShow}
						categoryTypeObj={categoryTypeObj}
						newJr={newJr}
						showSf={showSf}
					/>
					{
						categoryType !== 'LB_ZB'
						&& propertyTax !== 'SX_ZZS'
						&& propertyTax !== 'SX_GRSF'
						&& (newJr && enableProject || !newJr)?
						<div className="accountConf-modal-list-blockitem accountConf-modal-flex">
							<div>
								<span onClick={() => {
									// if ((insertOrModify == 'insert' && currentProject || insertOrModify == 'modify' && canProject) || level === 1 && !beSpecial ) {
										if (!beProject && !projectRange.size) { // 点击开启项目时默认勾选第一个项目
											if (allProjectRange.size) {
												dispatch(runningConfActions.changeCardCheckboxArrOut('projectRange', allProjectRange.getIn([0, 'uuid']), true))
											}
										}
										dispatch(runningConfActions.changeRunningConfCommonString('running', 'beProject', !beProject))
									// }
								}}>
									<Checkbox
										checked={beProject}
										// disabled={(insertOrModify == 'insert' && !currentProject|| insertOrModify == 'modify' && !canProject) && (level !== 1 || beSpecial) }
									/>
									项目管理
									{/* <Tooltip placement="topLeft" title={`${(insertOrModify == 'insert' && !currentProject || insertOrModify == 'modify' && !canProject) && (level !== 1 || beSpecial)?'上级未启用':''}`}>项目管理</Tooltip> */}
								</span>
							</div>
							<div className='child-chosen' style={{display:beProject? '' : 'none'}}>
								<span>范围：</span>
								{
									allProjectRange
									// .filter(v => {if (categoryType === 'LB_YYZC' && propertyCarryover === 'SX_HW' && v.get('name') === '生产项目') {return false}return true})
									// .filter(v => {if (categoryType === 'LB_YYZC' && propertyCarryover === 'SX_HW' && v.get('name') === '施工项目') {return false}return true})
									.map((v,i) =>
										<span key={i}>
											<Checkbox
												checked={projectRange.find(w => w === v.get('uuid'))}
												// disabled={(insertOrModify == 'insert' && !currentProjectRange.find(w => w === v.get('uuid')) || insertOrModify == 'modify' && !v.get('canUse')) && (level !== 1 || beSpecial) }
												onChange={(e) => {
													dispatch(runningConfActions.changeCardCheckboxArrOut('projectRange', v.get('uuid'),e.target.checked))
												}}
											/>
											{v.get('name')}
											{/* <Tooltip placement="topLeft" title={`${(insertOrModify == 'insert' && !currentProjectRange.find(w => w === v.get('uuid'))|| insertOrModify == 'modify' && !v.get('canUse')) && (level !== 1 || beSpecial)?'上级未启用':''}`}>{v.get('name')}</Tooltip> */}
										</span>
									)
								}
							</div>
						</div> : ''
					}
					{/* 退销流水 */}
					<div className='accountConf-modal-list-blockitem' style={{display: (categoryTypeObj==='acBusinessIncome' || categoryTypeObj==='acBusinessExpense')? '' : 'none'}} >
						<span onClick={() => {
							if ((insertOrModify == 'insert' && currentSellOff || insertOrModify == 'modify' && canSellOff) || level === 1 ) {
								dispatch(runningConfActions.changeRunningConfCommonString('running', [categoryTypeObj, 'beSellOff'], !beSellOff))
							}
						}}>
							<Checkbox
								checked={beSellOff}
								disabled={(insertOrModify == 'insert' && !currentSellOff|| insertOrModify == 'modify' && !canSellOff) && level !== 1 }
							/>
							<Tooltip className='no-padding' placement="topLeft" title={`${(insertOrModify == 'insert' && !currentSellOff || insertOrModify == 'modify' && !canSellOff) && level !== 1?'上级未启用':''}`}>{`支持录入退${categoryType === 'LB_YYSR'?'销':'购'}流水`}</Tooltip>
						</span>
					</div>
					<div className='accountConf-modal-list-blockitem' style={{display: categoryType ==='LB_YYZC' && propertyCarryover === 'SX_HW'? '' : 'none'}} >
						<span onClick={() => {
							// if ((insertOrModify == 'insert' && currentSellOff || insertOrModify == 'modify' && canSellOff) || level === 1 ) {
								dispatch(runningConfActions.changeRunningConfCommonString('running', [categoryTypeObj, 'beZeroInventory'], !beZeroInventory))
							// }
						}}>
							<Checkbox
								checked={beZeroInventory}
								// disabled={(insertOrModify == 'insert' && !currentSellOff|| insertOrModify == 'modify' && !canSellOff) && level !== 1 }
							/>
							<Tooltip className='no-padding' placement="topLeft" title={`${(insertOrModify == 'insert' && !currentZeroInventory || insertOrModify == 'modify' && !canZeroInventory) && level !== 1?'上级未启用':''}`}>启用零库存模式</Tooltip>
						</span>
					</div>
					{/* 借款 */}

					{/* 借款 计提应付利息 */}
					{
						propertyShow === '借款' ?
						<div  className="accountConf-modal-list-blockitem accountConf-modal-flex no-margin">
							<div className='accountConf-modal-list-blockitem'>
								<span onClick={() => {
									dispatch(runningConfActions.changeRunningConfCommonString('running', [categoryTypeObj, 'beAccrued'], !beAccrued))
								}}>
									<Checkbox
										checked={beAccrued}
										// disabled={(insertOrModify == 'insert' && !currentAccrued|| insertOrModify == 'modify' && !canAccrued) && (level !== 1 || beSpecial) }
									/>
									计提应付利息
									{/* <Tooltip placement="topLeft" className='no-padding' title={`${(insertOrModify == 'insert' && !currentAccrued || insertOrModify == 'modify' && !canAccrued) && (level !== 1 || beSpecial)?'上级未启用':''}`}>计提应付利息</Tooltip> */}
								</span>
							</div>
						</div> : null
					}

					{/* 资本 计提科目 */}
					{
						categoryType === 'LB_ZB'?
						<div  className="accountConf-modal-list-blockitem accountConf-modal-flex no-margin">
							<div className='accountConf-modal-list-blockitem'>
								<span onClick={() => {
									dispatch(runningConfActions.changeRunningConfCommonString('running', [categoryTypeObj, 'beAccrued'], !beAccrued))
								}}>
									<Checkbox
										checked={beAccrued}
										// disabled={(insertOrModify == 'insert' && !currentAccrued|| insertOrModify == 'modify' && !canAccrued) && (level !== 1 || beSpecial) }
									/>
									计提应付利润
									{/* <Tooltip placement="topLeft" className='no-padding' title={`${(insertOrModify == 'insert' && !currentAccrued || insertOrModify == 'modify' && !canAccrued) && (level !== 1 || beSpecial)?'上级未启用':''}`}>计提应付利润</Tooltip> */}
								</span>
							</div>
						</div> : null
					}
					{/* 税费属性 */}

					{/* 属性结束 */}
					{/* 投资 计提 */}
					{
						categoryType === 'LB_TZ'?
						<div className="accountConf-modal-list-blockitem accountConf-modal-flex no-margin">
							<div className='accountConf-modal-list-blockitem'>
								<span onClick={() => {
									dispatch(runningConfActions.changeRunningConfCommonString('running', [categoryTypeObj, 'beAccrued'], !beAccrued))
								}}>
									<Checkbox
										checked={beAccrued}
										// disabled={(insertOrModify == 'insert' && !currentAccrued|| insertOrModify == 'modify' && !canAccrued) && level !== 1 }
									/>
									{`计提应收${propertyInvest === 'SX_GQ'?'股利':'利息'}`}
									{/* <Tooltip placement="topLeft" className='no-padding' title={`${(insertOrModify == 'insert' && !currentAccrued || insertOrModify == 'modify' && !canAccrued) && level !== 1?'上级未启用':''}`}>{`计提应收${propertyInvest === 'SX_GQ'?'股利':'利息'}`}</Tooltip> */}
								</span>
							</div>
						</div> : null
					}
					{/* 薪酬支出－计提/代缴  薪酬/社保/公积金/福利费/其他 */}
					<PayWater
						flags={flags}
						dispatch={dispatch}
						showModal={showModal}
						insertOrModify={insertOrModify}
						runningTemp={runningTemp}
						runningCategory={runningCategory}
						categoryTypeObj={categoryTypeObj}

					/>

					{/* 预交增值税 */}
					<div style={{display: categoryType === 'LB_SFZC'?'':'none'}} className="accountConf-modal-list-blockitem accountConf-modal-flex no-margin">
						<div className='accountConf-modal-list-blockitem' style={{display: propertyTax ==='SX_ZZS' && (scale === 'general' || scale === 'small')?'' :'none'}}>
							<span onClick={() => {
								if ((insertOrModify == 'insert' && currentInAdvance || insertOrModify == 'modify' && canInAdvance) || level === 1 ) {
									dispatch(runningConfActions.changeRunningConfCommonString('running', [categoryTypeObj, 'beInAdvance'], !beInAdvance))
								}
							}}>
								<Checkbox
									checked={beInAdvance}
									disabled={(insertOrModify == 'insert' && !currentInAdvance|| insertOrModify == 'modify' && !canInAdvance) && level !== 1 }
								/>
								<Tooltip placement="topLeft" className='no-padding' title={`${(insertOrModify == 'insert' && !currentInAdvance || insertOrModify == 'modify' && !canInAdvance) && level !== 1?'上级未启用':''}`}>预交增值税</Tooltip>
							</span>
						</div>

						{
							propertyTax === 'SX_QYSDS' || propertyTax === 'SX_QTSF' ?
							<div className='accountConf-modal-list-blockitem'>
								<span onClick={() => {
									dispatch(runningConfActions.changeRunningConfCommonString('running', [categoryTypeObj, 'beAccrued'], !beAccrued))
								}}>
									<Checkbox
										checked={beAccrued}
										// disabled={(insertOrModify == 'insert' && !currentAccrued|| insertOrModify == 'modify' && !canAccrued) && level !== 1 }
									/>
									计提税费
									{/* <Tooltip placement="topLeft" className='no-padding' title={`${(insertOrModify == 'insert' && !currentAccrued || insertOrModify == 'modify' && !canAccrued) && level !== 1?'上级未启用':''}`}>计提税费</Tooltip> */}
								</span>
							</div> : null
						}

					</div>
					{/* 税费减免 */}
					<div style={{display: categoryType === 'LB_SFZC'?'':'none'}} className="accountConf-modal-list-blockitem accountConf-modal-flex no-margin-top">
						<div className='accountConf-modal-list-blockitem' style={{display: propertyTax ==='SX_ZZS' || propertyTax === 'SX_QYSDS' && beAccrued || propertyTax === 'SX_QTSF' && beAccrued ?'' :'none'}}>
							<span
								onClick={() => {
									if ((insertOrModify == 'insert' && currentAccrued || insertOrModify == 'modify' && canAccrued) || level === 1 ) {
										dispatch(runningConfActions.changeRunningConfCommonString('running', [categoryTypeObj, 'beReduce'], !beReduce))
									}
								}}
							>
								<Checkbox
									checked={beReduce}
									disabled={(insertOrModify == 'insert' && !currentReduce|| insertOrModify == 'modify' && !canReduce) && level !== 1 }
								/>
								<Tooltip placement="topLeft" className='no-padding' title={`${(insertOrModify == 'insert' && !currentReduce || insertOrModify == 'modify' && !canReduce) && level !== 1?'上级未启用':''}`}>启用减免税费</Tooltip>
							</span>
						</div>
					</div>
				</div>
			</Modal>
		)
	}
}
