import React, { PropTypes }	from 'react'
import { toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Icon, Amount, Single } from 'app/components'
import * as thirdParty from 'app/thirdParty'

@immutableRenderDecorator
export default
class AssistSelect extends React.Component {
	state = {
        checkedList: [],
		batchValue: {
			batchUuid: '',
			batch: '',
			productionDate: '',
			expirationDate: ''
			
		},
    }

	componentWillReceiveProps (nextProps) {
        nextProps.show && this.setState({
            'checkedList': nextProps.oriAssistList,
            'batchValue': nextProps.oriBatch,
        })
    }

	render() {
		const { show, assistList, batchList, openAssist, openBatch, onOk, addClick, modifyClick, oriBatch, oriAssistList } = this.props
		const { checkedList, batchValue } = this.state

		let classificationUuidList = []

		return (
			<div className={`xfn-multiple ${show ? 'xfn-multiple-animate' : 'xfn-multiple-none-animate'}`}>
				<div className={`xfn-multiple-popup ${show ? 'xfn-multiple-popup-animate' : 'xfn-multiple-popup-none-animate'}`}
					style={{minHeight: '75%'}}
					>
					<div className='xfn-multiple-title'>
						<div>
							<span>请选择属性</span>
						</div>
					</div>
					<ul style={{padding: '0 .1rem'}}>
						{openAssist && assistList.map((v, i) => {
							const classificationUuid = v.get('uuid')
                            const classificationName = v.get('name')
							classificationUuidList.push(classificationUuid)

							return (
								<div key={classificationUuid} className='margin-top'>
									<div>
										{v.get('name')}
									</div>

									<div className="padding-top">
										{ v.get('propertyList').map(property => {
											const propertyUuid = property.get('uuid')
											const propertyName = property.get('name')
											const idx = checkedList.findIndex((c) => c['propertyUuid']==propertyUuid)

											let classStr = 'assist-button', select = false
											if (idx > -1) {
												select = true
												classStr = 'assist-button assist-select'
											}

											return (
												<span className={classStr}
													key={propertyUuid}
													onClick={() => {
														if (select) {//取消选中
															checkedList.splice(idx, 1)
														} else {//选中
															const classIdx = checkedList.findIndex((c) => c['classificationUuid']==classificationUuid)
															if (classIdx > -1) {
																checkedList.splice(classIdx, 1)
															}

															checkedList.push({
																propertyUuid,
																propertyName,
																classificationUuid,
																classificationName
															})
														}
														this.setState({checkedList: checkedList})
													}}
												>
													{propertyName}
												</span>
											)
										})}
									</div>
								</div>
							)
						})}

						<div className='margin-top' style={{display: openBatch ? '' : 'none'}}>
							<div>批次</div>
							<Single
								className="padding-top"
								district={batchList}
								title='请选择批次'
								value={batchValue['batch']}
								maxHeight={'100%'}
								icon={{
                                    type: 'add-plus',
                                    onClick: () => {
                                        addClick()
                                    }
                                }}
								iconTwo={{
									type: 'piliangjizhang',
                                    onClick: () => {
                                        modifyClick()
                                    }
								}}
								onOk={value => {
									this.setState({
										batchValue: {
											batch: value['value'],
											productionDate: value['productionDate'],
											expirationDate: value['expirationDate'],
											batchUuid: value['batchUuid'],
											keyStr: value['key'],
										}
									})
								}}
							>
								<div className='inventory-warehouse-sub'>
									<span className={batchValue['batch'] ? '' : 'gray'}>{batchValue['batch'] ? batchValue['keyStr'] : '请选择/新增批次号'}</span>
									&nbsp;<Icon type="arrow-right" size="14" />
								</div>
							</Single>
						</div>
					</ul>

					<div className='xfn-multiple-select'>
						<span></span>
						<span className='xfn-multiple-button'
							onClick={()=>{
								if (openAssist) {
									let arr = [], idxArr = []
									checkedList.forEach((v, i) => {
										if (classificationUuidList.includes(v['classificationUuid'])) {
											arr.push(v['classificationUuid'])
										} else {
											idxArr.push(i)
										}
									})
									if (idxArr.length) {//删除不存在的属性类别
										idxArr.map(v => { checkedList.splice(v, 1) })

									}
									if (classificationUuidList.length!=arr.length) {
										return thirdParty.toast.info('请选择完整的属性')
									}
								}
								if (openBatch) {
									if (!batchValue['batch']) {
										return thirdParty.toast.info('请选择批次')
									}
								}

								onOk(checkedList, batchValue)
								this.setState({
									checkedList: [],
									batchValue: {
										batchUuid: '',
										batch: '',
										productionDate: '',
										expirationDate: '',
									}
								})
							}}
						>
							确定
						</span>
					</div>
				</div>
			</div>


		)
	}
}
