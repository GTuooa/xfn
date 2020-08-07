import React from 'react'
import { connect } from 'react-redux'

import * as Limit from 'app/constants/Limit.js'
import PageSwitch from 'app/containers/components/PageSwitch'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import { Select, Button, Checkbox, TreeSelect, message } from 'antd'
import { ROOT } from 'app/constants/fetch.constant.js'
import { judgePermission } from 'app/utils'
import Table from './Table.jsx'
import { Export } from 'app/components'
import './style/index.less'
import { changeAssYebDataToTree } from 'app/utils'
import { debounce } from 'app/utils'

import * as AmyebActions from 'app/redux/Yeb/AmountYeb/amountYeb.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'

@connect(state => state)
export default
class AmountYeb extends React.Component {

    componentDidMount() {
        this.props.dispatch(AmyebActions.initAmountKmyeb())
        this.props.dispatch(AmyebActions.getPeriodAndBalistFetch())
    }

	shouldComponentUpdate(nextprops) {
		return this.props.allState != nextprops.allState || this.props.AmyebState != nextprops.AmyebState || this.props.homeState != nextprops.homeState
	}

    render() {
        const {
            allState,
            AmyebState,
            dispatch,
            homeState,
            assYebState
        } = this.props

        const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])
        //数量余额表
        const detailList = homeState.getIn(['data','userInfo','pageController','BALANCE_DETAIL','preDetailList','NUMBER_BALANCE_STATEMENT','detailList'])
		const issues = allState.get('issues')
        const assTags = allState.get('assTags')
        const firstyear = allState.getIn(['period', 'firstyear'])
        const unitDecimalCount = allState.getIn(['systemInfo', 'unitDecimalCount'])
        const balanceaclist = AmyebState.get('balanceaclist')
        const kmBalanceaclist = AmyebState.get('kmBalanceaclist')
        const issuedate = AmyebState.get('issuedate')
        const endissuedate = AmyebState.get('endissuedate')
        const chooseperiods = AmyebState.get('chooseperiods')
        const assCategory = AmyebState.get('assCategory')
        const assTwoTree = AmyebState.get('assTwoTree')
        const assTwoCategory = AmyebState.get('assTwoCategory')
        const secondAssKey = AmyebState.get('secondAssKey')
        const assIdTwo = AmyebState.get('assIdTwo')
        const assSecondName = AmyebState.get('assSecondName')
        const acId = AmyebState.get('acId')
        const ackey = AmyebState.get('ackey')
        const acname = AmyebState.get('acname')
        const isShow = AmyebState.get('isShow')
        const beSupport = AmyebState.get('beSupport')
        // const assTree2 = AmyebState.get('assTree')
        // console.log(assTree2)
        const assTree = AmyebState.get('assTree')
        const amountYebChildShow = AmyebState.get('amountYebChildShow')
        const amountYebKmChildShow = AmyebState.get('amountYebKmChildShow')

        const idx = issues.findIndex(v => v === issuedate)
        const nextperiods = issues.slice(0, idx)

        const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
        const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
        const isPlay = homeState.getIn(['views', 'isPlay'])

        return (
            <ContainerWrap type="yeb-six" className="ammountyeb">
                <FlexTitle>
                    <div className="flex-title-left">
                        {isSpread || pageList.getIn(['Yeb','pageList']).size <= 1 ? '' :
                            <PageSwitch
                                pageItem={pageList.get('Yeb')}
                                onClick={(page, name, key) => {
                                    dispatch(homeActions.addPageTabPane('YebPanes',  key, key, name))
                                    dispatch(homeActions.addHomeTabpane(page, key, name))
                                }}
                            />
                        }
                        <Select
                            className="title-date"
                            value={issuedate}
                            onChange={(value) => {
                                dispatch(AmyebActions.getTypeList(beSupport,value,value,assCategory))
                                if (beSupport) {
                                    dispatch(AmyebActions.getAmountAssTwoTree(value,value))
                                    dispatch(AmyebActions.getAmountKmTree(value,value,assCategory))
                                    dispatch(AmyebActions.changeAmountYebString('secondAssKey',''))
                                    dispatch(AmyebActions.changeAmountYebString('assIdTwo',''))
                                }
                            }}
                            >
                            {issues.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
                        </Select>
                        <span className="title-checkboxtext" onClick={() => {
                            if (chooseperiods && endissuedate !== issuedate) {
                                if (beSupport) {
                                    if (secondAssKey) {
                                        dispatch(AmyebActions.getAmountAssTwoKmyueList(issuedate,issuedate,assCategory,assTwoCategory,acId,ackey,secondAssKey,assIdTwo))

                                    } else {
                                        dispatch(AmyebActions.getTypeList(true,issuedate,issuedate,assCategory))
                                    }
                                } else {
                                    dispatch(AmyebActions.getCountList(issuedate, issuedate))
                                }

                            }
                            dispatch(AmyebActions.changeKmyeChooseMorePeriods())
                        }}>
                            <Checkbox className="title-checkbox" checked={chooseperiods}></Checkbox>
                            <span>至</span>
                        </span>
                        <Select
                            disabled={!chooseperiods}
                            className="title-date"
                            value={!chooseperiods || endissuedate === issuedate ? '' : endissuedate}
                            onChange={(value) => {
                                if (beSupport && secondAssKey) {
                                    dispatch(AmyebActions.getAmountAssTwoKmyueList(issuedate,value,assCategory,assTwoCategory,acId,ackey,secondAssKey,assIdTwo))
                                } else {
                                    dispatch(AmyebActions.getTypeList(beSupport,issuedate,value,assCategory,acId))

                                }
                                if (beSupport) {
                                    dispatch(AmyebActions.getAmountAssTwoTree(issuedate,value,assCategory,acId,ackey))
                                    dispatch(AmyebActions.getAmountKmTree(issuedate,value,assCategory))
                                }
                            }}
                            >
                            {nextperiods.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
                        </Select>
                        <span>
                            <Checkbox
                                className="title-checkbox"
                                checked={beSupport}
                                onClick={() => {
                                    dispatch(AmyebActions.getTypeList(!beSupport,issuedate,endissuedate,assCategory))
                                    dispatch(AmyebActions.getAmountKmTree(issuedate,endissuedate,assCategory))
                                    dispatch(AmyebActions.getAmountAssTwoTree(issuedate,endissuedate,assCategory,acId,ackey))
                                    dispatch(AmyebActions.changeAmountYebString('assIdTwo',''))
                                    dispatch(AmyebActions.changeAmountYebString('secondAssKey',''))
                                    dispatch(AmyebActions.changeAmountYebString('ackey',''))
                                }}
                            />
                            <span style={{lineHeight:'28px'}}>按辅助类别查看{beSupport?':':''}</span>
                        </span>
                        {
                            beSupport?
                            <span className='amKmYeb-content'>
                                <span className="amountYeb-select">
                                    <span>
                                        <Select
                                            className="asskmyebcategory-select-item"
                                            value={assCategory}
                                            style={{width:'104px'}}
                                            onChange={(value) => {
                                                dispatch(AmyebActions.getTypeList(true,issuedate, endissuedate, value, ''))
                                                dispatch(AmyebActions.getAmountKmTree(issuedate,endissuedate,value))
                                                dispatch(AmyebActions.getAmountAssTwoTree(issuedate,endissuedate,value,'',ackey))
                                                dispatch(AmyebActions.changeAmountYebString('secondAssKey',''))
                                                dispatch(AmyebActions.changeAmountYebString('assIdTwo',''))

                                            }}
                                            >
                                                {assTags.map(v => <Option key={v} value={v}>{v}</Option>)}
                                            </Select>
                                        </span>
                                    </span>
                                <span className="amkmyebcategory-select">
                                    <span className="amkmyebcategory-select-title">科目：</span>
                                    <span>
                                        <Select
                                            style={{width:'120px'}}
                                            value={`${acId?`${acId} ${acname}`:'全部'}`}
                                            onSelect={value => {
                                                const valueList = value.split(Limit.TREE_JOIN_STR)
                                                const acId = valueList[0]
                                                const ackey = valueList[1]
                                                const acname = valueList[2]
                                                dispatch(AmyebActions.getTypeList(true,issuedate, endissuedate, assCategory, acId))
                                                dispatch(AmyebActions.getAmountAssTwoTree(issuedate,endissuedate,assCategory,acId,ackey))
                                                dispatch(AmyebActions.changeAmountYebString('ackey',ackey))
                                                dispatch(AmyebActions.changeAmountYebString('acname',acname))
                                                dispatch(AmyebActions.changeAmountYebString('secondAssKey',''))
                                                dispatch(AmyebActions.changeAmountYebString('assIdTwo',''))
                                            }}
                                        >

                                            {
                                                assTree.map(v => <Option key={v.get('acid')} value={`${v.get('acid')}${Limit.TREE_JOIN_STR}${v.get('ackey')}${Limit.TREE_JOIN_STR}${v.get('acname')}`}>
                                                    {`${v.get('acid')?v.get('acid'):''} ${v.get('acname')}`}
                                                </Option>)
                                            }
                                        </Select>
                                    </span>
                                </span>
                                {
                                    assTwoTree.size > 1 ?
                                        <span className="amkmyebcategory-select">
                                            <span className="amkmyebcategory-select-title">{assTwoCategory}：</span>
                                            <span>
                                                <Select
                                                    style={{width:'120px'}}
                                                    value={`${assIdTwo && assIdTwo !== 'undefined' ?`${assIdTwo} ${assSecondName}`:'全部'}`}
                                                    onSelect={value => {
                                                        const valueList = value.split(Limit.TREE_JOIN_STR)
                                                        const secondAssKey = valueList[0]
                                                        const assSecondName = valueList[1]
                                                        const assId = valueList[2]
                                                        dispatch(AmyebActions.getAmountAssTwoKmyueList(issuedate, endissuedate, assCategory,assTwoCategory, acId,ackey,secondAssKey,assIdTwo))
                                                        dispatch(AmyebActions.changeAmountYebString('secondAssKey',secondAssKey))
                                                        dispatch(AmyebActions.changeAmountYebString('assSecondName',assSecondName))
                                                        dispatch(AmyebActions.changeAmountYebString('assIdTwo',assId))
                                                    }}
                                                >

                                                    {
                                                        assTwoTree.map(v => <Option key={v.get('asskey')} value={`${v.get('asskey')}${Limit.TREE_JOIN_STR}${v.get('assname')}${Limit.TREE_JOIN_STR}${v.get('assId')}`}>
                                                            {`${v.get('assId')?v.get('assId'):''} ${v.get('assname')}`}
                                                        </Option>)
                                                    }
                                                </Select>
                                            </span>
                                        </span>:''

                                }

                            </span> :''
                        }
                    </div>
                    <div className="flex-title-right">
                        <div className="title-right title-dropdown">
                            <Export
                                isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
                                exportDisable={!issuedate || isPlay}

                                excelDownloadUrl={
                                    beSupport?
                                    `${ROOT}/excel/export/countBa/by/ass?${URL_POSTFIX}&beginYear=${issuedate.substr(0,4)}&beginMonth=${issuedate.substr(6,2)}&endYear=${endissuedate?endissuedate.substr(0,4):issuedate.substr(0,4)}&endMonth=${endissuedate?endissuedate.substr(6,2):issuedate.substr(6,2)}&assCategory=${assCategory}&assSecondCategory=${assTwoCategory}&secondAssKey=${secondAssKey}&acId=${acId}&acName=&queryBySingleAc=${acId?true:false}`
                                    :
                                    `${ROOT}/excel/export/countBa?${URL_POSTFIX}&beginYear=${issuedate.substr(0,4)}&beginMonth=${issuedate.substr(6,2)}&endYear=${endissuedate?endissuedate.substr(0,4):issuedate.substr(0,4)}&endMonth=${endissuedate?endissuedate.substr(6,2):issuedate.substr(6,2)}&assCategory=${assCategory}&assSecondCategory=${assTwoCategory}&secondAssKey=${secondAssKey}&acId=${acId}&acName=&queryBySingleAc=${acId?true:false}`
                                }
                                // ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, `${beSupport?'excelcountBaAss':'excelcountBa'}`, {beginYear: issuedate.substr(0,4), beginMonth:issuedate.substr(6,2), endYear:endissuedate?endissuedate.substr(0,4):issuedate.substr(0,4), endMonth: endissuedate?endissuedate.substr(6,2):issuedate.substr(6,2),assSecondCategory:assTwoCategory,assCategory,assTwoCategory,secondAssKey,acId,queryBySingleAc:acId?true:false}))}
                                ddExcelCallback={(value) => {
									if(!judgePermission(detailList.get('EXPORT_BALANCE_EXCEL')).disabled){
										dispatch(allActions.allExportReceiverlist(value, `${beSupport?'excelcountBaAss':'excelcountBa'}`, {beginYear: issuedate.substr(0,4), beginMonth:issuedate.substr(6,2), endYear:endissuedate?endissuedate.substr(0,4):issuedate.substr(0,4), endMonth: endissuedate?endissuedate.substr(6,2):issuedate.substr(6,2),assSecondCategory:assTwoCategory,assCategory,assTwoCategory,secondAssKey,acId,queryBySingleAc:acId?true:false}))
									}else{
										message.info('当前角色无该请求权限')
									}
                                }}

                                PDFDownloadUrl={
                                    beSupport?
                                    `${ROOT}/pdf/exportCountBa/by/ass?${URL_POSTFIX}&beginYear=${issuedate.substr(0,4)}&beginMonth=${issuedate.substr(6,2)}&endYear=${endissuedate?endissuedate.substr(0,4):issuedate.substr(0,4)}&endMonth=${endissuedate?endissuedate.substr(6,2):issuedate.substr(6,2)}&assCategory=${assCategory}&assSecondCategory=${assTwoCategory}&secondAssKey=${secondAssKey}&acId=${acId}&acName=&queryBySingleAc=${acId?true:false}`
                                    :
                                    `${ROOT}/pdf/exportCountBa?${URL_POSTFIX}&beginYear=${issuedate.substr(0,4)}&beginMonth=${issuedate.substr(6,2)}&endYear=${endissuedate?endissuedate.substr(0,4):issuedate.substr(0,4)}&endMonth=${endissuedate?endissuedate.substr(6,2):issuedate.substr(6,2)}&assCategory=${assCategory}&assSecondCategory=${assTwoCategory}&secondAssKey=${secondAssKey}&acId=${acId}&acName=&queryBySingleAc=${acId?true:false}`
                                }
                                // ddPDFCallback={(value) => dispatch(allActions.allExportReceiverlist(value, `${beSupport?'pdfcountBaAss':'pdfCountBa'}`, {beginYear: issuedate.substr(0,4), beginMonth:issuedate.substr(6,2), endYear:endissuedate?endissuedate.substr(0,4):issuedate.substr(0,4), endMonth: endissuedate?endissuedate.substr(6,2):issuedate.substr(6,2),assSecondCategory:assTwoCategory,assCategory,assTwoCategory,secondAssKey,acId,queryBySingleAc:acId?true:false}))}
                                ddPDFCallback={(value) => {
									if(!judgePermission(detailList.get('EXPORT_BALANCE_PDF')).disabled){
										dispatch(allActions.allExportReceiverlist(value, `${beSupport?'pdfcountBaAss':'pdfCountBa'}`, {beginYear: issuedate.substr(0,4), beginMonth:issuedate.substr(6,2), endYear:endissuedate?endissuedate.substr(0,4):issuedate.substr(0,4), endMonth: endissuedate?endissuedate.substr(6,2):issuedate.substr(6,2),assSecondCategory:assTwoCategory,assCategory,assTwoCategory,secondAssKey,acId,queryBySingleAc:acId?true:false}))
									}else{
										message.info('当前角色无该请求权限')
									}
                                }}

                                onErrorSendMsg={(type, valueFirst, valueSecond) => {
									dispatch(allActions.sendMessageToDeveloper({
										title: '导出发送钉钉文件异常',
										message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
										remark: '数量余额表',
									}))
								}}
                            />
                        </div>
                        <Button
                            className="title-right refresh-btn"
                            type="ghost"
                            onClick={() => debounce(() => {
                                if (beSupport) {
                                    dispatch(AmyebActions.getAmountAssTwoTree(issuedate,endissuedate,assCategory,acId,ackey))
                                    dispatch(AmyebActions.getAmountKmTree(issuedate,endissuedate,assCategory))


                                    if (beSupport && secondAssKey) {
                                        dispatch(AmyebActions.getAmountAssTwoKmyueList(issuedate,endissuedate,assCategory,assTwoCategory,acId,ackey,secondAssKey,assIdTwo))
                                    } else {
                                        dispatch(AmyebActions.getTypeList(beSupport,issuedate,endissuedate,assCategory,acId))
    
                                    }
                                } else {
                                    dispatch(AmyebActions.getPeriodAndBalistFetch(firstyear ? issuedate : 'NO_VALID_ISSUE_DATE', endissuedate))
                                    dispatch(allActions.freshYebPage('数量余额表'))
                                }
                            })()}
                            >
                            刷新
                        </Button>
                    </div>
                </FlexTitle>
                <Table
                    issuedate={issuedate}
                    dispatch={dispatch}
                    issues={issues}
                    balanceaclist={balanceaclist}
                    chooseperiods={chooseperiods}
                    endissuedate={endissuedate}
                    isShow={isShow}
                    amountYebChildShow={amountYebChildShow}
                    unitDecimalCount={unitDecimalCount}
                    kmBalanceaclist={kmBalanceaclist}
                    beSupport={beSupport}
                    amountYebKmChildShow={amountYebKmChildShow}
                    assCategory={assCategory}
                    assTwoCategory={assTwoCategory}
                    assIdTwo={assIdTwo}
                    assSecondName={assSecondName}
                    acId={acId}
                    acname={acname}
                />
            </ContainerWrap>
        )
    }
}
