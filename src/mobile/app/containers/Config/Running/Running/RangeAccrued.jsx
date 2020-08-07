import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'
import { Icon, Container, Form, ScrollView, Switch, ButtonGroup, Button } from 'app/components'
const { Item } = Form

import * as runningConfActions from 'app/redux/Config/Running/runningConf/runningConf.action'
import * as editRunning from 'app/constants/editRunning.js'

@connect(state => state)
export default
class RangeAccrued extends React.Component {

	static displayName = 'RangeAccrued'

    render() {
        const { history, dispatch, runningConfState, } = this.props

        const runningTemp = runningConfState.get('runningTemp')
        const categoryType = runningTemp.get('categoryType')
        const categoryTypeObj = editRunning.categoryTypeObj[categoryType]

        const beAccrued = runningTemp.getIn([categoryTypeObj, 'beAccrued'])
        const propertyTax = runningTemp.get('propertyTax')
        const beReduce = runningTemp.getIn([categoryTypeObj, 'beReduce'])
        const insertOrModify = runningConfState.getIn(['views', 'insertOrModify'])
        const currentReduce = runningTemp.getIn([categoryTypeObj, 'currentReduce'])
        const canReduce = runningTemp.getIn([categoryTypeObj, 'canReduce'])
        const level = runningTemp.get('level')

        return(
            <Container className='accountConfig-modal'>
                <ScrollView flex="1">
                    <Form>
                        <Item label='计提税费'>
                            <span className='noTextSwitch'>
                                <Switch
                                    checked={beAccrued}
									onClick={()=> {
										dispatch(runningConfActions.changeRunningTemp([categoryTypeObj, 'beAccrued'], !beAccrued))
									}}
                                />
                            </span>
                        </Item>
							
						{
							categoryType === 'LB_SFZC' && (propertyTax ==='SX_ZZS' || (['SX_QYSDS', 'SX_QTSF'].includes(propertyTax) && beAccrued)) ?
							<Item label='税费减免：' className='m-top noTextSwitch'>
								<Switch
									checked={beReduce}
									onClick={()=> {
										dispatch(runningConfActions.changeRunningTemp([categoryTypeObj, 'beReduce'], !beReduce))
									}}
									disabled={(insertOrModify == 'insert' && !currentReduce|| insertOrModify == 'modify' && !canReduce) && level !== 1 }
									disabledToast={'上级未启用'}
								/>
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
