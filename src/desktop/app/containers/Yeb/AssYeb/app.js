import React from 'react'
import { connect } from 'react-redux'

import * as assKmyebActions from 'app/redux/Yeb/AssYeb/assYeb.action.js'
import * as allActions from 'app/redux/Home/All/all.action'
import * as homeActions from 'app/redux/Home/home.action.js'

import PageSwitch from 'app/containers/components/PageSwitch'
import { Select, Button, Checkbox, Input, Icon, TreeSelect, message } from 'antd'
import { changeAssYebDataToTree,judgePermission } from 'app/utils'
import { Export } from 'app/components'
import { ROOT } from 'app/constants/fetch.constant.js'
import Table from './Table.jsx'
import * as Limit from 'app/constants/Limit.js'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import { debounce } from 'app/utils'

import '../Kmyeb/style/index.less'
import './index.less'

@connect(state => state)
export default
class AssYeb extends React.Component {

    componentDidMount() {
        this.props.dispatch(assKmyebActions.getPeriodAndAssKmyebListFetch())
    }

    constructor() {
		super()
		this.state = { inputValue: '', isSearching: false}
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.allState != nextprops.allState || this.props.assYebState != nextprops.assYebState || this.state != nextstate || this.props.homeState != nextprops.homeState
	}

    render() {
        const {
            allState,
            assYebState,
            dispatch,
            homeState
        } = this.props
        const { inputValue, isSearching } = this.state
        const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])
        //辅助余额表
        const detailList = homeState.getIn(['data','userInfo','pageController','BALANCE_DETAIL','preDetailList','ASS_BALANCE_STATEMENT','detailList'])
        const assTags = allState.get('assTags')
		const issues = allState.get('issues')
        const firstyear = allState.getIn(['period', 'firstyear'])
        let assbalanceaclist = assYebState.get('assbalanceaclist')
        const issuedate = assYebState.get('issuedate')
        const kmyeAssCategory = assYebState.get('kmyeAssCategory')
        const kmyeAssAcId = assYebState.get('kmyeAssAcId')
        const acId = assYebState.get('acId')
        const assCategoryTwo = assYebState.get('assCategoryTwo')
        const assIdTwo = assYebState.get('assIdTwo')

        const currentPage = assYebState.get('currentPage')
        const pageCount = assYebState.get('pageCount')
        const isDouble = assYebState.get('isDouble')
        const doubleAss = assYebState.get('doubleAss')
        const condition = assYebState.get('condition')
        const filterZero = assYebState.get('filterZero')
        const doubleAssCategory = assYebState.get('doubleAssCategory')

        const endissuedate = assYebState.get('endissuedate')
        const chooseperiods = assYebState.get('chooseperiods')
        const idx = issues.findIndex(v => v === issuedate)
        const nextperiods = issues.slice(0, idx)

        const assTree = assYebState.get('assTree');
        const oldAssKmyebList = assbalanceaclist

        //导出
        let assNameTwo = assCategoryTwo=='全部' ? '' : assCategoryTwo.split(Limit.TREE_JOIN_STR)[1]
        let doubleAssCategorys = assCategoryTwo=='全部' ? '' : doubleAssCategory

        if (assNameTwo === '全部') {
            assNameTwo = ''
            doubleAssCategorys = ''
        }

        const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
        const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
        const isPlay = homeState.getIn(['views', 'isPlay'])

        return (
            <ContainerWrap type="yeb-ass" className="asskmyeb">
                <FlexTitle>
                    <div className="flex-title-left">
                        {isSpread || pageList.getIn(['Yeb','pageList']).size <= 1 ? '' :
                            <PageSwitch
                                pageItem={pageList.get('Yeb')}
                                onClick={(page, name, key) => {
                                    dispatch(homeActions.addPageTabPane('YebPanes', key, key, name))
                                    dispatch(homeActions.addHomeTabpane(page, key, name))
                                }}
                            />
                        }
                        <Select
                            className="title-date"
                            value={issuedate}
                            onChange={(value) => {
                                dispatch(assKmyebActions.getAssEveryKmyebListFetch(value, value, kmyeAssCategory))
                                this.setState({inputValue:''})
                            }}
                            >
                            {issues.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
                        </Select>
                        <span className="title-checkboxtext" onClick={() => {
                            if (chooseperiods && endissuedate !== issuedate) {
                                dispatch(assKmyebActions.getAssEveryKmyebListFetch(issuedate, issuedate, kmyeAssCategory))
    						}
    						dispatch(assKmyebActions.changeAssKmyeChooseMorePeriods())

                            }}>
                            <Checkbox className="title-checkbox" checked={chooseperiods}></Checkbox>
                            <span>至</span>
                        </span>
                        <Select
                            disabled={!chooseperiods}
                            className="title-date"
                            value={endissuedate === issuedate ? '' : endissuedate}
                            onChange={(value) => {
                                dispatch(assKmyebActions.getAssEveryKmyebListFetch(issuedate, value, kmyeAssCategory))
                                this.setState({inputValue:''})
                            }}
                            >
                            {nextperiods.map((data, i) => <Option key={i} value={data}>{data}</Option>)}
                        </Select>
                        <span className="asskmyebcategory-select">
    						<span className="asskmyebcategory-select-title">辅助类别：</span>
    						<span>
    							<Select
    								className="asskmyebcategory-select-item"
    								value={kmyeAssCategory}
    								onChange={(value) => {
                                        //dispatch(assKmyebActions.getAssEveryKmyebListFetch(issuedate, endissuedate, value, acId))
                                        dispatch(assKmyebActions.getAssEveryKmyebListFetch(issuedate, endissuedate, value))
                                    }}
                                    >
    								{assTags.map(v => <Option key={v} value={v}>{v}</Option>)}
    							</Select>
    						</span>
    					</span>
                        <span className="asskmyeb-serch">
                            <Icon className="asskmyeb-serch-icon" type="search"/>
                            <Input
                                placeholder="搜辅助核算项目"
                                className="asskmyeb-serch-input"
                                value={inputValue}
                                onChange={(e)=>{this.setState({inputValue:e.target.value})}}
                                onPressEnter={(e) => {
                                    if (!isSearching) {
                                        this.setState({isSearching: true})
                                        dispatch(assKmyebActions.getAssEveryKmyebListFetch(issuedate, endissuedate, kmyeAssCategory,inputValue, false, '', '1', true, () => {
                                            this.setState({isSearching: false})
                                        }))
                                    }
                                }}
                                >
                            </Input>
                        </span>
                        <span className="asskmyeb-ac-search-box">
                            <span className="asskmyebcategory-select-title">科目：</span>
    						<TreeSelect
                                className="asskmyeb-ac-search"
    							value={[kmyeAssAcId ? kmyeAssAcId : "全部"]}
    							dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
    							treeData={changeAssYebDataToTree(assTree.toJS())}
    							placeholder="全部"
    							onSelect={(info) => {
                                    let acid=info;
                                    let isCheck = false
    								if (acid){
                                        if(acid=='0000'){//全部
                                            acid=''
                                            dispatch(assKmyebActions.getAssKmyebListFetch(issuedate, endissuedate, kmyeAssCategory, acid))
                                        }else{
                                            //最后一个参数代表要检查科目是否关联两个辅助核算
                                            dispatch(assKmyebActions.getAssKmyebListFetch(issuedate, endissuedate, kmyeAssCategory, acid,'1',true))
                                        }
    								}
                                }}
                            />
                        </span>
                        {/* 科目关联双辅助核算时显示 */}
                        {
                            isDouble ?
                                <span className="asskmyeb-ac-double-serch-box">
                                    <span className="asskmyebcategory-select-title">{doubleAssCategory && doubleAssCategory.length > 3 ? doubleAssCategory.slice(0,2)+'...' : doubleAssCategory}:</span>
                                    <span>
                                        <Select
                                            className="asskmyebcategory-select-item"
                                            dropdownMatchSelectWidth={false}
                                            dropdownStyle={{maxHeight: 400, overflow: 'auto',width:'150px' }}
                                            value={assCategoryTwo.replace(Limit.TREE_JOIN_STR, ' ')}
                                            onChange={(value) => {
                                                dispatch(assKmyebActions.getAssKmyebDoubleListFetch(issuedate, endissuedate, kmyeAssCategory, acId, 1, value, doubleAssCategory))
                                            }}
                                            >
                                            {doubleAss.map(v => <Option key={v.get('assid')} value={v.get('assid')}>{`${v.get('assid')} ${v.get('assname')}`}</Option>)}
                                        </Select>
                                    </span>
                                </span> : ''
                        }
                    </div>
                    <div className="flex-title-right">
                        <span className="title-right title-dropdown">
                            <Export
                                exportDisable={!issuedate || isPlay}
                                isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
                                excelDownloadUrl={`${ROOT}/excel/export/assba?${URL_POSTFIX}&begin=${issuedate ? issuedate.substr(0,4)+ '' +issuedate.substr(6,2) : ''}&end=${endissuedate ? endissuedate.substr(0,4)+ '' +endissuedate.substr(6,2) : ''}&asscategory=${encodeURI(encodeURI(kmyeAssCategory))}&asscategoryTwo=${encodeURI(encodeURI(doubleAssCategorys))}&assNameTwo=${encodeURI(encodeURI(assNameTwo))}&assIdTwo=${assIdTwo}&acid=${acId ? acId : ''}&condition=${condition ? condition : ''}&filterZero=${filterZero ? filterZero : ''}`}
                                // ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'asskmyebexcelsend', {begin:issuedate.substr(0,4)+ '' +issuedate.substr(6,2), end:endissuedate.substr(0,4)+ '' +endissuedate.substr(6,2), asscategory:kmyeAssCategory,asscategoryTwo:doubleAssCategorys,assNameTwo:assNameTwo,assIdTwo:assIdTwo,acid:acId ? acId : ''}))}
                                ddExcelCallback={(value) => {
                                    if(!judgePermission(detailList.get('EXPORT_BALANCE_EXCEL')).disabled){
                                        dispatch(allActions.allExportReceiverlist(value, 'asskmyebexcelsend', {begin:issuedate.substr(0,4)+ '' +issuedate.substr(6,2), end:endissuedate.substr(0,4)+ '' +endissuedate.substr(6,2), asscategory:kmyeAssCategory,asscategoryTwo:doubleAssCategorys,assNameTwo:assNameTwo,assIdTwo:assIdTwo,acid:acId ? acId : ''}))
                                    }else{
                                        message.info('当前角色无该请求权限')
                                    }
                                }}
                                
                                PDFDownloadUrl={`${ROOT}/pdf/exportassba?${URL_POSTFIX}&begin=${issuedate ? issuedate.substr(0,4) + '' + issuedate.substr(6,2) : ''}&end=${endissuedate ? endissuedate.substr(0, 4) +''+ endissuedate.substr(6, 2): ''}&asscategory=${encodeURI(encodeURI(kmyeAssCategory))}&asscategoryTwo=${encodeURI(encodeURI(doubleAssCategorys))}&assNameTwo=${encodeURI(encodeURI(assNameTwo))}&assIdTwo=${assIdTwo}&acid=${acId ? acId : ''}&condition=${condition ? condition : ''}&filterZero=${filterZero ? filterZero : ''}`}
                                // ddPDFCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'pdfasswbaexport', {begin: issuedate.substr(0,4)+ '' +issuedate.substr(6,2), end: endissuedate.substr(0,4)+ '' +endissuedate.substr(6,2), asscategory: kmyeAssCategory,asscategoryTwo:doubleAssCategorys,assNameTwo:assNameTwo,assIdTwo:assIdTwo,acid:acId ? acId : ''}))}
                                ddPDFCallback={(value) => {
                                    if(!judgePermission(detailList.get('EXPORT_BALANCE_PDF')).disabled){
                                        dispatch(allActions.allExportReceiverlist(value, 'pdfasswbaexport', {begin: issuedate.substr(0,4)+ '' +issuedate.substr(6,2), end: endissuedate.substr(0,4)+ '' +endissuedate.substr(6,2), asscategory: kmyeAssCategory,asscategoryTwo:doubleAssCategorys,assNameTwo:assNameTwo,assIdTwo:assIdTwo,acid:acId ? acId : ''}))
                                    }else{
                                        message.info('当前角色无该请求权限')
                                    }
                                }}
                                
                                onErrorSendMsg={(type, valueFirst, valueSecond) => {
									dispatch(allActions.sendMessageToDeveloper({
										title: '导出发送钉钉文件异常',
										message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
										remark: '辅助余额表',
									}))
								}}
                                >
                            </Export>
                        </span>
                        <Button
                            className="title-right refresh-btn"
                            type="ghost"
                            onClick={() => debounce(() => {
                                dispatch(assKmyebActions.getPeriodAndAssKmyebListFetch(issuedate, endissuedate, kmyeAssCategory,condition,filterZero))
                                dispatch(allActions.freshYebPage('辅助余额表'))
                            })()}
                            >
                            刷新
                        </Button>
                    </div>
                </FlexTitle>
                <Table
                    dispatch={dispatch}
                    balanceaclist={assbalanceaclist}
                    chooseperiods={chooseperiods}
                    issuedate={issuedate}
                    endissuedate={endissuedate}
                    kmyeAssCategory={kmyeAssCategory}
                    currentPage={currentPage}
                    pageCount={pageCount}
                    paginationCallBack={(value) => {
                        if(isDouble){
                            dispatch(assKmyebActions.getAssKmyebDoubleListFetch(issuedate, endissuedate, kmyeAssCategory, acId, value, assIdTwo, doubleAssCategory))
                        }else{
                            dispatch(assKmyebActions.getAssKmyebListFetch(issuedate, endissuedate, kmyeAssCategory, acId, value))
                        }
                    }}
                    acId={acId}
                    oldAssKmyebList={oldAssKmyebList}
                    assIdTwo={assIdTwo}
                    doubleAssCategory={doubleAssCategory}
                    assNameTwo={assCategoryTwo}
                    assYebState={assYebState}
                    kmyeAssAcId={kmyeAssAcId}
                />
            </ContainerWrap>
        )
    }
}
