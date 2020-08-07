import React, { PropTypes } from 'react'
import { connect }	from 'react-redux'

import { toJS, Map } from 'immutable'
import thirdParty from 'app/thirdParty'
import { TopMonthPicker } from 'app/containers/components'
import { ButtonGroup, Button, Container, Row, ScrollView, Icon, Input, Single, ChosenPicker } from 'app/components'
import * as amountYebActions from 'app/redux/Yeb/AmountYeb/amountYeb.action.js'
import '../Kmyeb/kmyeb.less'
import './amountyeb.less'
import Ba from './Ba.jsx'
import * as allActions from 'app/redux/Home/All/other.action'

@connect(state => state)
export default
class AmountYeb extends React.Component {
    scrollerHeight = 0//滚动容器的高度
    componentDidMount() {
        thirdParty.setTitle({title: '数量余额表'})
        thirdParty.setIcon({
            showIcon: false
        })
        // thirdParty.setRight({show: false})
        if (sessionStorage.getItem('prevPage') === 'home') {
			sessionStorage.removeItem('prevPage')
            this.props.dispatch(amountYebActions.initAmountYeb())
            this.props.dispatch(amountYebActions.getPeriodAndCountListFetch())
		}
        const scrollViewHtml = document.getElementsByClassName('scroll-view')[0]
        this.scrollerHeight = Number(window.getComputedStyle(scrollViewHtml).height.replace('px',''))
    }

    render() {
        const {
            dispatch,
            allState,
            amountYebState,
            history
        } = this.props

        const issues = allState.get('issues')
        const issuedate = amountYebState.get('issuedate')
        const endissuedate = amountYebState.get('endissuedate')

        const amountYebList = amountYebState.get('amountYebList')
        const amountYebChildShow = amountYebState.get('amountYebChildShow')
        const assChildShow = amountYebState.get('assChildShow')

		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const nextperiods = issues.slice(0, idx)
        const unitDecimalCount = allState.getIn(['systemInfo', 'unitDecimalCount'])

        const queryByAss = amountYebState.getIn(['views', 'queryByAss'])
        const assTags = allState.get('assTags')
        let assCategoryList = [{key: '科目', value: 'ac'}]
        assTags.map((v, i) => assCategoryList.push({key: v, value: i}))

        const assObject = amountYebState.get('assObject')
        const assCategory = assObject.get('assCategory')
        const acId = assObject.get('acId')
        const acName = assObject.get('acName')
        const assSecondCategory = assObject.get('assSecondCategory')
        const secondAssKey = assObject.get('secondAssKey')
        const secondAssName = assObject.get('secondAssName')
        const secondAssId = assObject.get('secondAssId')
        const queryBySingleAc = assObject.get('queryBySingleAc')

        const acTree = amountYebState.get('acTree').toJS()
        const assTree = amountYebState.get('assTree').toJS()

        const getTree = (issuedate, endissuedate) => {
            if (queryByAss) {
                dispatch(amountYebActions.getAmountKmTree(issuedate, endissuedate, assCategory))
                dispatch(amountYebActions.getAmountAssTwoTree(issuedate, endissuedate, assCategory, '', ''))
            }
        }

        // export
        const end = endissuedate ? endissuedate : issuedate
		let ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('excelcountBa', {beginYear: issuedate.substr(0,4), beginMonth:issuedate.substr(5,2), endYear:end.substr(0,4), endMonth: end.substr(5,2)}))
		let ddPDFCallback = () => dispatch => dispatch(allActions.allExportDo('pdfCountBa', {beginYear: issuedate.substr(0,4), beginMonth:issuedate.substr(5,2), endYear:end.substr(0,4), endMonth: end.substr(5,2)}))
        if (queryByAss) {
            ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('excelcountBaByAss', {beginYear: issuedate.substr(0,4), beginMonth:issuedate.substr(5,2), endYear:end.substr(0,4), endMonth: end.substr(5,2), assCategory, assSecondCategory, secondAssKey, acId, acName, queryBySingleAc}))

