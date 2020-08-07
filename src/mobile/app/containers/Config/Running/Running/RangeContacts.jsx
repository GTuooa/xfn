import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'
import { Icon, Container, Form, ScrollView, Checkbox, Switch, ButtonGroup, Button } from 'app/components'
const { Item } = Form

import * as editRunning from 'app/constants/editRunning.js'
import * as runningConfActions from 'app/redux/Config/Running/runningConf/runningConf.action'

@connect(state => state)
export default
class RangeContacts extends React.Component {

	static displayName = 'RangeContacts'

    render() {
        const { history, dispatch, homeState, runningConfState, } = this.props

        const newJr = homeState.getIn(['data', 'userInfo', 'sobInfo', 'newJr'])

        const runningTemp = runningConfState.get('runningTemp')
        const categoryType = runningTemp.get('categoryType')
        const categoryTypeObj = editRunning.categoryTypeObj[categoryType]
        const contactsRange = runningTemp.getIn([categoryTypeObj,'contactsRange'])
        const contactsManagement = runningTemp.getIn([categoryTypeObj,'contactsManagement'])
        const allContactsRange= runningTemp.getIn([categoryTypeObj,'allContactsRange'])
        const beManagemented = runningTemp.getIn([categoryTypeObj, 'beManagemented'])

        const showContacts = (contactsManagement && newJr) || (!newJr && beManagemented)//是否开启往来

        return(
            <Container className='accountConfig-modal'>
                <ScrollView flex="1">
                    <Form>
                        <Item label='往来管理'>
                            <span className='noTextSwitch'>
                                <Switch
                                    checked={newJr ? contactsManagement : beManagemented}
					    	    	onClick={()=> {
                                        if (newJr) {
                                            dispatch(runningConfActions.changeRunningTemp([categoryTypeObj, 'contactsManagement'], !contactsManagement))
                                            if (!contactsManagement) {
                                                dispatch(runningConfActions.changeRunningTemp([categoryTypeObj, 'contactsRange',0], allContactsRange.getIn([0,'uuid'])))
                                            }
                                        } else {//老流水
                                            dispatch(runningConfActions.changeRunningTemp([categoryTypeObj, 'beManagemented'], !beManagemented))
                                        }
					    	    		
					    	    	}}
					    	    />
                            </span>
					    </Item>

                        {showContacts ? <div className="config-form-sub-title">往来范围</div> : null}

                        {
                            showContacts && allContactsRange.map((v, i) => {
                                const uuid = v.get('uuid')
                                return (
                                    <Item
                                        label={v.get('name')}
                                        key={uuid}
                                        onClick={() => {
                                            let valueArr = contactsRange
                                            if (contactsRange.includes(uuid)) {
                                                const idx = contactsRange.findIndex(v => v==uuid)
                                                valueArr = contactsRange.delete(idx)
                                            } else {
                                                valueArr = contactsRange.push(uuid)
                                            }
                                            dispatch(runningConfActions.changeRunningTemp([categoryTypeObj, 'contactsRange'], fromJS(valueArr)))

                                        }}>
                                           <Checkbox
                                                checked={contactsRange.includes(uuid)}
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
