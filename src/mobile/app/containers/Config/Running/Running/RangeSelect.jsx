import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Radio, Icon, Container, Row, Form, ScrollView, Checkbox, ButtonGroup, Button } from 'app/components'
import * as thirdParty from 'app/thirdParty'
const {
	Label,
	Control,
	Item
} = Form

@connect(state => state)
export default
class RangeSelect extends React.Component {

	static displayName = 'RangeSelect'

    render() {
        const {
            history,
            dispatch,
            runningConfState,
        } = this.props

        const rangeSelectTitle = runningConfState.getIn(['views', 'rangeSelectTitle'])
        const rangeSelectGroup = runningConfState.getIn(['views', 'rangeSelectGroup'])
        const groupData = runningConfState.getIn(['views', 'groupData'])

        return(
            <Container className='accountConfig-modal'>
                <ScrollView flex="1">
                    <Form>
                        <div className='check-title'>
                            {rangeSelectTitle}
                        </div>
                        {
                            rangeSelectGroup.map(v =>
								v.get('hide') ? '' :
                                <Item
                                    key={v.get('name')}
                                    label={v.get('name')}
                                    key={v.get('value')}
                                    onClick={() => {
                                        if (v.get('disabled')) {
                                            return thirdParty.toast.info(v.get('disabledToast'), 2)
                                        } else {
                                            const bool = groupData.indexOf(v.get('value')) > -1
                                            v.get('onClick')(!bool)
                                        }
                                    }}
                                >
                                    <span>
                                        <Checkbox
                                            checked={groupData.indexOf(v.get('value')) > -1}
                                            disabled={v.get('disabled')}
                                            disabledToast={v.get('disabledToast')}
                                            onChange={(e)=> {}}
                                        />
                                    </span>
                                </Item>
                            )
                        }
                    </Form>
                </ScrollView>
                <ButtonGroup height={50}>
                    <Button onClick={() => {
                        history.goBack()
                    }}>
                        <Icon type="cancel"/><span>确定</span>
                    </Button>
                </ButtonGroup>
            </Container>
        )
    }
}
