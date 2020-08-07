import React, { PropTypes } from 'react'
import { connect }	from 'react-redux'
import { toJS, Map } from 'immutable'
import * as thirdParty from 'app/thirdParty'
import * as assetsYebActions from 'app/redux/Yeb/AssetsYeb/assetsYeb.action.js'
import { TopMonthPicker } from 'app/containers/components'
import { Container, Row, ScrollView } from 'app/components'
import * as allActions from 'app/redux/Home/All/other.action'
import './style.less'
import '../Kmyeb/kmyeb.less'

import AssetsItem from './AssetsItem'

@connect(state => state)
export default
class AssetsYeb extends React.Component {
    componentDidMount() {
        thirdParty.setTitle({title: '资产余额表'})
        thirdParty.setIcon({
            showIcon: false
        })
        // thirdParty.setRight({show: false})
        if (sessionStorage.getItem('prevPage') === 'home') {
			sessionStorage.removeItem('prevPage')
			this.props.dispatch(assetsYebActions.AllZcyebFetch())
		}
        // else {
		// 	this.props.dispatch(assetsYebActions.getAssetsDetailFetch(this.props.assetsYebState.get('issuedate'),this.props.assetsYebState.get('endissuedate')))
		// }
    }

    render() {
        const {
            dispatch,
            allState,
            assetsYebState,
            history
        } = this.props

        const detailassetslist = assetsYebState.get('detailassetslist')

        const detailassetsSeq = detailassetslist.toSeq().filter(v => v.get('serialNumber').length < 7)
        const issuedate = assetsYebState.get('issuedate')
		const showedLowerAssdetalList = assetsYebState.get('showedLowerAssdetalList')

        const issues = allState.get('issues')
        const endissuedate = assetsYebState.get('endissuedate')
		const idx = issues.findIndex(v => v.get('value') === issuedate)
		const nextperiods = issues.slice(0, idx)

		const handleDetailassets = detailassetsSeq.map((v, i) => {
			const currSerialNumber = v.get('serialNumber')
			const nextSerialNumber = detailassetsSeq.getIn([i + 1, 'serialNumber'])

			return v.set('hasSub', !!nextSerialNumber && nextSerialNumber.indexOf(currSerialNumber) === 0)
		})

        // export
        const end = endissuedate ? endissuedate : issuedate
        const ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('excelAssetsBalance', {begin: `${issuedate.substr(0,4)}${issuedate.substr(5,2)}`, end: `${end.substr(0,4)}${end.substr(5,2)}`}))
		const ddPDFCallback = () => dispatch => dispatch(allActions.allExportDo('pdfAssetsBa', {begin: `${issuedate.substr(0,4)}${issuedate.substr(5,2)}`, end: `${end.substr(0,4)}${end.substr(5,2)}`}))

		dispatch(allActions.navigationSetMenu('lrb', ddPDFCallback, ddExcelCallback))

        return (
            <Container className="kmyeb">
                <TopMonthPicker
                    issuedate={issuedate}
                    source={issues} //默认显示日期
                    callback={(value) => dispatch(assetsYebActions.getAssetsDetailFetch(value, endissuedate))}
                    onOk={(result) => dispatch(assetsYebActions.getAssetsDetailFetch(result.value, endissuedate))}
                    showSwitch={true}//是否有跨期的按钮
					endissuedate={endissuedate}
					nextperiods={nextperiods}
					onBeginOk={(result) => {//跨期选择完开始时间后
						dispatch(assetsYebActions.getAssetsDetailFetch(result.value, ''))
					}}
					onEndOk={(result) => {//跨期选择完结束时间后
						dispatch(assetsYebActions.getAssetsDetailFetch(issuedate, result.value))
					}}
					changeEndToBegin={()=>dispatch(assetsYebActions.getAssetsDetailFetch(issuedate, ''))}

                />
				<Row className='ba-title'>
					<div className='ba-title-item'>资产原值</div>
					<div className='ba-title-item'>累计(折/摊)</div>
					<div className='ba-title-item'>本期(折/摊)</div>
					<div className='ba-title-item'>期末净值</div>
				</Row>
				<ScrollView flex="1" uniqueKey="Assetskmyeb-scroll" savePosition>
					<div className='ba-list'>
						{handleDetailassets.map((v,i)=> {
							const serialNumber = v.get('serialNumber')
                            const upperNumber = v.get('upperNumber') || v.get('upperAssetsNumber')
							const backgroundColor = serialNumber.length > 1 ? '#FEF3E3' : '#fff'
							const display = serialNumber.length === 1 || showedLowerAssdetalList.some(w => upperNumber === w) ? '' : 'none'
                            const isExpanded = showedLowerAssdetalList.some(w => serialNumber === w)

							return (
								<AssetsItem
									key={i}
                                    className={serialNumber.length > 1 ? 'upacid' : ''}
									issuedate={issuedate}
                                    endissuedate = {endissuedate}
									style={{backgroundColor, display}}
									assetsItem={v}
									hasSub={v.get('hasSub')}
                                    isExpanded={isExpanded}
									dispatch={dispatch}
                                    history={history}
								/>
							)
						})}
					</div>
				</ScrollView>
            </Container>
        )
    }
}
