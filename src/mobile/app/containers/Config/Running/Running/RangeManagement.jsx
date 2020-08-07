import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'
import { Icon, Container, Form, ScrollView, Switch, ButtonGroup, Button } from 'app/components'
const { Item } = Form

import * as runningConfActions from 'app/redux/Config/Running/runningConf/runningConf.action'
import * as editRunning from 'app/constants/editRunning.js'

@connect(state => state)
export default
class RangeManagement extends React.Component {

	static displayName = 'RangeSelect'

    render() {
        const { history, dispatch, runningConfState, } = this.props

        const runningTemp = runningConfState.get('runningTemp')
        const categoryType = runningTemp.get('categoryType')
        const categoryTypeObj = editRunning.categoryTypeObj[categoryType]
        const beManagemented = runningTemp.getIn([categoryTypeObj, 'beManagemented'])
        const beDeposited = runningTemp.getIn([categoryTypeObj, 'beDeposited'])

        return(
            <Container className='accountConfig-modal'>
                <ScrollView flex="1">
                    <Form>
                        <Item label='收付管理'>
                            <span className='noTextSwitch'>
                                <Switch
                                    checked={beManagemented}
					    	    	onClick={()=> {
					    	    		dispatch(runningConfActions.changeRunningTemp([categoryTypeObj, 'beManagemented'], !beManagemented))
					    	    	}}
					    	    />
                            </span>
					    </Item>

                        {
							['LB_YYSR', 'LB_YYZC', 'LB_FYZC'].includes(categoryType) && beManagemented ?
								<Item label={`同时启用预${categoryType === 'LB_YYSR' ? '收' : '付'}`} className='m-top'>
                                    <span className='noTextSwitch'>
                                        <Switch
									    	checked={beDeposited}
									    	onClick={()=> {
									    		dispatch(runningConfActions.changeRunningTemp([categoryTypeObj, 'beDeposited'], !beDeposited))
									    	}}
									    />
                                    </span>
								</Item> : null
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
