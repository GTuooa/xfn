import React, { PropTypes } from 'react'
import { connect }	from 'react-redux'
import { toJS, Map } from 'immutable'
import * as thirdParty from 'app/thirdParty'
import * as assYebActions from 'app/redux/Yeb/AssYeb/assYeb.action.js'
import * as assAllActions from 'app/redux/Home/All/asslist.actions'
import { TopMonthPicker } from 'app/containers/components'
import { ButtonGroup, Button, Container, Row, ScrollView, SinglePicker, TextInput, Icon } from 'app/components'

import './Asskmyeb.less'
import Ba from './Ba'

import * as allActions from 'app/redux/Home/All/other.action'

@connect(state => state)
export default
class AssYeb extends React.Component {

    componentDidMount() {
        thirdParty.setTitle({title: '辅助核算余额表'})
        thirdParty.setIcon({
            showIcon: false
        })
        // thirdParty.setRight({show: false})
        if (sessionStorage.getItem('prevPage') === 'home') {
			sessionStorage.removeItem('prevPage')
			this.props.dispatch(assYebActions.getPeriodAndAssKmyebListFetch())
		}
        // else {
		// 	this.props.dispatch(assYebActions.getPeriodAndAssKmyebListFetch(this.props.assYebState.get('issuedate'),
        //     this.props.assYebState.get('endissuedate'),
        //     this.props.assYebState.get('kmyeAssCategory'), this.props.assYebState.get('acId'),this.props.assYebState.get('kmyeAssAcId')))
		// }

    }
    constructor() {
		super()
		this.state = {serchFor: '', isSerch: false}
	}


    render() {
        const {
            history,
            dispatch,
            allState,
            assYebState,
            homeState
        } = this.props
        const { serchFor, isSerch } = this.state

        const hasVc = homeState.getIn(['flags', 'hasVc'])

        const assTags = allState.get('assTags')

        let assKmyebList = assYebState.get('assKmyebList').toSeq()
        const oldAssKmyebList = assYebState.get('assKmyebList').toSeq()
        const issuedate = assYebState.get('issuedate')
		const showedLowerAcIdList = assYebState.get('showedLowerAcIdList')
        const kmyeAssCategory = assYebState.get('kmyeAssCategory')
        const assIdTwo = assYebState.get('assIdTwo')
        const doubleAssCategory = assYebState.get('doubleAssCategory')
        const doubleAss = assYebState.get('doubleAss')
        const issues = allState.get('issues')
        const firstDate = issues.getIn([0,'value'])
        const lastDate = issues.getIn([issues.size - 1,'value'])
        const kmyeAssAcId = assYebState.get('kmyeAssAcId')
        const assTree = assYebState.get('assTree')
        const acId = assYebState.get('acId')
        const endissuedate = assYebState.get('endissuedate')
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const nextperiods = issues.slice(0, idx)
        // assKmyebList = serchFor === '' ? assKmyebList : assKmyebList.filter(v => v.get('assid').indexOf(serchFor) > -1 || v.get('assname').indexOf(serchFor) > -1)
        assKmyebList = serchFor === '' ? assKmyebList : assKmyebList.filter(v => v.get('wrapId').indexOf(serchFor) > -1 || v.get('wrapName').indexOf(serchFor) > -1)

        // export
        const begin = issuedate.substr(0,4)+ '' +issuedate.substr(5,2)
        const end =  endissuedate ? (endissuedate.substr(0,4)+ '' +endissuedate.substr(5,2)) : begin

        let  assNameTwo = ''
        let doubleAssCategorys = assIdTwo ? doubleAssCategory : ''

        if (assIdTwo) {
            assNameTwo = doubleAss.filter(v => v.get('value')==assIdTwo).getIn([0,'key']).split(' ')[1]
        }

		const ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('asskmyebexcelsend', {begin: begin, end: end, asscategory: kmyeAssCategory, acid: acId, asscategoryTwo:doubleAssCategorys,assNameTwo:assNameTwo,assIdTwo:assIdTwo}))
		const ddPDFCallback = () => dispatch => dispatch(allActions.allExportDo('pdfasswbaexport', {begin: begin, end: end, asscategory: kmyeAssCategory, acid: acId, asscategoryTwo:doubleAssCategorys,assNameTwo:assNameTwo,assIdTwo:assIdTwo}))

