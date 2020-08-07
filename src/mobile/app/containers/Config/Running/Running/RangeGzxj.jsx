import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'
import { Icon, Container, Form, ScrollView, Checkbox, Switch, ButtonGroup, Button } from 'app/components'
const { Item } = Form

import * as thirdParty from 'app/thirdParty'
import * as editRunning from 'app/constants/editRunning.js'
import * as runningConfActions from 'app/redux/Config/Running/runningConf/runningConf.action'

@connect(state => state)
export default
class RangeGzxj extends React.Component {

	static displayName = 'RangeGzxj'

    render() {
        const { history, dispatch, runningConfState, } = this.props

        const insertOrModify = runningConfState.getIn(['views','insertOrModify'])

        const runningTemp = runningConfState.get('runningTemp')
        const categoryType = runningTemp.get('categoryType')
        const categoryTypeObj = editRunning.categoryTypeObj[categoryType]

        const beAccrued = runningTemp.getIn([categoryTypeObj, 'beAccrued'])
        const beWithholding = runningTemp.getIn(['acPayment', 'beWithholding'])
        const canWithHoldFund = runningTemp.getIn(['acPayment', 'canWithHoldFund'])
        const canWithHoldSocial = runningTemp.getIn(['acPayment', 'canWithHoldSocial'])
        const beWithholdSocial = runningTemp.getIn(['acPayment', 'beWithholdSocial'])
        const beWithholdTax = runningTemp.getIn(['acPayment', 'beWithholdTax'])
        const canHoldFund = runningTemp.getIn(['acPayment', 'canHoldFund'])
        const canHoldSocial = runningTemp.getIn(['acPayment', 'canHoldSocial'])
        const canHoldTax = runningTemp.getIn(['acPayment', 'canHoldTax'])
        const currentFund = runningTemp.getIn(['acPayment', 'currentFund'])
        const currentSocial = runningTemp.getIn(['acPayment', 'currentSocial'])
        const currentTax = runningTemp.getIn(['acPayment', 'currentTax'])
        const level = runningTemp.get('level')

        let checkList = []
		if (beWithholding) {
			checkList.push('beWithholding')
		}
		if (beWithholdSocial) {
			checkList.push('beWithholdSocial')
		}
		if (beWithholdTax) {
			checkList.push('beWithholdTax')
		}

        const checkGroup = [
            {
                key:'个人公积金',
                value:'beWithholding',
                disabled:!canWithHoldFund || (insertOrModify == 'insert' && !currentFund || insertOrModify == 'modify' && !canHoldFund) || level === 1,
                disabledToast:`${!canWithHoldFund?'工资薪金未启用':'上级未启用'}`,
                checked: checkList.includes('beWithholding'),
            },
            {
                key:'个人社保',
                value:'beWithholdSocial',
                disabled:!canWithHoldSocial || (insertOrModify == 'insert' && !currentSocial || insertOrModify == 'modify' && !canHoldSocial) || level === 1,
                disabledToast:`${!canWithHoldSocial?'工资薪金未启用':'上级未启用'}`,
                checked: checkList.includes('beWithholdSocial'),
                
            },
            {
                key:'个人税费',
                value:'beWithholdTax',
                disabled:(insertOrModify == 'insert' && !currentTax || insertOrModify == 'modify' && !canHoldTax) || level === 1,
                disabledToast:'上级未启用',
                checked: checkList.includes('beWithholdTax'),
            },
        ]

        

        return(
            <Container className='accountConfig-modal'>
                <ScrollView flex="1">
                    <Form>
                        <Item label='计提工资薪金' className='noTextSwitch'>
                        <Switch
                                checked={beAccrued}
                                onClick={()=> {
                                    dispatch(runningConfActions.changeRunningTemp([categoryTypeObj, 'beAccrued'], !beAccrued))
                                }}
                            />
					    </Item>

                        {beAccrued ? <div className="config-form-sub-title">代扣款项</div> : null}

                        {
                            beAccrued && checkGroup.map((v, i) => {
                                const value = v['value']
                                const key = v['key']
                                return (
                                    <Item
                                        label={v['key']}
                                        key={value}
                                        onClick={() => {
                                            if (v['disabled']) {
                                                return thirdParty.toast.info(v['disabledToast'], 1)
                                            }
                                            dispatch(runningConfActions.changeXczcCardCheckboxArr(['runningTemp', 'acPayment', value], !v['checked'], value))
                                           

                                        }}>
                                            <Checkbox
                                                disabled={v['disabled']}
                                                checked={checkList.includes(value)}
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
