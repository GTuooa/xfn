import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'
import { Icon, Container, Form, ScrollView, Checkbox, ButtonGroup, Button } from 'app/components'
const { Item } = Form

import * as runningConfActions from 'app/redux/Config/Running/runningConf/runningConf.action'

@connect(state => state)
export default
class RangeStock extends React.Component {

	static displayName = 'RangeSelect'

    render() {
        const {
            history,
            dispatch,
            homeState,
            runningConfState,
        } = this.props

        const newJr = homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])
        const isOpenedInventory = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo']).includes('INVENTORY')
        
        const runningTemp = runningConfState.get('runningTemp')
        const categoryType = runningTemp.get('categoryType')
        const categoryTypeObj = {'LB_YYSR': 'acBusinessIncome', 'LB_YYZC': 'acBusinessExpense'}[categoryType]
        const currentStockRange = runningTemp.getIn([categoryTypeObj,'currentStockRange'])
        const allStockRange = runningTemp.getIn([categoryTypeObj,'allStockRange'])
        const stockRange = runningTemp.getIn([categoryTypeObj,'stockRange'])
        const propertyCarryover = runningTemp.get('propertyCarryover')

        let propertyCarryoverList = [{key: '货物', value: 'SX_HW'},{key: '服务', value: 'SX_FW'}]
		if (newJr) {
			propertyCarryoverList = [{key: '服务', value: 'SX_FW'}]
			if (isOpenedInventory) {
				propertyCarryoverList.push({key: '货物', value: 'SX_HW'})
				if (categoryType === 'LB_YYSR') {
					propertyCarryoverList.push({key: '货物 + 服务', value: 'SX_HW_FW'})
				}
			}
		}

        return(
            <Container className='accountConfig-modal'>
                <ScrollView flex="1">
                    <Form>
                        {
                            propertyCarryoverList.map(v => {
                                return (
                                    <Item
                                        label={v['key']}
                                        key={v['value']}
                                        onClick={() => {
                                            const setDefaultStock = () => { // 同步设置默认的存货范围
                                                if (!currentStockRange.size && allStockRange.size) {
                                                    dispatch(runningConfActions.changeCardCheckboxArr(['runningTemp', categoryTypeObj, 'stockRange'], true, allStockRange.getIn([0, 'uuid'])))
                                                }
                                            }
                                            if (v['value']!='SX_FW') { setDefaultStock() }
                                            dispatch(runningConfActions.changeRunningTemp('propertyCarryover', v['value']))
                                            if (categoryType === 'LB_YYZC' && v['value'] === 'SX_HW') {//筛除营业支出的货物的生产项目
                                                const allProjectRange = runningTemp.get('allProjectRange')
                                                let projectRange = runningTemp.get('projectRange').toJS()
                                                let uuid = ''
                                                allProjectRange.map(v => {
                                                    if (v.get('name') === '生产项目') {
                                                        uuid = v.get('uuid')
                                                    }
                                                })
                                                if (uuid && projectRange.includes(uuid)) {
                                                    projectRange.splice(projectRange.findIndex(v => v==uuid),1)
                                                    dispatch(runningConfActions.changeRunningTemp('projectRange', fromJS(projectRange)))
                                                }
                                            }

                                        }}>
                                            {propertyCarryover==v['value'] ? <Icon type='tick' className='blue'/> : null}
                                    </Item>
                                )
                            })
                        }

                        {['SX_HW', 'SX_HW_FW'].includes(propertyCarryover) ? <div className="config-form-sub-title">存货范围</div> : null}

                        {
                            ['SX_HW', 'SX_HW_FW'].includes(propertyCarryover) && allStockRange.map((v, i) => {
                                const uuid = v.get('uuid')
                                return (
                                    <Item
                                        label={v.get('name')}
                                        key={uuid}
                                        onClick={() => {
                                            let valueArr = stockRange
                                            if (stockRange.includes(uuid)) {
                                                const idx = stockRange.findIndex(v => v==uuid)
                                                valueArr = stockRange.delete(idx)
                                            } else {
                                                valueArr = stockRange.push(uuid)
                                            }
                                            dispatch(runningConfActions.changeRunningTemp([categoryTypeObj, 'stockRange'], fromJS(valueArr)))

                                        }}>
                                           <Checkbox
                                                checked={stockRange.includes(uuid)}
                                                onChange={(e)=> {}}
                                            />
                                    </Item>
                                )
                            })
                        }
                    </Form>
                </ScrollView>
                <ButtonGroup>
                    <Button onClick={() => { history.goBack()}}>
                        <Icon type="confirm"/><span>确定</span>
                    </Button>
                </ButtonGroup>
            </Container>
        )
    }
}