		dispatch(allActions.navigationSetMenu('lrb', ddPDFCallback, ddExcelCallback))

        let numer = 0

        return (
            <Container className="Asskmyeb">
                <TopMonthPicker
                    issuedate={issuedate}
                    source={issues}
                    callback={(value) => dispatch(assYebActions.getAssKmyebListFetch(value, endissuedate, kmyeAssCategory, acId, kmyeAssAcId))}
                    onOk={(result) => dispatch(assYebActions.getAssKmyebListFetch(result.value, endissuedate, kmyeAssCategory, acId, kmyeAssAcId))}
                    showSwitch={true}//是否有跨期的按钮
					endissuedate={endissuedate}
					nextperiods={nextperiods}
					onBeginOk={(result) => {//跨期选择完开始时间后
						//dispatch(assYebActions.changeAssYebBeginDate(result.value, false))
                        dispatch(assYebActions.getAssKmyebListFetch(result.value, '', kmyeAssCategory, acId, kmyeAssAcId))
					}}
					onEndOk={(result) => {//跨期选择完结束时间后
						dispatch(assYebActions.getAssKmyebListFetch(issuedate, result.value, kmyeAssCategory, acId, kmyeAssAcId))
					}}
					changeEndToBegin={()=>dispatch(assYebActions.getAssKmyebListFetch(issuedate, '', kmyeAssCategory, acId, kmyeAssAcId))}
                />
                <Row className="Asskmyeb-select">
                    <SinglePicker
                        // disabled={!hasVc}
                        className="Asskmyeb-select-select"
                        district={assTags.map((v, i) => ({key: v, value: v}))}
                        onOk={(result) => {
                            dispatch(assYebActions.getAssKmyebListFetch(issuedate, endissuedate, result.value, acId, kmyeAssAcId))
                            dispatch(assYebActions.getAssTreeListFetch(issuedate, endissuedate, result.value))
                        }}
                    >
                        <span>
                            <span className="Asskmyeb-select-select-text">{kmyeAssCategory.length > 6 ? kmyeAssCategory.substr(0,6) + '...' : kmyeAssCategory}</span>
                            <Icon className="Asskmyeb-select-select-trangle" type="triangle" size='10'/>
                        </span>
                    </SinglePicker>
                    <div className="Asskmyeb-select-select assKmyebTree">
                        {
                            isSerch ?
                            <span className='Asskmyeb-select-inputwrap'>
                                <Icon className="Asskmyeb-select-icon" type="search"/>
                                <TextInput
                                    className="Asskmyeb-select-input"
                                    placeholder="搜索核算项目..."
                                    value={serchFor}
                                    onChange={value => this.setState({serchFor: value})}
                                />
                            </span> :
                            <SinglePicker
                                className='Asskmyeb-select-select-wrap'
                                district={assTree.toJS()}
                                onOk={(result) => {
                                    /*dispatch(assYebActions.getAssKmyebListFetch(issuedate ,endissuedate,kmyeAssCategory,result.value,result.key))
                                    dispatch(assYebActions.changeKmyeAssAcId(result.key, result.value))*/
                                    if (result.value) { //非全部
                                        dispatch(assYebActions.getAssKmyebListFetch(issuedate ,endissuedate,kmyeAssCategory,result.value,result.key, true))
                                        dispatch(assYebActions.changeKmyeAssAcId(result.key, result.value))
                                    } else { //是全部
                                        dispatch(assYebActions.getAssKmyebListFetch(issuedate ,endissuedate,kmyeAssCategory,result.value,result.key))
                                        dispatch(assYebActions.changeKmyeAssAcId(result.key, result.value))
                                    }
                                }}
                            >
                                <span>
                                    <span className="Asskmyeb-select-select-text">{kmyeAssAcId}</span>
                                    <Icon className="Asskmyeb-select-select-trangle" type="arrow-down" size='10'/>
                                </span>
                            </SinglePicker>
                        }
                        <SinglePicker
                            district={[{
                                key:'选科目',
                                value: '0'
                            },{
                                key:'搜索',
                                value: '1'
                            }]}
                            onOk={(result) => {
                                if(result.key==='搜索'){
                                    this.setState({isSerch: true})
                                }else{
                                    this.setState({isSerch: false, serchFor: ''})
                                }
                            }}
                        >
                            <span className='Asskmyeb-select-select-option'
                                // onClick={()=>{
                                //     thirdparty.chosen({
                                //         source: [{
                                //             key:'选科目',
                                //             value: '0'
                                //         },{
                                //             key:'搜索',
                                //             value: '1'
                                //         }],
                                //         onSuccess: (result) => {
                                //             if(result.key==='搜索'){
                                //                 this.setState({isSerch: true})
                                //             }else{
                                //                 this.setState({isSerch: false, serchFor: ''})
                                //             }
                                //         },
                                //         onFail: (err) => {}
                                //     })}}
                            >
                                <span>{isSerch ? '搜索' : '选科目'}</span>
                                <Icon type="triangle" size='10' color='#ccc'/>
                            </span>
                        </SinglePicker>
                    </div>
				</Row>
                {/* <Row className='Asskmyeb-select-inputwrap'>
                    <Icon className="Asskmyeb-select-icon" type="search"/>
                    <Input
                        className="Asskmyeb-select-input"
                        placeholder="搜索核算项目..."
                        onChange={(e) => this.setState({serchFor: e.target.value})}
                    ></Input>
                </Row> */}

				<Row className='ba-title'>
					<div className='ba-title-item'>期初余额</div>
					<div className='ba-title-item'>本期借方</div>
					<div className='ba-title-item'>本期贷方</div>
					<div className='ba-title-item'>期末余额</div>
				</Row>
				<ScrollView flex="1" uniqueKey="Asskmyeb-scroll" savePosition>
					<div className='ba-list'>
						{
                            assKmyebList.map((v,i)=>{
                                let line;
    							let showchilditem;
    							if(v.get('isWrap')){//一级的都显示
    								line=++numer;
    								showchilditem=v.get('showchilditem');
    							}else{
    								if(v.get('isFirstChild') || v.get('isFirstAndLast')){
    									const parentAcid = v.get('wrapId');
    									showchilditem = assKmyebList.find(v => v.get('assid') == parentAcid).get('showchilditem');
    									line = showchilditem ? ++numer : 'hide'
    								}else{
    									const wrapId = v.get('wrapId');//包裹的id
    									const wrapChildItem = assKmyebList.find(v => v.get('assid') == wrapId).get('showchilditem');
    									const firstLength=v.get('firstLength');
    									const upperId = v.get('assid').substr(0,firstLength);//最上一级id
    									showchilditem = assKmyebList.find(v => v.get('assid') == upperId &&  v.get('wrapId') == wrapId).get('showchilditem');
    									line = (showchilditem && wrapChildItem) ? ++numer : 'hide'
    								}
    							}
                                return <Ba
    								key={i}
    								ba={v}
                                    issuedate={issuedate}
                                    endissuedate={endissuedate}
                                    dispatch={dispatch}
                                    line={line}
                                    showchilditem={showchilditem}
                                    kmyeAssCategory={kmyeAssCategory}
                                    acId={acId}
                                    idx={i}
                                    oldAssKmyebList={oldAssKmyebList}
                                    className={v.get('disableTime') ? 'ba-item-disable' : ''}
                                    assIdTwo={assIdTwo}
                                    doubleAssCategory={doubleAssCategory}
                                    history={history}
    							/>
                            }
						)}
					</div>
				</ScrollView>
            </Container>
        )
    }
}
