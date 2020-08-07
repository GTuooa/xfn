import React from 'react'

import { Icon } from 'app/components'
import { configCheck } from 'app/utils'
import thirdParty from 'app/thirdParty'
import './assist.less'

export default
class AssistSelect extends React.Component {
	scrollView = ''
	state = {
        checkedList: [],
	}
	
	componentDidMount () {
        this.scrollView = document.getElementsByClassName('scroll-view')[0]
    }
	componentWillReceiveProps (nextProps) {
        nextProps.assistVisible && this.setState({
            'checkedList': nextProps.oriAssistList,
		})
		if (nextProps.assistVisible && this.scrollView) {
			this.scrollView.style['overflow-y']='hidden'
		}
		if (!nextProps.assistVisible && this.scrollView) {
			this.scrollView.style['overflow-y']='auto'
		}
    }

	render() {
		const { assistVisible, assistClassificationList, onOk, addClick, onCancel } = this.props
		const { checkedList } = this.state

		let classificationUuidList = []//属性类别uuid列表

		return (
			<div className={`edit-assist xfn-multiple ${assistVisible ? 'xfn-multiple-animate' : 'xfn-multiple-none-animate'}`} onClick={() => onCancel()}>
				<div className={`xfn-multiple-popup ${assistVisible ? 'xfn-multiple-popup-animate' : 'xfn-multiple-popup-none-animate'}`}
					style={{minHeight: '75%'}}
					onClick={(e) => e.stopPropagation()}
					>
					<div className='xfn-multiple-title'>
						<div>
							<span>请选择属性</span>
						</div>
					</div>
					<ul style={{padding: '0 .1rem'}}>
						{assistClassificationList.map((v, i) => {
							const inventoryUuid = v.get('inventoryUuid')
							const classificationUuid = v.get('uuid')
                            const classificationName = v.get('name')
							classificationUuidList.push(classificationUuid)

							return (
								<div key={classificationUuid} className='margin-top'>
									<div>{classificationName}</div>

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

										<span className='assist-button assist-add'
											key={'add'}
											onClick={() => {
												thirdParty.Prompt({
													title: `新增${classificationName}`,
													message: '请输入属性名称:',
													buttonLabels: ['取消', '确认'],
													onSuccess: (result) => {
														if (result.buttonIndex === 1) {
															const checkList = [{
																type:'topestName',
																value: result.value,
															}]
															configCheck.beforeSaveCheck(checkList, () => {
																addClick({inventoryUuid, classificationUuid, name: result.value})
															})
														}
													}
												})

											}}
										>
											<Icon type="add"/> 新增
										</span>
									</div>
								</div>
							)
						})}


					</ul>

					<div className='xfn-multiple-select'>
						<span className='overElli'>{checkedList.reduce((p, c) => `${p}${p?';':''}${c['propertyName']}`, '')}</span>
						<span className='xfn-multiple-button'
							onClick={()=>{
								const arr = checkedList.map(v => v['classificationUuid'])
								if (classificationUuidList.length!=arr.length) {
									return thirdParty.toast.info('请选择完整的属性')
								}

								onOk(checkedList)
								this.setState({ checkedList: [] })
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
