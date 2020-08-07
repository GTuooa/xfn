import React from 'react'
import { connect }	from 'react-redux'

import { Button, ButtonGroup, Icon, Container, ScrollView } from 'app/components'
import * as thirdParty from 'app/thirdParty'

import * as projectConfActions from 'app/redux/Config/Project/projectConf.action.js'

@connect(state => state)
export default
class ProjectHighType extends React.Component {

    static displayName = 'ProjectHighType'

    componentDidMount() {
        thirdParty.setTitle({title: '类别管理'})
        thirdParty.setIcon({ showIcon: false })
		thirdParty.setRight({ show: false })
    }

    render() {
        const { dispatch, projectConfState, history } = this.props

        const highTypeList = projectConfState.get('highTypeList')

        return(
            <Container className="project-config">
                <ScrollView flex='1' className="border-top">
                    {
                        highTypeList.map((v, i)=> {
                            if (i > 0) {//不展示全部
                                return(
                                    <div
                                        className='config-list-item-wrap-style'
                                        key={v.get('uuid')}
                                        onClick={() => {
                                            dispatch(projectConfActions.changeProjectData(['views', 'highTypeIdx'], i))
                                            history.push('/config/project/projectType')
                                        }}
                                    >
                                        <div className="config-list-item-style">
                                            <span className='config-list-item-info-style'>
                                                {v.get('name')}
                                            </span>
                                            <span className='config-list-item-arrow-style'>
                                                <Icon type="arrow-right" />
                                            </span>
                                        </div>
                                    </div>
                                )
                            }
                        })
                    }
                </ScrollView>
                <ButtonGroup>
                    <Button onClick={() => {
                        history.goBack()
                    }}>
                        <Icon type="cancel"/>
                        <span>返回</span>
                    </Button>
                </ButtonGroup>
            </Container>

        )
    }
}
