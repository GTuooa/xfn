import React, { PropTypes } from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS, Map } from 'immutable'
import * as thirdParty from 'app/thirdParty'
import * as lsqcActions from 'app/redux/Config/Lsqc/lsqc.action.js'
import { TopMonthPicker } from 'app/containers/components'
import { ButtonGroup, Button, Container, Row, ScrollView, Amount, Icon, MonthPicker, SinglePicker } from 'app/components'
import * as Limit from 'app/constants/Limit.js'

import './Lsqc.less'
import Ba from './Ba'
import EditBa from './EditBa'

@connect(state => state)
export default
class Lsqc extends React.Component {

    componentDidMount() {
        thirdParty.setTitle({title: '期初值'})
        thirdParty.setIcon({ showIcon: false })
        thirdParty.setRight({ show: false })

        if (sessionStorage.getItem('prevPage') === 'home') {
			sessionStorage.removeItem('prevPage')
		}
        this.props.dispatch(lsqcActions.getBeginningList("true"))
        this.props.dispatch(lsqcActions.initBolck())
    }
    componentWillReceiveProps(nextprops) {
		if (nextprops.lsqcState.getIn(['flags','curModifyBtn']) !== this.props.lsqcState.getIn(['flags','curModifyBtn']) && nextprops.lsqcState.getIn(['flags','curModifyBtn']) === '') {
            nextprops.dispatch(lsqcActions.getBeginningList(false,true))
		}

	}

    render() {
        const {
            history,
            dispatch,
            allState,
            lsyebState,
            lsqcState,
            homeState
        } = this.props
        const showChild = true
        const balistSeq = lsqcState.get('QcList')
        const showContactsModal = lsqcState.get('showContactsModal')
        const curModifyBtn = lsqcState.getIn(['flags','curModifyBtn'])
		const isCheckOut = lsqcState.getIn(['flags','isCheckOut'])
		const issuedate = lsqcState.getIn(['flags','issuedate'])
		const issues = lsqcState.getIn(['flags','issues'])
		const isDefinite = lsqcState.getIn(['flags','isDefinite'])
		const enableWarehouse = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).includes('WAREHOUSE')
        let leftTotalNumber = 0,
        rightTotalNumber = 0

        const getNumber = (numberName) => {
            let totalNumber = 0
            balistSeq.map((v,i) =>{
                let itemName = i
                const loop = (data,level) => data.map((item,i) => {
                    if(item.childList && item.childList.length){
                        loop(item.childList,level+1)
                    }else{
                        if(itemName == 'Contacts' && level == 1){
                            totalNumber += 0
                        }else{
                            if(item.operate == "SUBTRACT"){
                                totalNumber -= parseFloat(item[numberName])
                            }else{
                                totalNumber += parseFloat(item[numberName])
                            }
                        }


                    }
                })
                    loop(v.getIn(['List','childList']).toJS(),1)
            })
            return totalNumber
        }

        leftTotalNumber = getNumber('debitBeginAmount')
        rightTotalNumber = getNumber('creditBeginAmount')
        // simplifyStatus true为专业版
        const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const simplifyStatus = moduleInfo ? (moduleInfo.indexOf('GL') > -1 ? true : false) : false
		const canUseInventory = moduleInfo ? (moduleInfo.indexOf('INVENTORY') > -1 ? true : false) : false
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
        const balanceShowChild = lsqcState.getIn(['flags','balanceShowChild'])
        const balanceEditShowChild = lsqcState.getIn(['flags','balanceEditShowChild'])
        const loop = (data,leve,isAdd=true) => data.map((item,i) => {
            const showChild = balanceShowChild.indexOf(item.get('uuid')) > -1
            const backgroundColor = '#fff'
                if (item.get('childList') && item.get('childList').size) {
                    return  <div key={item.get('uuid')}>
                        <Ba
                            leve={leve}
                            className="lsqc-border-bottom"
                            style={{backgroundColor}}
                            ba={item}
                            haveChild={true}
                            showChild={showChild}
                            history={history}
                            dispatch={dispatch}
                            balistSeq={balistSeq}
                            curModifyBtn={curModifyBtn}
                        />
                            {showChild ? loop(item.get('childList'), leve+1,false) : ''}
                    </div>
                } else {
                    return <div key={item.get('uuid')}>
                        <Ba
                            leve={leve}
                            className="lsqc-border-bottom"
                            ba={item}
                            style={{backgroundColor}}
                            history={history}
                            dispatch={dispatch}
                            balistSeq={balistSeq}
                            curModifyBtn={curModifyBtn}
                        />
                    </div>
                }



        })

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

