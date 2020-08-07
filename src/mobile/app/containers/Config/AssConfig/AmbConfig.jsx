import React, { PropTypes } from 'react'
import { Map, fromJS } from 'immutable'
import { connect }	from 'react-redux'
import * as assconfigActions from 'app/redux/Config/Ass/assconfig.action'
import { Switch, Button, ButtonGroup, Container, Form, Row, Icon, Single } from 'app/components'
const Item = Form.Item
import thirdParty from 'app/thirdParty'
import './ass-option.less'

@connect(state => state)
export default
class AmbConfig extends React.Component {

    componentDidMount() {
		thirdParty.setTitle({title: '阿米巴类别设置'})
		thirdParty.setRight({show: false})
		thirdParty.setIcon({
            showIcon: false
        })
		this.props.dispatch(assconfigActions.getAssGetAMB())
	}

	render() {
		const {
            allState,
            dispatch,
            assconfigState,
            history
		} = this.props

        const ambCount = assconfigState.get('ambCount')
        const amAassCategoryList = assconfigState.get('amAassCategoryList')

        const acasslist = allState.get('acasslist')

        const source = acasslist.filter(v => v.get('aclist').some(v => v.get('acid').indexOf('5') === 0)).map(v => {
            return {
                key: v.get('asscategory'),
                value: v.get('asscategory')
            }
        })

		return (
            <Container className="ass-option">
                <Row flex="1">
                    <Single
                        className="info-select"
                        district={source}
                        onOk={(result) => dispatch(assconfigActions.setAssrelateAMB(result.value))}
                    >
                        <div className="info-select-show" style={{borderBottom: '0'}}>
                            <label>
                                默认类别：
                            </label>
                            <span>{amAassCategoryList.get(0)}</span>
                        </div>
                    </Single>
                    <ul className="form-tip">
                        {
                            source.size ?
                            '' :
                            <li className="form-tip-item">
                                提示：<span className="text-underline">当前没有辅助核算类别关联损益类科目，请前往辅助核算设置关联；</span>
                            </li>
                        }
                        <li className="form-tip-item">
                            前提：阿米巴类别必须关联损益类科目；
                        </li>
                        <li className="form-tip-item">
                            可将任一关联类损益类科目的辅助核算类别开通阿米巴功能；
                        </li>
                        <li className="form-tip-item">
                            可更改阿米巴类别。
                        </li>
                    </ul>
                </Row>
                <ButtonGroup type='ghost' height={50}>
                    <Button onClick={() => history.goBack()}><Icon type="cancel"/><span>取消</span></Button>
                    <Button
                        disabled={!amAassCategoryList.size}
                        onClick={() => dispatch(assconfigActions.getAssrelateAMB(amAassCategoryList, history))}
                        >
                        <Icon type="kaitong"/>
                        <span>开通</span>
                    </Button>
                </ButtonGroup>
            </Container>
		)
	}
}
