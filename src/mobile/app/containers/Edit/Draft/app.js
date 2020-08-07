import React, { PropTypes } from 'react'
import { connect }	from 'react-redux'
import { fromJS } from 'immutable'

import { Button, ButtonGroup, Icon, Container, Row, ScrollView, TextInput, SinglePicker } from 'app/components'
import * as thirdParty from 'app/thirdParty'

import * as draftActions from 'app/redux/Edit/Draft/draft.action.js'
import DraftItem from './DraftItem.jsx'
import './draft.less'

@connect(state => state)
export default
class Draft extends React.Component {
    componentDidMount() {
        thirdParty.setTitle({title: '草稿箱'})
        thirdParty.setIcon({
            showIcon: false
        })
        thirdParty.setRight({show: false})
        if (sessionStorage.getItem('enterDraft') === 'draft') {
            this.props.dispatch(draftActions.getDraftListFetch('全部'))
            sessionStorage.removeItem('enterDraft')
        }

    }

	render() {
		const {
            draftState,
			dispatch,
            history
		} = this.props

        thirdParty.setTitle({title: '草稿箱'})
        const selectDraft = fromJS(['全部','未锁定','已锁定'])

        const selectDraftType = draftState.getIn(['flags', 'selectDraftType'])
        const searchValue = draftState.getIn(['flags', 'searchValue'])
        const draftList = draftState.get('draftList')
        let draftKeyList = []
		draftState.get('draftList').map((u,i) => {
			draftKeyList.push(u.get('vckey'))
		})

        const select = selectDraft && selectDraft.map((u, j) => ({
            key: u,
            value: u
        }))

		return (
			<Container className="draft">
                <Row className="draft-select">
                    <SinglePicker
                        className="draft-select-select"
                        district={select}
                        onOk={(result) => {
                            dispatch(draftActions.getDraftListFetch(result.value))
                        }}
                    >
                        <div className="draft-select-select">
                            <span className="draft-select-select-text">{selectDraftType}</span>
                            <Icon className="draft-select-select-trangle" type="triangle" size='10'/>
                        </div>
                    </SinglePicker>
                    <div className="draft-select-inputwrap">
                        <Icon className="draft-select-icon" type="search"/>
                        <TextInput
                            className="draft-select-input"
                            placeholder="搜索草稿..."
                            value={searchValue}
                            onChange={value => dispatch(draftActions.searchDraftItem(value))}
                        />
                    </div>
                </Row>
                <ScrollView flex="1" uniqueKey="draft-scroll" savePosition>
                    {
						draftList.map((u,i) => {
							return <DraftItem
								key={i}
								idx={i}
								draftItem={u}
								dispatch={dispatch}
                                draftKeyList={draftKeyList}
                                history={history}
							/>
						})
					}
				</ScrollView>

			</Container>
		)
	}
}