        !canUseInventory && acListKeysArr.splice(acListKeysArr.findIndex(value => value === 'Stock'),1)

        const sortArr = ['Account','Salary','Tax','Contacts','Stock','Project','Others','LongTerm','CIB']

        const acListKeysArrSort = sortArr.filter(v => acListKeysArr.indexOf(v) > -1)

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
                {
                    // curModifyBtn == '' ?
                    <ScrollView flex="1" uniqueKey="ls-config-scroll" savePosition className="ac-list">
                        {acListKeysArrSort.map((item,i) => {
                            const showFirstChild = lsqcState.getIn(['firstChildToggle', `${item}Display`])
                            return <div className='ba-list' key={i}>
                                    <div className='ba lsqc-border-bottom' style={{backgroundColor: "#fff3e3"}}>
                                        <div className='ba-info'>
                                            <span
                                                className='name'
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    dispatch(lsqcActions.changeModifyBtn(item,false))
                                                    history.push('/config/lsqcedit')
                                                }}
                                                >
                                                    <span className='name-name'>{balistSeq.getIn([item,'List','name'])}</span>
                                                </span>
                                                <Amount showZero={false}>{getModuleNumber('debitBeginAmount',item)}</Amount>
                                                <Amount showZero={false}>{getModuleNumber('creditBeginAmount',item)}</Amount>
                                                <span className='btn' onClick={() => dispatch(lsqcActions.firstChildToggle(item))}>
                                                    {
                                                        balistSeq.getIn([item,'List','childList']) && balistSeq.getIn([item,'List','childList']).size ?
                                                        <Icon
                                                            type={showFirstChild == 'block' ? 'arrow-up' : 'arrow-down'}
                                                        /> : ''
                                                    }

                                                </span>
                                            </div>
                                    </div>
                                    <div  style={{display:showFirstChild}}>
                                        {loop(balistSeq.getIn([item,'List','childList']), 1)}
                                    </div>

                                </div>

                        })}

                        <div className='ba-list'>
                            <div className='ba lsqc-border-bottom' style={{backgroundColor: "#fff3e3"}}>
                                <div className='ba-info'>
                                    <span className='name-child'>
                                        <span className='name-name name-total'>资产总计</span>
                                    </span>
                                    <Amount showZero={false}>{leftTotalNumber}</Amount>
                                    <Amount showZero={false}></Amount>
                                    <span></span>
                                </div>
                                <div className='ba-info'>
                                    <span className='name-child'>
                                        <span className='name-name name-total'>负债和权益总计</span>
                                    </span>
                                    <Amount showZero={false}></Amount>
                                    <Amount showZero={false}>{rightTotalNumber}</Amount>
                                    <span></span>
                                </div>
                                <div className='ba-info'>
                                    <span className='name-child'>
                                        <span className='name-name name-total'>待处理财产损益</span>
                                    </span>
                                    <Amount showZero={false}>{leftTotalNumber < rightTotalNumber ? rightTotalNumber-leftTotalNumber : 0}</Amount>
                                    <Amount showZero={false}>{leftTotalNumber > rightTotalNumber ? leftTotalNumber-rightTotalNumber : 0}</Amount>
                                    <span></span>
                                </div>
                                <div className='ba-info'>
                                    <span className='name-child'>
                                        <span className='name-name name-total'>总金额</span>
                                    </span>
                                    <Amount showZero={false}>{leftTotalNumber > rightTotalNumber ? leftTotalNumber:rightTotalNumber}</Amount>
                                    <Amount showZero={false}>{leftTotalNumber > rightTotalNumber ? leftTotalNumber:rightTotalNumber}</Amount>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    </ScrollView>

                }

            </Container>
        )
    }
}