            ddPDFCallback = () => dispatch => dispatch(allActions.allExportDo('pdfCountBaByAss', {beginYear: issuedate.substr(0,4), beginMonth:issuedate.substr(5,2), endYear:end.substr(0,4), endMonth: end.substr(5,2), assCategory, assCategoryTwo: assSecondCategory, acId, assIdTwo: secondAssId, assId: ''}))
        }

		dispatch(allActions.navigationSetMenu('lrb', ddPDFCallback, ddExcelCallback))

        const pageCount = Math.ceil(amountYebList.size/20)
        const currentPage = amountYebState.getIn(['views', 'currentPage'])

        return (
            <Container className="kmyeb amountyeb">
                <TopMonthPicker
                    issuedate={issuedate}
                    source={issues}
                    callback={(value) => {
                        getTree(value, endissuedate)
                        dispatch(amountYebActions.getAmountKmyebListFetch(value, endissuedate, queryByAss))
                    }}
					onOk={(result) => {
                        getTree(result.value, endissuedate)
                        dispatch(amountYebActions.getAmountKmyebListFetch(result.value, endissuedate, queryByAss))
                    }}
                    showSwitch={true}//是否有跨期的按钮
					endissuedate={endissuedate}
					nextperiods={nextperiods}
					onBeginOk={(result) => {//跨期选择完开始时间后
                        getTree(result.value, '')
                        dispatch(amountYebActions.getAmountKmyebListFetch(result.value, '', queryByAss))
					}}
					onEndOk={(result) => {//跨期选择完结束时间后
                        getTree(issuedate, result.value)
						dispatch(amountYebActions.getAmountKmyebListFetch(issuedate, result.value, queryByAss))
					}}
					changeEndToBegin={() => {
                        getTree(issuedate, '')
                        dispatch(amountYebActions.getAmountKmyebListFetch(issuedate, '', queryByAss))
                    }}

                />
                <Row className='amountyeb-search'>
                    <Single
                        className='amountyeb-asscategory'
                        district={assCategoryList}
                        value={assObject.get('assKey')}
                        onOk={value => {
                            dispatch(amountYebActions.changeData(['assObject', 'assKey'], value.value))
                            dispatch(amountYebActions.changeData(['assObject', 'assCategory'], value.label))

                            if (value.value=='ac') {//取消按辅助类别查询
                                dispatch(amountYebActions.getAmountKmyebListFetch(issuedate, endissuedate, false))
                                dispatch(amountYebActions.changeData(['views', 'queryByAss'], false))
                            } else {
                                dispatch(amountYebActions.changeData(['views', 'queryByAss'], true))
                                dispatch(amountYebActions.getAmountKmTree(issuedate, endissuedate, value.label))
                                dispatch(amountYebActions.getAmountAssTwoTree(issuedate, endissuedate, value.label, '', ''))
                                dispatch(amountYebActions.getAmountKmyebListFetch(issuedate, endissuedate, true))
                            }
                        }}
                    >
                        <Row className='ass-category'>
                            <span className='overElli'>{ assObject.get('assCategory') }</span>
                            <Icon type="triangle" />
                        </Row>
                    </Single>
                    {
                        queryByAss ? <ChosenPicker
                            className='amountyeb-asscategory more-ass'
                            type='card'
                            district={acTree}
                            cardList={assTree}
                            onChange={(value) => {
                                const acId = value.acid
                                const acKey = value.ackey
                                dispatch(amountYebActions.changeData(['assObject', 'acId'], acId))
                                dispatch(amountYebActions.changeData(['assObject', 'acKey'], acKey))
                                dispatch(amountYebActions.changeData(['assObject', 'acName'], value.acname))
                                if (acId) {
                                    dispatch(amountYebActions.changeData(['assObject', 'queryBySingleAc'], true))
                                } else {
                                    dispatch(amountYebActions.changeData(['assObject', 'queryBySingleAc'], false))
                                }
                                dispatch(amountYebActions.getAmountAssTwoTree(issuedate, endissuedate, assCategory, acId, acKey))
                                dispatch(amountYebActions.getAmountKmyebListFetch(issuedate, endissuedate, queryByAss))
                            }}
                            onOk={(value) => {
                                dispatch(amountYebActions.changeData(['assObject', 'secondAssKey'], value[0]['asskey']))
                                dispatch(amountYebActions.changeData(['assObject', 'secondAssName'], value[0]['assname']))
                                dispatch(amountYebActions.changeData(['assObject', 'secondAssId'], value[0]['assId']))
                                dispatch(amountYebActions.getAmountKmyebListFetch(issuedate, endissuedate, queryByAss, true))
                            }}
                            value={acId}
                            cardValue={[secondAssKey]}
                        >
                            <Row className='ass-category'>
                                <span className='overElli'>
                                    {`${acId} ${acName}`}{secondAssKey ? `-${secondAssName}` : ''}
                                </span>
                                <Icon type="triangle" />
                            </Row>
                        </ChosenPicker> : null
                    }

                </Row>
                <Row className='ba-title'>
					<div className='ba-title-item'>期初余额</div>
					<div className='ba-title-item'>本期借方</div>
					<div className='ba-title-item'>本期贷方</div>
					<div className='ba-title-item'>期末余额</div>
				</Row>
                <ScrollView flex="1" uniqueKey="Amountkmyeb-scroll" savePosition
                    onScroll={(e)=>{
                        const scrollY = e.target.scrollTop
                        if (scrollY + 100 + this.scrollerHeight >= currentPage*1842 && currentPage < pageCount) {
                            dispatch(amountYebActions.changeData(['views', 'currentPage'], currentPage+1))
                        }

                    }}
                >
					<div className='ba-list'>
						{amountYebList.slice(0,currentPage*20).map((v,i)=> {
                            let type = ''
                            let idAndName = ''
                            let line = 0
                            let assClassName = ''
                            let hasSub = false
                            let isExpanded = 'down'
                            let display = (!v.get('assid') && !v.get('asscategory')) || amountYebChildShow.some(w => v.get('acid').indexOf(w) > -1) ? '' : 'none'

                            if (v.get('assid')) {
                                type = 'assid'
                                assClassName = 'ba-ass'
                                idAndName = v.get('assid') + '_' + v.get('assname')

                            } else if (!v.get('assid') && v.get('asscategory')) {
                                type = 'asscategory'
                                assClassName = 'ba-ass'
                                idAndName = v.get('asscategory')

                            } else {
                                type = 'acid'
                                idAndName = v.get('acid') + '_' + v.get('acfullname')
                                hasSub = v.get('asslist') ? (v.get('asslist').size ? true : false) : false
                                isExpanded = amountYebChildShow.indexOf(v.get('acid')) > -1 ? true : false
                            }

                            let mxAssObj = {
                                assCategory,
                                assId: v.get('assId'),
                                assName: v.get('assName'),
                                acId,
                                acName,
                                assCategoryTwo: assSecondCategory,
                                assIdTwo: secondAssId,
                                assNameTwo: secondAssName,
                            }

                            if (queryByAss) {//新接口 加辅助核算维度
                                type = 'asscategory'
                                assClassName = ''
                                idAndName = v.get('assId') + '_' + v.get('assName')
                                hasSub = v.get('baAcList') && v.get('baAcList').size ? true : false
                                isExpanded = assChildShow.indexOf(v.get('assId')) > -1 ? true : false

                                if (isExpanded) {
                                    return (
                                        <div key={i}>
                                            <Ba
                                                baItem={v}
                                                style={{display}}
                                                dispatch={dispatch}
                                                issuedate={issuedate}
                                                endissuedate={endissuedate}
                                                idAndName={idAndName}
                                                assClassName={assClassName}
                                                hasSub={hasSub}
                                                isExpanded={isExpanded}
                                                type={type}
                                                history={history}
                                                className={v.get('disableTime') ? 'amount-item-disable' : ''}
                                                unitDecimalCount={unitDecimalCount}
                                                queryByAss={queryByAss}
                                                mxAssObj={mxAssObj}
                                            />
                                            {
                                                v.get('baAcList').map((w,j)=> {
                                                    return (
                                                        <Ba
                                                            key={`${i}-${j}`}
                                                            baItem={w}
                                                            style={{display:''}}
                                                            dispatch={dispatch}
                                                            issuedate={issuedate}
                                                            endissuedate={endissuedate}
                                                            idAndName={`${w.get('acId')}_${w.get('acFullName')}`}
                                                            assClassName={'ba-ass'}
                                                            hasSub={false}
                                                            isExpanded={false}
                                                            type={'acid'}
                                                            history={history}
                                                            className={v.get('disableTime') ? 'amount-item-disable' : ''}
                                                            unitDecimalCount={unitDecimalCount}
                                                            queryByAss={queryByAss}
                                                            mxAssObj={mxAssObj}
                                                        />
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                }
                            }

							return (
								<Ba
									key={i}
									baItem={v}
                                    style={{display}}
                                    dispatch={dispatch}
                                    issuedate={issuedate}
                                    endissuedate={endissuedate}
                                    idAndName={idAndName}
                                    assClassName={assClassName}
                                    hasSub={hasSub}
                                    isExpanded={isExpanded}
                                    type={type}
                                    history={history}
                                    className={v.get('disableTime') ? 'amount-item-disable' : ''}
                                    unitDecimalCount={unitDecimalCount}
                                    queryByAss={queryByAss}
                                    mxAssObj={mxAssObj}
								/>
							)
						})}
					</div>
				</ScrollView>
            </Container>
        )
    }
}
