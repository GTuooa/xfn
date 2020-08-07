import React, { PropTypes } from 'react'
import { Map, toJS } from 'immutable'
import { connect }	from 'react-redux'
import './Assets.less'
import { Container, ButtonGroup, Button, Icon, ScrollView, Row } from 'app/components'
// import Searchbar from './Searchbar.jsx'

import AssetsItem from './AssetsItem.jsx'
import * as thirdParty from 'app/thirdParty'

import * as allActions from 'app/redux/Home/All/other.action'
import * as assetsActions from 'app/redux/Config/Assets/assets.action.js'
import * as acAllActions from 'app/redux/Home/All/aclist.actions'

@connect(state => state)
export default
class Assets extends React.Component {

    componentDidMount() {
		thirdParty.setTitle({title: '资产设置'})
        // thirdparty.setRight({show: false})
        thirdParty.setIcon({
            showIcon: false
        })
        this.props.dispatch(assetsActions.initAssetsStatus())
        this.props.dispatch(assetsActions.getAssestsListFetch())
        // this.props.dispatch(acAllActions.getAcListandAsslistFetch())
	}

    render() {
        const {
            dispatch,
            assetsState,
            allState,
            history,
            homeState
        } = this.props

        const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])

        const allModifyButtonDisplay = assetsState.get('allModifyButtonDisplay')
        const assetslist = assetsState.get('assetslist') ? assetsState.get('assetslist') : []
        // 是否有非零个item被选中
        const nonZeroAssetsItemBool = assetsState.get('assetslist').some(v => v.get('checked'))

        const showedLowerAssetsIdList = assetsState.get('showedLowerAssetsIdList')
        const assetsCheckboxDisplay = assetsState.get('assetsCheckboxDisplay')

        const handleallAssetslist = assetslist.map((v, i) => {
			const currSerialNumber = v.get('serialNumber')
			const nextSerialNumber = assetslist.getIn([i + 1, 'serialNumber'])

			return v.set('hasSub', !!nextSerialNumber && nextSerialNumber.indexOf(currSerialNumber) === 0).set('addclassification', nextSerialNumber ? (currSerialNumber.length === 1 &&  nextSerialNumber.length === 7 ? false : true) : true)
		})

        const handleCategorylist = handleallAssetslist.filter(v => v.get('serialNumber').length <= 3)
        const handleAssetslist = allModifyButtonDisplay ? handleCategorylist : handleallAssetslist

        const period = allState.get('period')
        const openedyear = period.get('openedyear')
        const openedmonth = period.get('openedmonth')
        const closedyear = period.get('closedyear')
        const closedmonth = period.get('closedmonth')

        const noperiod = !openedyear && !closedyear

        const cardInputPeriod = noperiod ? '' : (openedyear ? `${openedyear}年第${openedmonth}期` : `${closedmonth === '12' ? closedyear - 0 + 1 + '' : closedyear}年第${closedmonth === '12' ? '01' : (closedmonth - 0 + 1 + '').length === 1 ? '0' + (closedmonth - 0 + 1 + '') : (closedmonth - 0 + 1 + '') }期`)

        // 资产类别导出
        const ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('excelclassification'))

		dispatch(allActions.navigationSetMenu('config', '', ddExcelCallback))

        return (
            <Container className="assets">
                {/* <Searchbar assetslist={assetslist} dispatch={dispatch}/> */}
                <ScrollView flex="1" uniqueKey="assets-scroll" savePosition>
                    {
                        handleAssetslist.map((v, i) => {
                            const serialNumber = v.get('serialNumber')
                            const upperAssetsNumber = v.get('upperAssetsNumber')
							const backgroundColor = serialNumber.length === 1 ? '#fff' : ''
							const color = serialNumber.length === 1 ? '#222' : '#666'
                            const isExpanded = showedLowerAssetsIdList.some(w => serialNumber === w)
                            // 第一个判断使得资产类别显示
							const display = serialNumber.length === 1 || showedLowerAssetsIdList.some(w => upperAssetsNumber === w) ? '' : 'none'

                            return(
                                <AssetsItem
                                    key={serialNumber}
                                    assetsitem={v}
                                    history={history}
                                    assetslist={assetslist}
                                    style={{backgroundColor, display, color}}
                                    dispatch={dispatch}
                                    isExpanded={isExpanded}
                                    assetsCheckboxDisplay={assetsCheckboxDisplay}
                                    allModifyButtonDisplay={allModifyButtonDisplay}
                                    isEnd={i === handleAssetslist.size-1 ? true : false}
                                />
                            )
                        })
                    }
                </ScrollView>
                <Row>
                    <ButtonGroup style={{display: allModifyButtonDisplay || assetsCheckboxDisplay ? 'none' : ''}} height={50}>
                        <Button
                            disabled={!editPermission}
                            onClick={() => {
                                dispatch(assetsActions.showAllModifyButton())
                            }}>
                            <Icon type='add-plus'/><span>新增类别</span>
                        </Button>
                        <Button
                            disabled={noperiod || !editPermission}
                            onClick={() => {
                                dispatch(assetsActions.getCardNumberFetch(cardInputPeriod))
                                // dispatch(assetsActions.changeInputPeriod())
                                history.push('/assets/assetsoption/card')
                            }}>
                            <Icon type='add-plus'/><span>新增卡片</span>
                        </Button>
                        <Button
                            disabled={!editPermission}
                            onClick={() => dispatch(assetsActions.changeAssetsCheckbox())}
                        >
                            <Icon type='select' size='15'/><span>选择</span>
                        </Button>
                    </ButtonGroup>
                    <ButtonGroup height={50} style={{display: allModifyButtonDisplay ? '' : 'none'}}>
                        <Button onClick={() => dispatch(assetsActions.showAllModifyButton())}><Icon type='cancel'/><span>取消</span></Button>
                    </ButtonGroup>
                    <ButtonGroup height={50} style={{display: assetsCheckboxDisplay ? '' : 'none'}}>
                        <Button onClick={() => dispatch(assetsActions.selectallAssetsCheckbox())}><Icon type='choose'/><span>全选</span></Button>
                        <Button onClick={() => dispatch(assetsActions.cancelAssetsCheckbox())}><Icon type='cancel'/><span>取消</span></Button>
                        <Button disabled={!nonZeroAssetsItemBool || !editPermission} onClick={() => dispatch(assetsActions.deleteAssetsItem())}><Icon type='delete'/><span>删除</span></Button>
                    </ButtonGroup>
                </Row>
            </Container>
        )
    }


}
