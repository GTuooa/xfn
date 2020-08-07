import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'
import { Icon, Container, Form, ScrollView, Checkbox, Switch, ButtonGroup, Button } from 'app/components'
const { Item } = Form

import * as runningConfActions from 'app/redux/Config/Running/runningConf/runningConf.action'

@connect(state => state)
export default
class RangeProject extends React.Component {

	static displayName = 'RangeContacts'

    render() {
        const { history, dispatch, runningConfState, } = this.props

        const runningTemp = runningConfState.get('runningTemp')
        const categoryType = runningTemp.get('categoryType')
        const beProject = runningTemp.get('beProject')
        const projectRange = runningTemp.get('projectRange')
        const allProjectRange = runningTemp.get('allProjectRange')
        const propertyTax = runningTemp.get('propertyTax')
        const showProgect = beProject && categoryType !== 'LB_ZB' && propertyTax !== 'SX_ZZS' && propertyTax !== 'SX_GRSF'


        return(
            <Container className='accountConfig-modal'>
                <ScrollView flex="1">
                    <Form>
                        <Item label='项目管理'>
                            <span className='noTextSwitch'>
                                <Switch
                                    checked={beProject}
					    	    	onClick={()=> {
					    	    		if (!beProject && !projectRange.size) { // 点击开启项目时默认勾选第一个项目
											if (allProjectRange.size) {
												dispatch(runningConfActions.changeCardCheckboxArr(['runningTemp', 'projectRange'], true, allProjectRange.getIn([0, 'uuid'])))
											}
										}
										dispatch(runningConfActions.changeRunningTemp('beProject', !beProject))
					    	    	}}
					    	    />
                            </span>
					    </Item>

                        {showProgect ? <div className="config-form-sub-title">项目范围</div> : null}

                        {
                            showProgect && allProjectRange.map((v, i) => {
                                const uuid = v.get('uuid')
                                return (
                                    <Item
                                        label={v.get('name')}
                                        key={uuid}
                                        onClick={() => {
                                            let valueArr = projectRange
                                            if (projectRange.includes(uuid)) {
                                                const idx = projectRange.findIndex(v => v==uuid)
                                                valueArr = projectRange.delete(idx)
                                            } else {
                                                valueArr = projectRange.push(uuid)
                                            }
                                            dispatch(runningConfActions.changeRunningTemp('projectRange', fromJS(valueArr)))
                                        }}>
                                           <Checkbox
                                                checked={projectRange.includes(uuid)}
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
