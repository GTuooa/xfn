import React, { PropTypes } from 'react'
import { Map, toJS, fromJS,size } from 'immutable'
import { connect } from 'react-redux'

import * as allActions from 'app/redux/Home/All/all.action'
import * as syxmbActions from 'app/redux/Report/Syxmb/syxmb.actions.js'
import * as homeActions from 'app/redux/Home/home.action.js'

import PageSwitch from 'app/containers/components/PageSwitch'
import * as thirdParty from 'app/thirdParty'
import { formatMoney } from 'app/utils'
import { Select, Modal, Button, Checkbox,TreeSelect } from 'antd'
import AmbBody from './AmbBody'
import ContainerWrap from 'app/components/Container/ContainerWrap'
import FlexTitle from 'app/components/Container/ContainerWrap/FlexTitle'
import * as Limit from 'app/constants/Limit.js'
import { Export } from 'app/components'
import { ROOT } from 'app/constants/fetch.constant.js'
import './style/style.less'
const { TreeNode } = TreeSelect;
import CardListTree from './CardListTree'
@connect(state => state)
export default
class Syxmb extends React.Component {

    componentDidMount() {
        this.props.dispatch(syxmbActions.getSYXMBCardList('','','true'))
    }

    // componentWillReceiveProps(props){
    //     const didMount = props.syxmbState.getIn(['view', 'didMount'])
    //     if(!didMount){
    //         this.props.dispatch(syxmbActions.changeCharDidmount(true))
    //         this.props.dispatch(syxmbActions.getPeriodAndSYXMIncomeStatementFetch())
    //      }
    //  }

    shouldComponentUpdate(nextprops) {
        return this.props.allState != nextprops.allState || this.props.syxmbState != nextprops.syxmbState || this.props.homeState != nextprops.homeState
    }

