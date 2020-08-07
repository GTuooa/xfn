import React from 'react'
import { connect }	from 'react-redux'
import { fromJS } from 'immutable'
import * as thirdParty from 'app/thirdParty'

import { ScrollView } from 'app/components'

import RunningItem from './RunningItem.jsx'

import * as runningConfActions from 'app/redux/Config/Running/runningConf/runningConf.action'
import * as allRunningActions from 'app/redux/Home/All/allRunning.action'

@connect(state => state)
export default
class Running extends React.Component {

    static displayName = 'Running'

	render() {
		const { dispatch, runningConfState, editPermission, allState, history } = this.props

        const views = runningConfState.get('views')
		const allItemCheckBoxDisplay = views.get('allItemCheckBoxDisplay')
		const allItemModifyButtonDisplay =  views.get('allItemModifyButtonDisplay')
		const toolBarDisplayIndex = views.get('toolBarDisplayIndex')
        const runningShowChild = views.get('runningShowChild')
        const runningSelect = views.get('runningSelect')
        const isChangePoistion = views.get('isChangePoistion')

        const runningCategory = allState.get('runningCategory')

        // 构造显示的running item
        const loop = (data, leve, upperArr, disableList,isValid) => {
            let elementList = []
            const backgroundColor = leve > 1 ? '#FEF3E3' : '#fff'
            data && data.forEach((item, i) => {
                if (item.get('childList').size || item.get('disableList').size) {
                    const showChild = runningShowChild.indexOf(item.get('uuid')) > -1
                    elementList.push(
                        <div key={item.get('uuid')}>
                            <RunningItem
                                leve={leve}
                                hasSub={true}
                                isExpanded={showChild}
                                style={{backgroundColor}}
                                key={item.get('uuid')}
                                uuid={item.get('uuid')}
                                item={item}
                                selectable={true}
                                allItemCheckBoxDisplay={allItemCheckBoxDisplay}
                                allItemModifyButtonDisplay={allItemModifyButtonDisplay}
                                // currTabAcList={currTabAcList}
                                dispatch={dispatch}
                                runningSelect={runningSelect}
                                isChangePoistion={isChangePoistion}
                                history={history}
                                listType={'open'}
                                lastItemUuid={i > 0 ? data.getIn([i-1, 'uuid']):''}
                                nextItemUuid={i !== data.size-1 ? data.getIn([i+1, 'uuid']):''}
                                // uppername={uppername}
                            />
                            {showChild ? loop(item.get('childList'), leve+1, upperArr.push(item.get('uuid')), item.get('disableList')) : ''}
                        </div>
                    )
                } else {
                    elementList.push(
                        item.get('categoryType') !== 'LB_ZZ'?
                            <RunningItem
                                leve={leve}
                                hasSub={false}
                                style={{backgroundColor}}
                                key={item.get('uuid')}
                                uuid={item.get('uuid')}
                                item={item}
                                selectable={true}
                                allItemCheckBoxDisplay={allItemCheckBoxDisplay}
                                allItemModifyButtonDisplay={allItemModifyButtonDisplay}
                                // currTabAcList={currTabAcList}
                                dispatch={dispatch}
                                runningSelect={runningSelect}
                                isChangePoistion={isChangePoistion}
                                history={history}
                                listType={'open'}
                                lastItemUuid={i > 0 ? data.getIn([i-1, 'uuid']):''}
                                nextItemUuid={i !== data.size-1 ? data.getIn([i+1, 'uuid']):''}
                                // uppername={uppername}
                            /> : null
                    )
                }
            })

            if (disableList && disableList.size) {
                disableList.forEach((item, i) => {
                    const showChild = runningShowChild.indexOf(item.get('uuid')) > -1
                    if (item.get('disableList').size) {
                        elementList.push(
                            <div key ={item.get('uuid')}>
                                <RunningItem
                                    leve={leve}
                                    hasSub={true}
                                    isExpanded={showChild}
                                    style={{backgroundColor}}
                                    key={item.get('uuid')}
                                    uuid={item.get('uuid')}
                                    item={item}
                                    selectable={true}
                                    allItemCheckBoxDisplay={allItemCheckBoxDisplay}
                                    allItemModifyButtonDisplay={allItemModifyButtonDisplay}
                                    // currTabAcList={currTabAcList}
                                    dispatch={dispatch}
                                    runningSelect={runningSelect}
                                    isChangePoistion={isChangePoistion}
                                    history={history}
                                    listType={'colse'}
                                    // uppername={uppername}
                                />
                                {showChild ? loop(item.get('childList'), leve+1, upperArr.push(item.get('uuid')), item.get('disableList')) : ''}
                            </div>
                        )
                    } else {
                        elementList.push(
                            item.get('categoryType') !== 'LB_ZZ' ?
                                <RunningItem
                                    leve={leve}
                                    hasSub={false}
                                    style={{backgroundColor}}
                                    key={item.get('uuid')}
                                    uuid={item.get('uuid')}
                                    item={item}
                                    selectable={true}
                                    allItemCheckBoxDisplay={allItemCheckBoxDisplay}
                                    allItemModifyButtonDisplay={allItemModifyButtonDisplay}
                                    // currTabAcList={currTabAcList}
                                    dispatch={dispatch}
                                    runningSelect={runningSelect}
                                    isChangePoistion={isChangePoistion}
                                    history={history}
                                    listType={'colse'}
                                    // uppername={uppername}
                                /> : null
                            )
                    }
                })
            }
            return elementList
        }

		return(
            <ScrollView flex="1" uniqueKey="ac-config-scroll" savePosition className="ac-list">
                {loop(runningCategory.getIn([0, 'childList']), 1, fromJS([]),runningCategory.getIn([0, 'disableList']))}
            </ScrollView>
		)
	}
}
