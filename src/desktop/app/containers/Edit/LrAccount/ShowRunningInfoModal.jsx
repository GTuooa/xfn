import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as Limit from 'app/constants/Limit.js'
import { DatePicker, Input, Select, Checkbox, Button, Modal, message, Timeline } from 'antd'
import { RunCategorySelect, AcouontAcSelect, TableBody, TableTitle, TableItem, JxcTableAll, Amount} from 'app/components'

import * as cxlsActions from 'app/redux/Search/Cxls/cxls.action'
import { toJS } from 'immutable'

@immutableRenderDecorator
export default
class ModifyModal extends React.Component {
	constructor() {
		super()
		this.state = {

    }
	}
	// componentWillReceiveProps(nextprops) {
	// }

	render() {
		const {
			onCancel,
			dispatch,
            showRunningInfo,
            showRunningInfoModal,
			runningInfoModalType,
			modifyRunningModal
		} = this.props

		const showDetail = showRunningInfo.get('detail') && showRunningInfo.get('detail').size ? '' : 'none'


		return (
			<Modal
                width="500"
				visible={showRunningInfoModal}
				maskClosable={false}
				title={'查看流水'}
                onCancel={onCancel}
                className="showrunning"
				footer={[
					<Button key="cancel" type="ghost"
						onClick={() => {
                            onCancel()
					}}>
                    取 消
					</Button>,
					<Button key="ok"
						type="ghost"
						style={{display: runningInfoModalType ? 'none' : 'inline-block'}}
						onClick={() => {
							  onCancel()
						}}
					>
					确 定
					</Button>,
					<Button key="modify"
						type="ghost"
						style={{display: runningInfoModalType ? 'inline-block' : 'none'}}
						onClick={() => {
							  modifyRunningModal()
						}}
					>
					修 改
					</Button>
				]}
			>
                <div className="showrunning-wrap">
                    <div className="showrunning-item">
                        <span>流水号：</span>
                        <span>{showRunningInfo.get('flowNumber')}</span>
                    </div>
                    <div className="showrunning-item">
                        <span>日期：</span>
                        <span>{showRunningInfo.get('runningDate')}</span>
                    </div>
                    <div className="showrunning-item">
                        <span>摘要：</span>
                        <span>{showRunningInfo.get('runningAbstract')}</span>
                    </div>
                    <div className="showrunning-item">
                        <span>账户：</span>
                        <span>{showRunningInfo.get('accountName')}</span>
                    </div>
                    <div className="showrunning-item">
                        <span>{`${showRunningInfo.get('direction') === 'debit' ? '收' : '付'}款金额：`}</span>
                        <span>{Math.abs(showRunningInfo.get('amount'))}</span>
                    </div>
                    <JxcTableAll
						style={{display: showDetail}}
						>
    					<TableTitle
    						className="account-running-table-width"
    						titleList={['流水类别', '流水单号', '收款核销', '付款核销']}
    					/>
    					<TableBody>
                            {(showRunningInfo.get('detail') || []).map((u, i) => (
                                <TableItem className="account-running-table-width">
                                    <li>
                                        {u.get('categoryName')}
                                    </li>
                                    <li>
                                        {u.get('flowNumber')}
                                    </li>
                                    <li>
										{
											u.get('runningState') == 'inAdvance' ?
											<Amount className="account-running-receive-amount">{u.get('direction') === 'debit' ? Math.abs(u.get('handleAmount')) : ''}</Amount>
											:
											<Amount className="account-running-pay-amount">{u.get('direction') === 'debit' ? u.get('handleAmount') : ''}</Amount>
										}
                                    </li>
									<li>
										{
											u.get('runningState') == 'inAdvance' ?
											<Amount className="account-running-receive-amount">{u.get('direction') === 'debit' ? '' : Math.abs(u.get('handleAmount'))}</Amount>
											:
											<Amount className="account-running-pay-amount">{u.get('direction') === 'debit' ? '' : u.get('handleAmount')}</Amount>
										}
                                    </li>
                                </TableItem>
                            ))}
    					</TableBody>
    				</JxcTableAll>
                    {/* <div>
                        <div></div>
                      </div> */}
                </div>
			</Modal>
		)
	}
}
