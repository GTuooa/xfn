import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import { Collapse, Icon, Button, Modal, DatePicker, Input, Select, Switch, message, Tooltip } from 'antd'
import { formatNum, formatMoney, formatDate, numberTest } from 'app/utils'
import * as Limit from 'app/constants/Limit.js'
import moment from 'moment'
import { categoryTypeAll, type, business, beforejumpCxToLr } from 'app/containers/components/moduleConstants/common'
const Panel = Collapse.Panel
import NumberInput from 'app/components/Input'
import AccountPoundage from 'app/containers/Search/SearchRunning/AccountPoundage'
import { accountPoundage } from './app'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'
import * as searchRunningActions from 'app/redux/Search/SearchRunning/searchRunning.action'
import SearchModal from 'app/containers/components/Searchclosure/SearchModal'
import { searchRunningAllActions } from 'app/redux/Search/SearchRunning/searchRunningAll.js'
@immutableRenderDecorator
export default
class JournalDetail extends React.Component {
    state = {
        show:false
    }
    initModal = (modalName) => {
		this.setState({[modalName]:false})
        this.props.dispatch(searchRunningActions.changeCxAccountCommonOutString('modalTemp',fromJS({oriDate:formatDate().substr(0,10)})))
        this.props.dispatch(searchRunningAllActions.clearEnclosureList())
	}
    render() {
        const {
            dispatch,
            jrFlowList,
            item,
            i,
            editLrAccountPermission,
            categoryType,
            searchRunningState,
            accountList,
            intelligentStatus,
            isCurrentRunning,
            showRelatedRunning,
            lrPermissionInfo,
			enclosureList,
			label,
			closedBy,
			reviewedBy,
			enCanUse,
			checkMoreFj,
			uploadKeyJson,
        } = this.props
        const modalTemp = searchRunningState.get('modalTemp')
        const flags = searchRunningState.get('flags')
        const runningFlowTemp = searchRunningState.get('runningFlowTemp')
        const contactsCardRange = runningFlowTemp.getIn(["currentCardList", 0])
		const oriDate = runningFlowTemp.get('oriDate')
		const magenerType = runningFlowTemp.get('magenerType')
        const propertyPay = runningFlowTemp.get('propertyPay')
        const projectList = flags.get('projectList')
        const categoryTypeObj = categoryTypeAll[categoryType]
        const stockCardList = modalTemp.get('stockCardList') || []
        const companySocialSecurityAmount = modalTemp.getIn(['payment','companySocialSecurityAmount'])
		const companyAccumulationAmount = modalTemp.getIn(['payment','companyAccumulationAmount'])
        const total = item.get('childList').get(item.get('childList').size-1) || fromJS([])
        const { deleteModal, manageModal, carryoverModal, show, invioceModal, defineModal, jzsyModal, grantModal, defrayModal, backModal, takeBackModal } = this.state
        const getCarrayOver = (item) => {
            const makeOut = item.get('makeOut')
            const carryover = item.get('carryover')
            const auth = item.get('auth')
            const receive = item.get('receive')
            const pay = item.get('pay')
            const shouldReturn = item.get('shouldReturn')
            const grant = item.get('grant')
            const defray = item.get('defray')
            const takeBack = item.get('takeBack')
            const back = item.get('back')
            const runningType = item.get('runningType')
            let elementList = []
            switch (receive) {
                case '1':
                case '2':
                    elementList.push(
                        <div key='c3' className='ylls-title-btn'>
                            <Button
                                type='ghost'
                                className='handle-btn'
                                disabled={!editLrAccountPermission}
                                onClick={() => {
                                    dispatch(searchRunningActions.getBusinessManagerModal(item,fromJS({jrJvUuid:item.get('jrJvUuid')}),() => {this.setState({
                                        manageModal:true
                                    })},'debit', 'receive'))
                                }}
                                >收款
                            </Button>
                        </div>
                    )
            }
            switch (pay) {
                case '1':
                case '2':
                    elementList.push(
                        <div key='d3' className='ylls-title-btn'>
                            <Button
                                type='ghost'
                                className='handle-btn'
                                disabled={!editLrAccountPermission}
                                onClick={() => {
                                    dispatch(searchRunningActions.getBusinessManagerModal(item,fromJS({jrJvUuid:item.get('jrJvUuid')}),() => {this.setState({
                                        manageModal:true
                                    })},'credit', 'pay'))
                                }}
                                >付款
                            </Button>
                        </div>
                    )

            }
            switch (shouldReturn) {
                case '1':
                case '2':
                    elementList.push(
                        <div key='f3' className='ylls-title-btn'>
                            <Button
                                type='ghost'
                                className='handle-btn'
                                disabled={!editLrAccountPermission}
                                onClick={() => {
                                    dispatch(searchRunningActions.getBusinessManagerModal(item,fromJS({jrJvUuid:item.get('jrJvUuid')}),() => {this.setState({
                                        manageModal:true
                                    })},'credit', 'shouldReturn'))
                                }}
                                >退款
                            </Button>
                        </div>
                    )
            }
            switch (grant) {
                case '1':
                case '2':
                    elementList.push(
                        <div key='f3' className='ylls-title-btn'>
                            <Button
                                type='ghost'
                                className='handle-btn'
                                disabled={!editLrAccountPermission}
                                onClick={() => {
                                    dispatch(searchRunningActions.getBusinessGrantModal(item,fromJS({jrJvUuid:item.get('jrJvUuid')}),() => {this.setState({
                                        grantModal:true
                                    })}))
                                }}
                                >{`${item.get('notHandleAmount') < 0 ? '收款' : '发放' }`}
                            </Button>
                        </div>
                    )
            }
            switch (defray) {
                case '1':
                case '2':
                    elementList.push(
                        <div key='f3' className='ylls-title-btn'>
                            <Button
                                type='ghost'
                                className='handle-btn'
                                disabled={!editLrAccountPermission}
                                onClick={() => {
                                    dispatch(searchRunningActions.getBusinessDefrayModal(item,fromJS({jrJvUuid:item.get('jrJvUuid')}),() => {this.setState({
                                        defrayModal:true
                                    })}))
                                }}
                                >{`${item.get('notHandleAmount') < 0 ? '收款' : '缴纳' }`}
                            </Button>
                        </div>
                    )
            }
            switch (takeBack) {
                case '1':
                case '2':
                    elementList.push(
                        <div key='f3' className='ylls-title-btn'>
                            <Button
                                type='ghost'
                                className='handle-btn'
                                disabled={!editLrAccountPermission}
                                onClick={() => {
                                    dispatch(searchRunningActions.getBusinessTakeBackModal(item,fromJS({jrJvUuid:item.get('jrJvUuid')}),() => {this.setState({
                                        takeBackModal:true
                                    })}))
                                }}
                                >收回
                            </Button>
                        </div>
                    )
            }
            switch (back) {
                case '1':
                case '2':
                    elementList.push(
                        <div key='f3' className='ylls-title-btn'>
                            <Button
                                type='ghost'
                                className='handle-btn'
                                disabled={!editLrAccountPermission}
                                onClick={() => {
                                    dispatch(searchRunningActions.getBusinessBackModal(item,fromJS({jrJvUuid:item.get('jrJvUuid')}),() => {this.setState({
                                        backModal:true
                                    })}))
                                }}
                                >退还
                            </Button>
                        </div>
                    )
            }
            if(makeOut == 1 || makeOut == 2) {
                elementList.push(
                    <div className='ylls-title-btn'>
                    <Button type='ghost' className='handle-btn' disabled={!editLrAccountPermission} onClick={() => {
                    dispatch(searchRunningActions.getBusinessInvioceModal(item,fromJS({jrJvUuid:item.get('jrJvUuid')}),() => {this.setState({
                        invioceModal:true
                    })}))
                    }}>开票</Button>
                </div>)
            }
            if(
                carryover == 1
                && runningType !== 'LX_ZZS_YKP'
                && runningType !== 'LX_ZZS_WKP'
                && runningType !== 'LX_ZZS_YRZ'
                && runningType !== 'LX_ZZS_WRZ') {
                elementList.push(
                    <div className='ylls-title-btn' style={{display:categoryType === 'LB_CQZC'?'':'none'}}>
                        <Button
                            type='ghost'
                            className='handle-btn'
                            disabled={!editLrAccountPermission}
                            onClick={() => {
                                if (categoryType === 'LB_CQZC') {
                                    dispatch(searchRunningActions.getBusinessJzsyModal(item,fromJS({jrJvUuid:item.get('jrJvUuid')}),() => {this.setState({
                                        jzsyModal:true
                                    })}))
                                } else {
                                    dispatch(searchRunningActions.getBusinessCarryoverModal(item,fromJS({jrJvUuid:item.get('jrJvUuid')}),() => {this.setState({
                                        carryoverModal:true
                                    })}))
                                }
                            }}>结转
                        </Button>
                    </div>
                )
            } else if (carryover == 1 && categoryType === 'LB_CQZC' ){
                elementList.push(
                <div className='ylls-title-btn'>
                    <Button
                        type='ghost'
                        className='handle-btn'
                        disabled={!editLrAccountPermission}
                        onClick={() => {
                                dispatch(searchRunningActions.getBusinessJzsyModal(item,fromJS({jrJvUuid:item.get('jrJvUuid')}),() => {this.setState({
                                    jzsyModal:true
                                })}))
                        }}>结转
                    </Button>
                </div>)
            }
            if(auth == 1 || auth == 2) {
                elementList.push(
                    <div className='ylls-title-btn'>
                        <Button type='ghost' className='handle-btn' disabled={!editLrAccountPermission} onClick={() => {
                            dispatch(searchRunningActions.getBusinessDefineModal(item,fromJS({jrJvUuid:item.get('jrJvUuid')}),() => {this.setState({
                                defineModal:true
                            })}))
                        }}>认证
                        </Button>
                    </div>)
            }
            return (
                elementList
            )
        }
        let typeName
        if (item.get('writeOff') == 1) {
            typeName = '未核销'
        } else if (item.get('writeOff') == 2) {
            typeName = '部分核销'
        } else {
            typeName = '全部核销'
        }
        return(
            <div
                className='ylls-journ-item'
                key={item.get('oriUuid')}
                style={{display:i === jrFlowList.size -1 ?'none':'',borderBottom:i === jrFlowList.size -2?'none':''}}
            >
                <div className='ylls-journ-item-title' >
                    <span className='ylls-journ-categroy'>
                        {`${item.get('oriAbstract')}${item.get('jrJvCardAbstract')}`}
                    </span>
                    <span className='ylls-journ-btn'>
                        {isCurrentRunning?getCarrayOver(item):''}
                    </span>
                </div>
                <div className='ylls-journ-split'>
                    <span>{item.get('jrJvTypeName')}</span>
                    <span><b>{item.get('debitAmount') !== null ? formatMoney(item.get('debitAmount')):''}</b></span>
                    <span><b>{item.get('creditAmount') !== null ? formatMoney(item.get('creditAmount')):''}</b></span>
                    {
                        item.get('childList').size?
                        <span
                            style={{color:'#5e81d1',cursor:'pointer',textAlign:'right',paddingRight:0}}
                            onClick={()=> {this.setState({show:!show})}}
                        >
                            详情
                            {
                                show?
                                <Icon type='up' style={{paddingLeft:'3px'}}/>
                                :
                                <Icon type='down' style={{paddingLeft:'3px'}}/>
                            }
                        </span>:<span></span>
                    }
                </div>
                {
                    show && item.get('childList').size?
                        <div className='ylls-journ-detail' style={{marginBottom:i === jrFlowList.size -2?'15px':''}}>
                        <div>
                            <span>
                                核销情况：{typeName}
                            </span>
                            <span >
                                待核销余额
                            </span>
                        </div>
                        {
                            item.get('childList').map((v,index) =>
                            <Tooltip title={v.get('oriAbstract')} placement='left'>
                                <div
                                    className='ylls-journ-detail-item'
                                    key={v.get('oriUuid')}
                                    style={{display:index === item.get('childList').size -1 ?'none':''}}
                                >
                                        <span>{v.get('oriDate')}</span>
                                        <span
                                            style={isCurrentRunning?{textDecoration: 'underline',cursor: 'pointer'}:{}}
                                            onClick={() => {
                                                if (isCurrentRunning && v.get('jrIndex')) {
                                                    dispatch(previewRunningActions.getPreviewRelatedRunningBusinessFetch(v.get('oriUuid'),item.get('childList').filter((v,i) => i!==item.get('childList').size -1) , () => showRelatedRunning()))
                                                }
                                            }}
                                            >{v.get('jrIndex')?`${v.get('jrIndex')}号`:'期初余额'}</span>

                                    {
                                        item.get('jrIndex') === v.get('jrIndex') && item.get('oriDate') === v.get('oriDate') ?
                                        <span><b>{v.get('debitAmount') !== null ? formatMoney(v.get('debitAmount')):''} </b></span>
                                        :
                                        <span>{v.get('debitAmount') !== null ? formatMoney(v.get('debitAmount')):''} </span>
                                    }
                                    {
                                        item.get('jrIndex') === v.get('jrIndex') && item.get('oriDate') === v.get('oriDate')?
                                        <span><b>{v.get('creditAmount') !== null ? formatMoney(v.get('creditAmount')):''} </b></span>
                                        :
                                        <span>{v.get('creditAmount') !== null ? formatMoney(v.get('creditAmount')):''} </span>
                                    }
                                    {
                                        item.get('jrIndex') === v.get('jrIndex') && item.get('oriDate') === v.get('oriDate')?
                                        <span><b>{formatMoney(v.get('balanceAmount'))}</b></span>
                                        :
                                        <span>{formatMoney(v.get('balanceAmount'))}</span>
                                    }
                                </div>
                            </Tooltip>
                        )}
                        <div className='ylls-journ-detail-item'>
                            <span></span>
                            <span style={{textDecoration: 'none',cursor: 'auto'}}>合计</span>
                            <span>{total.get('debitAmount') !== null ? formatMoney(total.get('debitAmount')) : ''}</span>
                            <span>{total.get('creditAmount') !== null ? formatMoney(total.get('creditAmount')) : ''}</span>
                            <span>{formatMoney(total.get('balanceAmount'))}</span>
                        </div>
                    </div>:''
                }
                <SearchModal
                    id={'modal_9'}
                    visible={manageModal}
                    onCancel={() => {this.initModal('manageModal')}}
                    className='single-manager'
                    title={`${magenerType === 'debit'?'收款':'付款'}核销`}
                    okText='保存'
                    dispatch={dispatch}
                    lrPermissionInfo={lrPermissionInfo}
                    enclosureList={enclosureList}
                    label={label}
                    enCanUse={enCanUse}
                    uploadKeyJson={uploadKeyJson}
                    checkMoreFj={checkMoreFj}
                    reviewedBy={reviewedBy}
                    closedBy={closedBy}
                    onOk={() => {
                    dispatch(searchRunningActions.insertRunningManagerModal(()=>{

                        // TODO

                        this.setState({'manageModal':false})
                        dispatch(previewRunningActions.getPreviewNextRunningBusinessFetch(item))
                    },categoryTypeObj))
                    }}
                    >
                        <div className='manager-content'>
                            {
                                contactsCardRange?
                                <div><label>往来单位：</label>{`${contactsCardRange && contactsCardRange.get('code')} ${contactsCardRange && contactsCardRange.get('name')}`}</div>
                                :''
                            }
                            <div className='manager-item'><label>日期：</label>
                            <DatePicker
                                allowClear={false}
                                disabledDate={(current) => {
                                    return moment(modalTemp.getIn(['pendingManageDto','pendingManageList',0,'oriDate'])) > current
                                }}
                                value={modalTemp.get('oriDate')?moment(modalTemp.get('oriDate')):''}
                                onChange={value => {
                                    const date = value.format('YYYY-MM-DD')
                                    dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriDate'], date))
                                }}
                            />
                            </div>
                            <div className='manager-item'>
                                <label>摘要：</label>
                                <Input
                                    onFocus={(e) => e.target.select()}
                                    value={modalTemp.get('oriAbstract')}
                                    onChange={(e) => {
                                        dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriAbstract'], e.target.value))
                                    }}
                                />
                            </div>
                            <div className='manager-item'>
                                <label>{`${magenerType === 'debit'?'收款':'付款'}金额：`}</label>
                                <NumberInput
                                    value={modalTemp.get('amount')}
                                    onChange={(e) => {
                                        numberTest(e,(value) => {
                                            dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'amount'], value))

                                        })
                                    }}
                                />
                            </div>
                            <Account
                                modalTemp={modalTemp}
                                dispatch={dispatch}
                                accountList={accountList}
                            />
                            {
                                magenerType === 'debit'?
                                <AccountPoundage
                                    dispatch={dispatch}
                                    accountPoundage={accountPoundage}
                                    modalTemp={modalTemp}
                                    flags={flags}
                                />:''
                            }
                        </div>
                </SearchModal>

                <SearchModal
                    id={'modal_10'}
                    visible={grantModal}
                    onCancel={() => {this.initModal('grantModal')}}
                    className='single-manager'
                    title={magenerType === 'debit'?'收款核销':'付款核销'}
                    okText='保存'
                    dispatch={dispatch}
                    lrPermissionInfo={lrPermissionInfo}
                    enclosureList={enclosureList}
                    label={label}
                    enCanUse={enCanUse}
                    uploadKeyJson={uploadKeyJson}
                    checkMoreFj={checkMoreFj}
                    reviewedBy={reviewedBy}
                    closedBy={closedBy}
                    onOk={() => {
                        dispatch(searchRunningActions.insertCommonModal(()=>{
                            this.setState({'grantModal':false})
                            dispatch(previewRunningActions.getPreviewNextRunningBusinessFetch(item))
                        },categoryTypeObj,'','insertJrPayment'))
                    }}
                    >
                        <div className='manager-content'>
                        {
                            contactsCardRange?
                            <div><label>往来单位：</label>{`${contactsCardRange && contactsCardRange.get('code')} ${contactsCardRange && contactsCardRange.get('name')}`}</div>
                            :''
                        }
                        <div className='manager-item'><label>日期：</label>
                        <DatePicker
                            allowClear={false}
                            disabledDate={(current) => {
                                return moment(modalTemp.getIn(['pendingManageDto','pendingManageList',0,'oriDate']) || oriDate) > current
                            }}
                            value={modalTemp.get('oriDate')?moment(modalTemp.get('oriDate')):''}
                            onChange={value => {
                            const date = value.format('YYYY-MM-DD')
                                dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriDate'], date))
                            }}
                        />
                        </div>
                        <div className='manager-item'>
                            <label>摘要：</label>
                            <Input
                                onFocus={(e) => e.target.select()}
                                value={modalTemp.get('oriAbstract')}
                                onChange={(e) => {
                                    dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriAbstract'], e.target.value))
                                }}
                            />
                        </div>
                        <div className='manager-item'>
                            <label>{magenerType === 'debit'?'收款金额：':'付款金额：'}</label>
                            <NumberInput
                                value={modalTemp.get('amount')}
                                onChange={(e) => {
                                    numberTest(e,(value) => {
                                        dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'amount'], value))
                                        dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'payment','actualAmount'], value))

                                    })
                                }}
                            />
                        </div>
                        <Account
                            modalTemp={modalTemp}
                            dispatch={dispatch}
                            accountList={accountList}
                        />
                        {
                            magenerType === 'debit'?
                            <AccountPoundage
                                dispatch={dispatch}
                                accountPoundage={accountPoundage}
                                modalTemp={modalTemp}
                                flags={flags}
                            />:''
                        }
                    </div>
                </SearchModal>

                <SearchModal
                    id={'modal_11'}
                    visible={defrayModal}
                    onCancel={() => {this.initModal('defrayModal')}}
                    className='single-manager'
                    title={magenerType === 'debit'?'收款核销':'付款核销'}
                    okText='保存'
                    dispatch={dispatch}
                    lrPermissionInfo={lrPermissionInfo}
                    enclosureList={enclosureList}
                    label={label}
                    enCanUse={enCanUse}
                    uploadKeyJson={uploadKeyJson}
                    checkMoreFj={checkMoreFj}
                    reviewedBy={reviewedBy}
                    closedBy={closedBy}
                    onOk={() => {
                        dispatch(searchRunningActions.insertCommonModal(()=>{
                            this.setState({'defrayModal':false})
                            dispatch(previewRunningActions.getPreviewNextRunningBusinessFetch(item))
                        },categoryTypeObj,'',categoryTypeObj === 'acTax'?'insertJrTax':'insertJrPayment'))
                    }}
                    >
                        <div className='manager-content'>
                        {
                            contactsCardRange?
                            <div><label>往来单位：</label>{`${contactsCardRange && contactsCardRange.get('code')} ${contactsCardRange && contactsCardRange.get('name')}`}</div>
                            :''
                        }
                        <div className='manager-item'><label>日期：</label>
                        <DatePicker
                            allowClear={false}
                            disabledDate={(current) => {
                                return moment(modalTemp.getIn(['pendingManageDto','pendingManageList',0,'oriDate']) || oriDate) > current
                            }}
                            value={modalTemp.get('oriDate')?moment(modalTemp.get('oriDate')):''}
                            onChange={value => {
                            const date = value.format('YYYY-MM-DD')
                                dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriDate'], date))
                            }}
                        />
                        </div>
                        <div className='manager-item'>
                            <label>摘要：</label>
                            <Input
                                onFocus={(e) => e.target.select()}
                                value={modalTemp.get('oriAbstract')}
                                onChange={(e) => {
                                    dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriAbstract'], e.target.value))
                                }}
                            />
                        </div>
                        <div className='manager-item'>
                            <label>{magenerType === 'debit'?'收款金额：':'付款金额：'}</label>
                            <NumberInput
                                value={categoryTypeObj === 'acTax'?modalTemp.get('amount'):modalTemp.getIn(['payment','actualAmount'])}
                                onChange={(e) => {
                                    numberTest(e,(value) => {
                                        dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'payment','actualAmount'], value))
                                        categoryTypeObj === 'acTax'?
                                        dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp','amount'], value))
                                        :
                                        propertyPay === 'SX_ZFGJJ'?
                                        dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'payment','companyAccumulationAmount'], value))
                                        :dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'payment','companySocialSecurityAmount'], value))

                                        })
                                }}
                            />
                        </div>
                        <Account
                            modalTemp={modalTemp}
                            dispatch={dispatch}
                            accountList={accountList}
                            amount={
								{
									'SX_SHBX':companySocialSecurityAmount,
									'SX_ZFGJJ':companyAccumulationAmount
								}[[propertyPay]]
							}
                        />
                        {
                            magenerType === 'debit'?
                            <AccountPoundage
                                dispatch={dispatch}
                                accountPoundage={accountPoundage}
                                modalTemp={modalTemp}
                                flags={flags}
                            />:''
                        }
                    </div>
                </SearchModal>

                <SearchModal
                    id={'modal_12'}
                    visible={takeBackModal}
                    onCancel={() => {this.initModal('takeBackModal')}}
                    className='single-manager'
                    title={`收款核销`}
                    okText='保存'
                    dispatch={dispatch}
                    lrPermissionInfo={lrPermissionInfo}
                    enclosureList={enclosureList}
                    label={label}
                    enCanUse={enCanUse}
                    uploadKeyJson={uploadKeyJson}
                    checkMoreFj={checkMoreFj}
                    reviewedBy={reviewedBy}
                    closedBy={closedBy}
                    onOk={() => {
                         dispatch(searchRunningActions.insertCommonModal(()=>{
                             this.setState({'takeBackModal':false})
                             dispatch(previewRunningActions.getPreviewNextRunningBusinessFetch(item))
                         },categoryTypeObj,'','insertJrTemporaryReceipt'))
                    }}
                    >
                        <div className='manager-content'>
                        {
                            contactsCardRange?
                            <div><label>往来单位：</label>{`${contactsCardRange && contactsCardRange.get('code')} ${contactsCardRange && contactsCardRange.get('name')}`}</div>
                            :''
                        }
                        <div className='manager-item'><label>日期：</label>
                        <DatePicker
                            allowClear={false}
                            disabledDate={(current) => {
                                return moment(modalTemp.getIn(['pendingManageDto','pendingManageList',0,'oriDate']) || oriDate) > current
                            }}
                            value={modalTemp.get('oriDate')?moment(modalTemp.get('oriDate')):''}
                            onChange={value => {
                            const date = value.format('YYYY-MM-DD')
                                dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriDate'], date))
                            }}
                        />
                        </div>
                        <div className='manager-item'>
                            <label>摘要：</label>
                            <Input
                                onFocus={(e) => e.target.select()}
                                value={modalTemp.get('oriAbstract')}
                                onChange={(e) => {
                                    dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriAbstract'], e.target.value))
                                }}
                            />
                        </div>
                        <div className='manager-item'>
                            <label>{`收款金额：`}</label>
                            <NumberInput
                                value={modalTemp.get('amount')}
                                onChange={(e) => {
                                    numberTest(e,(value) => {
                                        dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'amount'], value))

                                    })
                                }}
                            />
                        </div>
                        <div className='manager-item'>
                            <label>账户：</label>
                            <Select
                                // combobox
                                value={modalTemp.getIn(['accounts',0,'accountName'])}
                                onChange={value => {
                                    const accountUuid = value.split(Limit.TREE_JOIN_STR)[0]
                                    const accountName = value.split(Limit.TREE_JOIN_STR)[1]
                                    dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'accounts'], fromJS([{accountName,accountUuid}])))
                                }}
                                >
                                {accountList && accountList.getIn([0, 'childList'])&& accountList.getIn([0, 'childList']).map((v, i) => <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{v.get('name')}</Option>)}
                            </Select>
                        </div>
                    </div>
                </SearchModal>

                <SearchModal
                    id={'modal_13'}
                    visible={backModal}
                    onCancel={() => {this.initModal('backModal')}}
                    className='single-manager'
                    title={`付款核销`}
                    okText='保存'
                    dispatch={dispatch}
                    lrPermissionInfo={lrPermissionInfo}
                    enclosureList={enclosureList}
                    label={label}
                    enCanUse={enCanUse}
                    uploadKeyJson={uploadKeyJson}
                    checkMoreFj={checkMoreFj}
                    reviewedBy={reviewedBy}
                    closedBy={closedBy}
                    onOk={() => {
                        dispatch(searchRunningActions.insertCommonModal(()=>{
                            this.setState({'backModal':false})
                            dispatch(previewRunningActions.getPreviewNextRunningBusinessFetch(item))
                        },categoryTypeObj,'','insertJrTemporaryPay'))
                    }}
                    >
                        <div className='manager-content'>
                        {
                            contactsCardRange?
                            <div><label>往来单位：</label>{`${contactsCardRange && contactsCardRange.get('code')} ${contactsCardRange && contactsCardRange.get('name')}`}</div>
                            :''
                        }
                        <div className='manager-item'><label>日期：</label>
                        <DatePicker
                            allowClear={false}
                            disabledDate={(current) => {
                                return moment(modalTemp.getIn(['pendingManageDto','pendingManageList',0,'oriDate'])) > current
                            }}
                            value={modalTemp.get('oriDate')?moment(modalTemp.get('oriDate')):''}
                            onChange={value => {
                            const date = value.format('YYYY-MM-DD')
                                dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriDate'], date))
                            }}
                        />
                        </div>
                        <div className='manager-item'>
                            <label>摘要：</label>
                            <Input
                                onFocus={(e) => e.target.select()}
                                value={modalTemp.get('oriAbstract')}
                                onChange={(e) => {
                                    dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriAbstract'], e.target.value))
                                }}
                            />
                        </div>
                        <div className='manager-item'>
                            <label>{`付款金额：`}</label>
                            <NumberInput
                                value={modalTemp.get('amount')}
                                onChange={(e) => {
                                    numberTest(e,(value) => {
                                        dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'amount'], value))

                                    })
                                }}
                            />
                        </div>
                        <div className='manager-item'>
                            <label>账户：</label>
                            <Select
                                // combobox
                                value={modalTemp.getIn(['accounts',0,'accountName'])}
                                onChange={value => {
                                    const accountUuid = value.split(Limit.TREE_JOIN_STR)[0]
                                    const accountName = value.split(Limit.TREE_JOIN_STR)[1]
                                    dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'accounts'], fromJS([{accountName,accountUuid}])))
                                }}
                                >
                                {accountList && accountList.getIn([0, 'childList'])&& accountList.getIn([0, 'childList']).map((v, i) => <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>{v.get('name')}</Option>)}
                            </Select>
                        </div>
                    </div>
                </SearchModal>


                <SearchModal
                    id={'modal_14'}
                    visible={jzsyModal}
                    onCancel={() => {this.initModal('jzsyModal')}}
                    className='single-manager'
                    title='处置损益'
                    okText='保存'
                    dispatch={dispatch}
                    lrPermissionInfo={lrPermissionInfo}
                    enclosureList={enclosureList}
                    label={label}
                    enCanUse={enCanUse}
                    uploadKeyJson={uploadKeyJson}
                    checkMoreFj={checkMoreFj}
                    reviewedBy={reviewedBy}
                    closedBy={closedBy}
                    onOk={() => {
                    dispatch(searchRunningActions.insertlrAccountJzsyModal(()=>{
                        this.setState({'jzsyModal':false})
                        dispatch(previewRunningActions.getPreviewNextRunningBusinessFetch(item))
                    }))
                    }}
                >
                    <div className='manager-content'>
                        <div className='manager-item'><label>日期：</label>
                        <DatePicker
                            allowClear={false}
                            disabledDate={(current) => {
                                return moment(modalTemp.getIn(['pendingStrongList',0,'oriDate'])) > current
                            }}
                            value={modalTemp.get('oriDate')?moment(modalTemp.get('oriDate')):''}
                            onChange={value => {
                                const date = value.format('YYYY-MM-DD')
                                dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriDate'], date))
                            }}
                        />
                        {
                            runningFlowTemp.get('beProject')?
                            <Switch
                                className="use-unuse-style"
                                style={{marginLeft:'10px'}}
                                checked={modalTemp.get('usedProject')}
                                checkedChildren={'项目'}
                                onChange={() => {
                                    dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'usedProject'], !modalTemp.get('usedProject')))
                            }}
                            />:''
                        }
                        </div>
                        <div className='manager-item'>
                        <label>摘要：</label>
                        <Input
                            onFocus={(e) => e.target.select()}
                            value={modalTemp.get('oriAbstract')}
                            onChange={(e) => {
                                dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriAbstract'], e.target.value))
                            }}
                        />
                        </div>
                        <div className='manager-item'>
                        <label>{modalTemp.get('netProfitAmount')>0?'净收益金额：':'净损失金额：'}</label>
                            {modalTemp.get('netProfitAmount')>0?modalTemp.get('netProfitAmount'):modalTemp.get('lossAmount')}
                        </div>
                        {
                            modalTemp.get('usedProject')?
                            <div className="manager-item" >
                                <label>项目：</label>
                                <Select
                                    combobox
                                    showSearch
                                    value={`${modalTemp.getIn(['projectCardList',0,'code']) || ''} ${modalTemp.getIn(['projectCardList',0,'name']) || ''}`}
                                    onChange={value => {
                                        const valueList = value.split(Limit.TREE_JOIN_STR)
                                        const cardUuid = valueList[0]
                                        const code = valueList[1]
                                        const name = valueList[2]
                                        dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'projectCardList'], fromJS([{cardUuid,code,name}])))
                                    }}
                                >
                                {projectList.map((v, i) =>
                                    <Option key={i} value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`}>
                                        {`${v.get('code')} ${v.get('name')}`}
                                    </Option>
                                )}
                                </Select>
                            </div>:''
                            }
                        <div className='manager-item'>
                        <label>资产原值：</label>
                        <NumberInput
                            value={modalTemp.getIn(['assets','originalAssetsAmount'])}
                            onChange={(e) => {
                                numberTest(e,(value) => {
                                    dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'assets','originalAssetsAmount'], value))
                                dispatch(searchRunningActions.calculateGainForJzsy())

                        })
                        }}
                        />
                        </div>
                        <div className='manager-item'>
                        <label>累计折旧摊销：</label>
                        <NumberInput
                            value={modalTemp.getIn(['assets','depreciationAmount'])}
                            onChange={(e) => {
                                numberTest(e,(value) => {
                                    dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'assets','depreciationAmount'], value))
                                    dispatch(searchRunningActions.calculateGainForJzsy())
                                })
                            }}
                        />
                        </div>
                        <div className='manager-item'>
                            <label>处置金额：</label>
                            {formatMoney(modalTemp.getIn(['pendingStrongList',0,'amount']))}
                        </div>
                    </div>

                </SearchModal>
                <SearchModal
                    id={'modal_15'}
                    visible={invioceModal}
                    onCancel={() => {this.initModal('invioceModal')}}
                    className='single-manager'
                    title='开具发票'
                    okText='保存'
                    dispatch={dispatch}
                    lrPermissionInfo={lrPermissionInfo}
                    enclosureList={enclosureList}
                    label={label}
                    enCanUse={enCanUse}
                    uploadKeyJson={uploadKeyJson}
                    checkMoreFj={checkMoreFj}
                    reviewedBy={reviewedBy}
                    closedBy={closedBy}
                    onOk={() => {
                        dispatch(searchRunningActions.insertRunningInvioceModal(()=>{
                            this.setState({'invioceModal':false})
                            dispatch(previewRunningActions.getPreviewNextRunningBusinessFetch(item))
                        }))
                    }}
                    >
                        <div className='manager-content'>
                            <div className='manager-item'><label>日期：</label>
                    <DatePicker
                        allowClear={false}
                        value={modalTemp.get('oriDate')?moment(modalTemp.get('oriDate')):''}
                        disabledDate={(current) => {
                            return moment(modalTemp.getIn(['pendingStrongList',0,'oriDate'])) > current
                        }}
                        onChange={value => {
                            const date = value.format('YYYY-MM-DD')
                            dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriDate'], date))
                        }}
                    />
                    </div>
                    <div className='manager-item'>
                        <label>摘要：</label>
                        <Input
                            onFocus={(e) => e.target.select()}
                            value={modalTemp.get('oriAbstract')}
                            onChange={(e) => {
                                dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriAbstract'], e.target.value))
                            }}
                    />
                    </div>
                    <div className="manager-item">
                        <label>金额：</label>
                        <NumberInput value={modalTemp.get('amount') < 0 ? -modalTemp.get('amount') : modalTemp.get('amount')}
                            onChange={(e) =>{
                                numberTest(e,(value) => {
                                    if (value > modalTemp.getIn(['pendingStrongList',0,'taxAmount'])) {
                                        message.info('金额不能大于待开发票税额')
                                        dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'amount'], ''))
                                    } else {
                                        dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'amount'], value))
                                    }
                                })
                            }}
                        />
                    </div>
                </div>
                </SearchModal>
                <SearchModal
                    id={'modal_16'}
                    visible={defineModal}
                    onCancel={() => {this.initModal('defineModal')}}
                    className='single-manager'
                    title='发票认证'
                    okText='保存'
                    dispatch={dispatch}
                    lrPermissionInfo={lrPermissionInfo}
                    enclosureList={enclosureList}
                    label={label}
                    enCanUse={enCanUse}
                    uploadKeyJson={uploadKeyJson}
                    checkMoreFj={checkMoreFj}
                    reviewedBy={reviewedBy}
                    closedBy={closedBy}
                    onOk={() => {
                    dispatch(searchRunningActions.insertRunningInvioceDefineModal(()=>{
                        this.setState({'defineModal':false})
                        dispatch(previewRunningActions.getPreviewNextRunningBusinessFetch(item))
                    }))
                    }}
                >
                    <div className='manager-content'>
                        <div className='manager-item'><label>日期：</label>
                            <DatePicker
                                disabledDate={(current) => {
                                    return moment(modalTemp.getIn(['pendingStrongList',0,'oriDate'])) > current
                                }}
                                allowClear={false}
                                value={modalTemp.get('oriDate')?moment(modalTemp.get('oriDate')):''}
                                onChange={value => {
                                    const date = value.format('YYYY-MM-DD')
                                    dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriDate'], date))
                                }}
                            />
                            </div>
                            <div className='manager-item'>
                            <label>摘要：</label>
                            <Input
                                value={modalTemp.get('oriAbstract')}
                                onChange={(e) => {
                                    dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'oriAbstract'], e.target.value))
                            }}
                            />
                        </div>
                        <div className="manager-item">
                            <label>金额：</label>
                            <NumberInput value={modalTemp.get('amount') < 0 ? -modalTemp.get('amount') : modalTemp.get('amount')}
                                onChange={(e) =>{
                                    numberTest(e,(value) => {
                                        if (value > modalTemp.getIn(['pendingStrongList',0,'taxAmount'])) {
                                            message.info('金额不能大于待认证税额')
                                            dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'amount'], ''))
                                        } else {
                                            dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'amount'], value))
                                        }
                                    })
                                }}
                            />
                        </div>
                    </div>
                </SearchModal>
            </div>

        )
    }
}

class Account extends React.Component {
	render() {
		const { modalTemp, dispatch, accountList } = this.props
        const amount = this.props.amount || modalTemp.get('amount')
		return(
			<div className='manager-item'>
				<label>账户：</label>
				<Select
					// combobox
					value={modalTemp.getIn(['accounts',0,'accountName'])}
					onChange={(value,options) => {
						const accountUuid = value.split(Limit.TREE_JOIN_STR)[0]
						const accountName = value.split(Limit.TREE_JOIN_STR)[1]
                        const poundageObj = options.props.poundage
                        const poundage = poundageObj.get('poundage')
                        const poundageRate = poundageObj.get('poundageRate')
                        const sxAmount = Math.abs(amount || 0)*poundageRate/1000> poundage && poundage > 0
                            ? poundage
                            : Math.abs(amount || 0)*poundageRate/1000
                        dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'accounts',0,'poundageAmount'],sxAmount.toFixed(2)))
						dispatch(searchRunningActions.changeCxAccountCommonOutString(['modalTemp', 'accounts'], fromJS([{accountName,accountUuid,poundage:poundageObj}])))
					}}
					>
					{accountList && accountList.getIn([0, 'childList'])&& accountList.getIn([0, 'childList']).map((v, i) =>
						<Option
							key={i}
							value={`${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}`}
							poundage={fromJS({needPoundage:v.get('needPoundage'),poundage:v.get('poundage'),poundageRate:v.get('poundageRate')})}
						>
							{v.get('name')}
						</Option>)
					}
				</Select>
			</div>
		)
	}
}