    render(){
        const {
            allState,
            dispatch,
            syxmbState,
			homeState
        } = this.props
        const reportPermissionInfo = homeState.getIn(['permissionInfo', 'Report'])
		// 日期
		const issues = allState.get('accountIssues')
		const issuedate = syxmbState.get('issuedate')
		const endissuedate = syxmbState.get('endissuedate')
		const idx = issues.findIndex(v => v === issuedate)
		const ambsybYear = issuedate.substr(0, 4)
        const ambsybMonth = issuedate.substr(6, 2)
        // const nextperiods = issues.slice(0, idx).filter(v => v.indexOf(ambsybYear) === 0)
        const periodStartMonth = allState.getIn(['period', 'periodStartMonth']) ? allState.getIn(['period', 'periodStartMonth']) : '01'
		// 利润表的选择日期 第二个日期选择框的时间范围  当前年度+1 当前月份-1
		// const nextperiods = issues.slice(0, idx).filter(v => v.indexOf(ambsybYear) === 0 || (v.indexOf(-(-ambsybYear-1)) === 0 && Number(v.substr(6, 2)) < Number(periodStartMonth)))
		const nextperiods = issues.slice(0, idx).filter(v => Number(ambsybMonth) < Number(periodStartMonth) ? v.indexOf(ambsybYear) === 0 && Number(v.substr(6, 2)) < Number(periodStartMonth) :  (v.indexOf(ambsybYear) === 0 || (v.indexOf(ambsybYear-1+2) === 0 && Number(v.substr(6, 2)) < Number(periodStartMonth))) )
        // 是否多账期选择
		const chooseperiods = syxmbState.getIn(['view', 'chooseperiods'])

		// 辅助核算项目选择
		// const assList = syxmbState.getIn(['assList', 0, 'asslist']) ? syxmbState.getIn(['assList', 0, 'asslist']) : fromJS([])
		// let assListJS = assList.toJS()
		// assListJS.unshift({assid: '', assname: '全部'})

		//
		const cardUuid = syxmbState.getIn(['view', 'cardUuid'])
        //  console.log(cardUuid);
        const cardList = syxmbState.get("cardList")
        //  let cardListJs = cardList.toJS()
        //cardListJs.unshift({cardUuid:'',cardName:'全部'})
		//const cardName = cardUuid ? cardList.find(v => v.get('uuid') === cardUuid).get('name')  : ''
		// const assCategory = ambsybState.getIn(['view', 'assCategory'])

		// 饼图
		const gainAndLoss = syxmbState.get('gainAndLoss')
		const income = gainAndLoss.get('income')
		const pay = gainAndLoss.get('pay')
		const ginAndLoss = gainAndLoss.get('ginAndLoss')
		const incomeBigger = income >= pay

		// 柱形图
		const detailDrawing = syxmbState.get('detailDrawing')

		// 折线图
		const trendMap = syxmbState.get('trendMap')
		// 表格
		const ambDetailTable = syxmbState.get('ambDetailTable')
        const allAssOrAc =syxmbState.getIn(['view', 'allAssOrAc'])

		// 是否得到数据
		const didMount = syxmbState.getIn(['view', 'didMount'])
		// 当前是全部时科目树的所指
		const currentAc = syxmbState.getIn(['view', 'currentAc'])
		// 可展示下级的科目
		const tableShowChild = syxmbState.getIn(['view', 'tableShowChild'])

		const pageList = homeState.get('pageList')
        const isSpread = homeState.getIn(['views', 'isSpread'])
		const URL_POSTFIX = homeState.getIn(['views', 'URL_POSTFIX'])
		const isPlay = homeState.getIn(['views', 'isPlay'])
        const showCheck = syxmbState.getIn(['view', 'showCheck'])
        const needCategory = syxmbState.getIn(['view', 'needCategory'])
        const beCategory  =syxmbState.getIn(['view', 'beCategory'])
        const cardName = syxmbState.getIn(['view', 'cardName'])
        const unit =syxmbState.getIn(['view', 'unit'])
        const classNameList = ["title-date", "lrb-title-date"]
        const loop=(cardList)=>cardList.map((e,i)=>{
            if(e.uuid===cardUuid && e.disableTime !==''){
                classNameList.push('fzhs-item-disable')
            }
            if(e.cardList.length>0){
                loop(e.cardList)
            }
            if(e.categoryList.length>0){
                loop(e.categoryList)
            }
        })

        return(
            <ContainerWrap type="report-one" className="syxmb">
				<FlexTitle>
					<div className="flex-title-left">
						{isSpread || pageList.getIn(['Report','pageList']).size <= 1 ? '' :
							<PageSwitch
								pageItem={pageList.get('Report')}
								onClick={(page, name, key) => {
									dispatch(homeActions.addPageTabPane('ReportPanes', key, key, name))
									dispatch(homeActions.addHomeTabpane(page, key, name))
								}}
							/>
						}
						<Select
							className="title-date"
							value={issuedate}
							onChange={(value) =>{
                                dispatch(syxmbActions.changeAssOrAc('ac'))
                                dispatch(syxmbActions.getSYXMBCardList(value, value,'false'))
                            }}
							>
							{issues.map((data, i) => <Select.Option key={i} value={data}>{data}</Select.Option>)}
						</Select>
						<span className="title-checkboxtext" onClick={() => {
							if (chooseperiods && endissuedate !== issuedate) {
                                dispatch(syxmbActions.changeAssOrAc('ac'))
								dispatch(syxmbActions.getSYXMBCardList(issuedate, issuedate, 'false'))
							}
							dispatch(syxmbActions.changeSyxmbChooseMorePeriods())
						}}>
							<Checkbox className="title-checkbox" checked={chooseperiods}></Checkbox>
							<span>至</span>
						</span>
						<Select
							disabled={!chooseperiods}
							className="title-date"
							value={endissuedate === issuedate ? '' : endissuedate}
							onChange={(value) => {
                                dispatch(syxmbActions.changeAssOrAc('ac'))
                                dispatch(syxmbActions.getSYXMBCardList(issuedate, value, 'false'))
                            }}
							>
							{nextperiods.map((data, i) => <Select.Option key={i} value={data}>{data}</Select.Option>)}
						</Select>
                        {cardList.size > 0 &&
                            <CardListTree
                                disabled={!issuedate}
                                cardList={cardList.toJS()}
                                style={{width: 160}}
                                //className={["title-date", "lrb-title-date", cardUuid && cardList.find(v => v.get('uuid') === cardUuid).get('disableTime') ? 'fzhs-item-disable' : ''].join(' ')}
                                className={classNameList}
                                value={cardUuid}
                                onChange={(value,node,extra) => {
                                    dispatch(syxmbActions.changeAssOrAc('ac'))
                                    let cardList=syxmbState.get("cardList").toJS()
                                    let item
                                    const loop = (cardList) => cardList.map((e, i) => {
                                        if (e.uuid===value) {
                                            item=e
                                        }
                                        if (e.cardList.length > 0) {
                                            loop(e.cardList)
                                        }
                                        if (e.categoryList.length > 0) {
                                            loop(e.categoryList)
                                        }
                                    })
                                    loop(cardList)
                                    dispatch(syxmbActions.getSYXMIncomeStatementFetch(issuedate, endissuedate, value,item.beCategory,false))
                                    dispatch(syxmbActions.changeNeedCategory(false))
                                    dispatch(syxmbActions.setBeCategory(item.beCategory))
                                    dispatch(syxmbActions.setCardName(item.name))

                                    if (item.uuid === '') {  // 选择了 全部
                                        // if (cardList.some(v => v.categoryList.length)) {
                                        if (cardList.some(v => v.uuid && v.beCategory)) {
                                            dispatch(syxmbActions.handleCheckedShow(true))
                                        } else {
                                            dispatch(syxmbActions.handleCheckedShow(false))
                                        }
                                    } else {
                                        if (item.categoryList.length>0) {
                                            dispatch(syxmbActions.handleCheckedShow(true))
                                        } else {
                                            dispatch(syxmbActions.handleCheckedShow(false))
                                        }
                                    }
                                }}
                            />
                        }
                        {showCheck &&
                            <span className="title-checkboxtext">
                                <Checkbox
                                    className="title-checkbox"
                                    checked={needCategory}
                                    onClick={()=>{
                                        dispatch(syxmbActions.changeNeedCategory(!needCategory))
                                        dispatch(syxmbActions.getSYXMIncomeStatementFetch(issuedate, endissuedate, cardUuid,beCategory,!needCategory))
                                }}/>
                                <span>仅显示类别</span>
                            </span>
                        }
					</div>
					<div className="flex-title-right">
                        <span>
                        单位：
                        <Select
                            value={unit}
                            className='unit-select'
                            onChange={(value)=>{
                                dispatch(syxmbActions.changeUnit(value))
                            }}
                        >
                             <Select.Option value={1}>元</Select.Option>
                             <Select.Option value={1000}>千元</Select.Option>
                             <Select.Option value={10000}>万元</Select.Option>
                        </Select>
                        </span>

						<span className="title-right title-dropdown">
							<Export
								isAdmin={reportPermissionInfo.getIn(['exportExcel', 'permission'])}
								type="first"
								exportDisable={!issuedate || !reportPermissionInfo.getIn(['exportExcel', 'permission']) || isPlay}

								excelDownloadUrl={`${ROOT}/excel/export/project/AMBIncome?${URL_POSTFIX}&begin=${issuedate ? `${issuedate.substr(0,4)}${issuedate.substr(6,2)}` : ''}&end=${endissuedate ? `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}` : ''}&cardUuid=${cardUuid}&beCategory=${beCategory}&needCategory=${needCategory}`}
								ddExcelCallback={(value) => dispatch(allActions.allExportReceiverlist(value, 'excelAMBSYBIncome', {begin: `${issuedate.substr(0,4)}${issuedate.substr(6,2)}`, end: `${endissuedate.substr(0,4)}${endissuedate.substr(6,2)}`, cardUuid: cardUuid,beCategory:beCategory,needCategory:needCategory}))}
								onErrorSendMsg={(type, valueFirst, valueSecond) => {
									dispatch(allActions.sendMessageToDeveloper({
										title: '导出发送钉钉文件异常',
										message: `type:${type},valueFirst:${valueFirst},valueSecond:${valueSecond}`,
										remark: '阿米巴',
									}))
								}}
							/>
						</span>
                        <Button
							disabled={!issuedate}
							className="title-right refresh-btn"
							type="ghost"
							onClick={() => {
								dispatch(syxmbActions.getSYXMBCardList(issuedate, endissuedate,'true'))
								//dispatch(allActions.freshReportPage('阿米巴损益表2'))
							}}
							>
							刷新
						</Button>
					</div>
				</FlexTitle>
				<AmbBody
                    beCategory={beCategory}
					cardUuid={cardUuid}
					gainAndLoss={gainAndLoss}
					income={income}
					pay={pay}
					incomeBigger={incomeBigger}
					detailDrawing={detailDrawing}
					trendMap={trendMap}
					issuedate={issuedate}
					endissuedate={endissuedate}
					ambDetailTable={ambDetailTable}
					dispatch={dispatch}
					didMount={didMount}
					currentAc={currentAc}
					cardName={cardName}
					tableShowChild={tableShowChild}
					//assCategory={assCategory}
					isSpread={isSpread}
                    allAssOrAc={allAssOrAc}
                    unit={unit}
				/>
			</ContainerWrap>
        )
    }
}
