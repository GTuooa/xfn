import React, { PropTypes } from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS, Map } from 'immutable'
import thirdParty from 'app/thirdParty'
import * as lsqcActions from 'app/redux/Config/Lsqc/lsqc.action.js'
import { TopMonthPicker } from 'app/containers/components'
import { ButtonGroup, Button, Container, Row, ScrollView, Amount, Icon, MonthPicker, SinglePicker } from 'app/components'
import * as Limit from 'app/constants/Limit.js'

import './Lsqc.less'
import Ba from './Ba'
import EditBa from './EditBa'


@connect(state => state)
export default
class Edit extends React.Component {
	componentDidMount() {
		thirdParty.setTitle({title: '编辑期初值'})
		thirdParty.setIcon({ showIcon: false })
		thirdParty.setRight({ show: false })
		if(this.props.lsqcState.getIn(['flags','isCheckOut'])){
			thirdParty.Alert('该账期已结账，反结账后即可修改期初值')
		}else{
			const enableWarehouse = this.props.homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).includes('WAREHOUSE')
			const curModifyBtn = this.props.lsqcState.getIn(['flags','curModifyBtn'])
			if(enableWarehouse && curModifyBtn === 'Stock'){
				thirdParty.Alert('账套开启仓库管理，请前往“存货设置”中填入期初值')
			}
		}


	}
	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.lsqcState != nextprops.lsqcState
	}
	render() {
		const {
			history,
            dispatch,
            allState,
            lsqcState,
            homeState

		} = this.props

		let showBtn = false

		const curModifyBtn = lsqcState.getIn(['flags','curModifyBtn'])
		const isCheckOut = lsqcState.getIn(['flags','isCheckOut'])
		const isDefinite = lsqcState.getIn(['flags','isDefinite'])
        const balistSeq = lsqcState.get('QcList')
		const issuedate = lsqcState.getIn(['flags','issuedate'])
		const issues = lsqcState.getIn(['flags','issues'])
		// simplifyStatus true为专业版
        const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const enableWarehouse = moduleInfo.includes('WAREHOUSE')
		const simplifyStatus = moduleInfo ? (moduleInfo.indexOf('GL') > -1 ? true : false) : false
        let acListKeysArr = []
		if(simplifyStatus){
			let simplifyStr = ['Account','LongTerm','Stock']
			balistSeq.forEach((v, key) => {
				if(!(simplifyStr.indexOf(key) > -1)){
					acListKeysArr.push(key)
				}
			})
		}else{
			balistSeq.forEach((v, key) => acListKeysArr.push(key))
		}
		const getModuleNumber = (numberName,item) => {
            let totalNumber = 0
            const loop = (data) => {
                data.map((item,i) => {
                    if(item.childList && item.childList.length>0){
                        loop(item.childList)
                    }else{
                        if(item.operate == "SUBTRACT"){
                            totalNumber -= parseFloat(item[numberName])
                        }else{
                            totalNumber += parseFloat(item[numberName])
                        }
                    }
                })
            }
            balistSeq.getIn([item,'List','childList']) && balistSeq.getIn([item,'List','childList']).size > 0 ? loop(balistSeq.getIn([item,'List','childList']).toJS()) : ''
            const number = balistSeq.getIn([item,'List','childList']) && balistSeq.getIn([item,'List','childList']).size > 0 ? totalNumber :
            // (listName == 'Contacts' && leve==1 ) ? 0 : item.get(numberName)
            balistSeq.getIn([item,'List',numberName])
            return number
        }

		const cantChooseList = lsqcState.get('cantChooseList')
		const changeQcList = lsqcState.get('changeQcList')
		const addItemProperty = lsqcState.getIn(['flags','property'])
		let cantLists = [],//已在新增列表
			deleteLists = []//已在删除列表
		let newCantChooseList = cantChooseList
		changeQcList.map(item => {
			if(item.get('operateType') === '1' && (item.get('property') == addItemProperty || item.get('property') == 'stock')){
				cantLists.push(item.get('uuid'))
			}
			if(item.get('operateType') === '2' && cantChooseList.indexOf(item.get('relationUuid')) > -1 ){
				deleteLists.push(item.get('relationUuid'))
			}
		})
		cantLists = fromJS(cantLists)
		deleteLists = fromJS(deleteLists)

        const MemberList = lsqcState.get('MemberList')
		const thingsList = lsqcState.get('thingsList')
		const curmemberList = curModifyBtn === 'Contacts' ? MemberList : thingsList
        const cardList = !isCheckOut ? curmemberList.filter(v => (!cantChooseList.includes(v.get('uuid')) || cantChooseList.includes(v.get('uuid')) && deleteLists.includes(v.get('uuid'))) &&  !cantLists.includes(v.get('uuid')))
                                    .map(v => {return {key: `${v.get('code')} ${v.get('name')}`, value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('code')}`}}) :
                                    curmemberList.filter(v => v.get('code') !== 'UDFNCRD' && v.get('code') !== 'IDFNCRD' &&  !cantLists.includes(v.get('uuid')))
                                                .map(v => {return {key: `${v.get('code')} ${v.get('name')}`, value: `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('name')}${Limit.TREE_JOIN_STR}${v.get('code')}`}})

        const balanceEditShowChild = lsqcState.getIn(['flags','balanceEditShowChild'])
		const loopEdit = (data,leve,isAdd=true) => data && data.map((item,i) => {
            const showChild = balanceEditShowChild.indexOf(item.get('uuid')) > -1
            const backgroundColor = '#fff'
                if (item.get('childList') && item.get('childList').size) {
                    return  <div key={item.get('uuid')}>
                        <EditBa
                            leve={leve}
                            className="lsqc-border-bottom"
                            style={{backgroundColor}}
                            ba={item}
                            haveChild={true}
                            showChild={showChild}
                            history={history}
                            dispatch={dispatch}
                            listName={curModifyBtn}
                            lsqcState={lsqcState}
                            isCheckOut={isCheckOut}
							enableWarehouse={enableWarehouse}
                        />
                            {showChild ? loopEdit(item.get('childList'), leve+1,false) : ''}
                    </div>
                } else {
                    return <div key={item.get('uuid')}>
                        <EditBa
                            leve={leve}
                            className="lsqc-border-bottom"
                            ba={item}
                            style={{backgroundColor}}
                            history={history}
                            dispatch={dispatch}
                            listName={curModifyBtn}
                            lsqcState={lsqcState}
                            isCheckOut={isCheckOut}
							enableWarehouse={enableWarehouse}
                        />
                    </div>
                }



        })
		const loopCanModify  = (data) => data && data.map((item,i) =>{
			if(!item.get('isDefinite') && isCheckOut){
				showBtn = true
			}

			if (item.get('childList') && item.get('childList').size) {
				loopCanModify(item.get('childList'))
			}
		})
		if(curModifyBtn === 'Stock' || curModifyBtn === 'Contacts'){
			loopCanModify(balistSeq.getIn([curModifyBtn,'List','childList']))
		}

		return (
			<Container className="lsqc">
				<div className="lsqc-choose-calendar">
                    <span className="lsqc-title-calendar">
                        <span className="">起始账期</span>
                    </span>
                    <SinglePicker
                        disabled={isCheckOut || !simplifyStatus}
                        className="lsqc-picker"
                        district={issues.toJS()}
                        value={issuedate}
                        onOk={(value)=>{
                            dispatch(lsqcActions.modifyPeriod(value))
                        }}
                    >
                        <span>
                            <span className="thirdparty-date-date">{issuedate}</span>
                        </span>
                    </SinglePicker>
                    <Icon className="icon lsqc-icon-calendar" type="calendar"/>
                </div>
				<Row className='ba-title'>
					<div className='ba-title-item'>项目</div>
					<div className='ba-title-item'>{simplifyStatus ? '借方' : '资产' }</div>
					<div className='ba-title-item'>{simplifyStatus ? '贷方' : '负债和权益' }</div>
                    <div className='ba-title-item'></div>
				</Row>
				<div className='ba-list'>
					<div className='ba lsqc-border-bottom' style={{backgroundColor: "#fff3e3"}}>
						<div className='ba-info'>
							<span className="name-edit">
								{
									// curModifyBtn == 'Stock' && !isCheckOut ?
									// <Icon
									// 	type="add"
									// 	className='acconfig-plus'
									// 	onClick={(e) => {
									// 		dispatch(lsqcActions.getDetailsListInfo(curModifyBtn,sessionStorage.getItem('psiSobId'),balistSeq.getIn([curModifyBtn,'List'])))
									// 	}}
									// /> : ''
								}
								<span className='name-name'>{balistSeq.getIn([curModifyBtn,'List','name'])}</span>
							</span>
							<Amount showZero={false}>{getModuleNumber('debitBeginAmount',curModifyBtn)}</Amount>
							<Amount showZero={false}>{getModuleNumber('creditBeginAmount',curModifyBtn)}</Amount>
								<span className='btn'>

								</span>
							</div>
					</div>
					</div>
				<ScrollView flex="1" uniqueKey="ls-config-scroll" savePosition className="ac-list">
					<div className='ba-list'>
						<div>
							{loopEdit(balistSeq.getIn([curModifyBtn,'List','childList']), 1)}
						</div>

					</div>
				</ScrollView>
				<ButtonGroup>
					<Button
						disabled={isCheckOut}
						onClick={() => {
							// dispatch(lsqcActions.restoreModification(curModifyBtn))
							// history.goBack()
							thirdParty.Confirm({
								message: `确定清空【${balistSeq.getIn([curModifyBtn,'List','name'])}】的期初值吗？`,
								title: "提示",
								buttonLabels: ['取消', '确定'],
								onSuccess : (result) => {
									if (result.buttonIndex === 1) {
										dispatch(lsqcActions.changeAllQcListInMoudle(curModifyBtn,history))
									}
								}
							})
						}}
					>
						<Icon type="clean"/>
						<span>清空</span>
					</Button>
					<Button
						disabled={(curModifyBtn !== 'Stock' && curModifyBtn !== 'Contacts' ? isCheckOut : isCheckOut && !showBtn) || (enableWarehouse && curModifyBtn === 'Stock')}
						onClick={() => {
							dispatch(lsqcActions.saveBeginningBalance(curModifyBtn,history))
						}}
					>
						<Icon type="new"/>
						<span>保存</span>
					</Button>
				</ButtonGroup>
			</Container>

		)
	}
}
