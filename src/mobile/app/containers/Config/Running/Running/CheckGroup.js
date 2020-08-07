import React from 'react'
import { toJS, fromJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
// import * as accountConfigActions from 'app/redux/Config/AccountConfig/accountconfig.action'
import { Radio, Icon, Container, Row, Form, ScrollView, Checkbox, ButtonGroup, Button } from 'app/components'
import * as thirdParty from 'app/thirdParty'
const {
	Label,
	Control,
	Item
} = Form

@immutableRenderDecorator
export default
class CheckGroup extends React.Component {

	static displayName = 'CheckGroup'

    state = {
        groupData:this.props.groupData
    }
    componentWillReceiveProps(nextprops) {
        this.setState({groupData:nextprops.groupData})
    }
    render() {
        const {
            title,
            checkGroup,
            callback,
            checkPlace,
            dispatch,
			groupData,
        } = this.props
        // const { groupData } = this.state
        return(
            <Container className='accountConfig-modal'>
                <ScrollView flex="1">
                    <Form>
                        <div className='check-title'>
                            {title}
                        </div>
                        {
                            checkGroup.map(v =>
								v.get('hide')?
								''
								:
                                <Item label={v.get('name')} key={v.get('value')}>
                                    <span>
                                        <Checkbox
                                            checked={groupData.indexOf(v.get('value')) > -1}
                                            disabled={v.get('disabled')}
                                            disabledToast={v.get('disabledToast')}
                                            onChange={(e)=> {
												v.get('onClick')(e)
                                                // e.target.checked?
                                                // this.setState({groupData:groupData.push(v.get('value'))})
                                                // :
                                                // this.setState({groupData:groupData.filter(w => w !== v.get('value'))})
                                            }}
                                        />
                                    </span>

                                </Item>
                            )
                        }

                    </Form>
                </ScrollView>
                <ButtonGroup height={50}>
                    <Button onClick={() => {
                        // dispatch(accountConfigActions.changeAccountConfCommonString('running',checkPlace,groupData))
                        callback()
                    }}>
                        <Icon type="cancel"/><span>确定</span>
                    </Button>
                </ButtonGroup>
            </Container>
        )
    }
}
