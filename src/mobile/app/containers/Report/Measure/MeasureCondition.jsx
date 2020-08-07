import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { TextListInput,Checkbox,Amount}from 'app/components'
import { Icon,Container, ScrollView, Row, SinglePicker,ButtonGroup,Button }	from 'app/components'
import { decimal } from 'app/utils'
import thirdParty from 'app/thirdParty'

import MeasureItem from './MeasureItem'

import * as measureActions from 'app/redux/Report/Measure/measure.action.js'

@immutableRenderDecorator
export default
class MeasureCondition extends React.Component {
    componentDidMount() {
        thirdParty.setTitle({title: '测算一下'})
		thirdParty.setIcon({
            showIcon: false
        })
        thirdParty.setRight({ show: false })
    }
    render(){
        const {className,
            incomeTotal,
            dispatch,
            profit={},
            detailList,
            amountInput,
            checkedList,
            showChildList,
            cannotChecked,
            haveSwitchList,
            history,
            cannotTestList,testProfit}=this.props
        return(
            <Container className='measure'>
                <div className='top-test-switch'>
                    <div className='income'>
                        <div>{`若${testProfit?'营业收入':'营业利润'}为`}</div>
                        <div style={{width:'1.5rem',margin: '-4px auto 0'}}>
                            <span style={{fontSize:'0.15rem',fontWeight: 'normal',color:'rgb(34,34,34)'}}>¥</span>
                            <TextListInput
                                className="amountInput"
                                value={`${amountInput}`}
                                onChange={(value)=>{
                                    if(/^(\-|\+)?\d*\.?\d{0,2}$/g.test(value)){
                                        if(value==='-'){
                                            dispatch(measureActions.changeAmountInput('-'))
                                        }else{
                                            if(Number(value)>-10000000 && Number(value)<10000000){
                                                dispatch(measureActions.changeAmountInput(value))
                                            }
                                        }

                                    }
                                }}
                            />
                        </div>
                        {/*<hr style={{width:'.85rem',marginLeft: '.48rem'}}/>*/}
                    </div>
                    <div
                        className='center'
                        onClick={()=>{
                            dispatch(measureActions.changeMeasureTestType())
                    }}>
                        <div>{testProfit?'测利润':'测盈亏'}
                        </div>
                        <div style={{height:'5px',width:'.4rem',marginTop:'-0.26rem',paddingLeft:'.12rem'}}><Icon type='turn-left' style={{fontSize:'.5rem'}}/></div>
                        <div style={{height:'.11rem',color:'rgb(153,153,153)',marginTop:'.25rem'}}>|</div>
                    </div>
                    <div className='profit'>
                        <div>{`则${testProfit?'营业利润':'营业收入'}为`}</div>
                        <div style={{margin: '0 auto '}}>
                            <span style={{fontSize:'0.15rem',fontWeight: 'normal',color:'rgb(153,153,153)'}}>¥</span> ？
                        </div>
                    </div>
                </div>
                <Row className="sheet-line title">
                    <div className="shareOfMonth">本期金额</div>
                    <div className="shareDifference">营收占比</div>
                    <div className="amountOrProportion">金额/占比</div>
                    <div className="itemTobetested">预设数据</div>
                </Row>
                <ScrollView flex='1'>
                    <div className="banner">
                        <div className='banner-title'>营业收入</div>
                        <div className='banner-amount'>
                            <div><Amount>{incomeTotal.monthaccumulation}</Amount></div>
                            <div>{`${decimal(incomeTotal.shareOfMonth*100, 2, true)}%`}</div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    <div className='measure-item'>
                        {detailList.length >0 && detailList.map((item,index)=>{
                            return (
                                <MeasureItem
                                    key={`${index}_${item.linename}`}
                                    item={item}
                                    index={index}
                                    checkedList={checkedList}
                                    dispatch={dispatch}
                                    showChildList={showChildList}
                                    cannotChecked={cannotChecked}
                                    haveSwitchList={haveSwitchList}
                                    cannotTestList={cannotTestList}
                                />
                            )
                        })}
                    </div>
                    <div className="banner">
                        <div className='banner-title'>营业利润</div>
                        <div className='banner-amount'>
                            <div><Amount>{profit.monthaccumulation}</Amount></div>
                            <div>{`${decimal(profit.shareOfMonth*100, 2, true)}%`}</div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </ScrollView>
                <ButtonGroup>
                    <Button onClick={()=>{
                        if(testProfit===true){
                            if(Number(amountInput)<0){
                                thirdParty.toast.info('请输入有效的营业收入金额',1)
                            }else{
                                dispatch(measureActions.startMeasure())
                                dispatch(measureActions.showMeasureResult(true))
                            }
                        }else{
                            if(Number(amountInput)>0){
                                let precentList = detailList.filter(v=>v.testAmount===true)
                                let precent = 0
                                precentList.map((e)=>{
                                    precent = precent+Number(e.testShareOfMonth)
                                })
                                if(precent>100){
                                    thirdParty.toast.info('支出占收入比大于1，与营业利润金额矛盾，请重新设置',1)
                                }else{
                                    dispatch(measureActions.startMeasure())
                                    dispatch(measureActions.showMeasureResult(true))
                                }
                            }else{
                                dispatch(measureActions.startMeasure())
                                dispatch(measureActions.showMeasureResult(true))
                            }
                        }

                    }}>
                        <Icon type="test" size='15'/>测算
                    </Button>
                    <Button
                        onClick={()=>{
                            history.goBack()
                        }}
                    >
                        <Icon type="cancel" size='15'/>取消
                    </Button>
                </ButtonGroup>
            </Container>

        )
    }
}
