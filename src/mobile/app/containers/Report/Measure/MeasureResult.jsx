import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Icon,Container,ButtonGroup,Button,ScrollView }	from 'app/components'
import MeasurePieChar from './MeasurePieChar'
import MeasureResultList from './MeasureResultList'
import * as measureActions from 'app/redux/Report/Measure/measure.action.js'
import thirdParty from 'app/thirdParty'
@immutableRenderDecorator
export default
class MeasureItem extends React.Component {
    componentDidMount() {
        thirdParty.setTitle({title: '测算结果'})
		thirdParty.setIcon({
            showIcon: false
        })
        thirdParty.setRight({ show: false })
    }
    render(){
        const {dispatch,testProfit,profitResult,ProfitAndLossResult,resultList,incomeTotal,profit,resultListShowChildList}=this.props
        let backgroundImg=''
        if(profitResult===0){
            backgroundImg='profit0'
        }else if(profitResult>0){
            backgroundImg='profit'
        }else if(profitResult<0){
            backgroundImg='loss'
        }
        return(
            <Container className='measure'>
                <div className='result-banner'>
                    <div className={`result-banner-left ${profitResult===0 ?'breakeven':'income'}`}>
                        <div style={{marginLeft:'.25rem',marginTop:'.2rem',fontSize:'.13rem'}}>若营业收入为</div>
                        <div style={{marginLeft:'.25rem',fontSize:'.16rem',fontWeight:'bold'}}>¥ {ProfitAndLossResult.toFixed(2)}</div>
                    </div>
                    <div className={`result-banner-right ${backgroundImg}`}>
                        <div style={{marginLeft:'.25rem',marginTop:'.2rem',fontSize:'.13rem'}}>则营业利润为</div>
                        <div style={{marginLeft:'.25rem',fontSize:'.16rem',fontWeight:'bold'}}>¥ {profitResult.toFixed(2)}</div>
                    </div>
                </div>
                <ScrollView flex='1'>
                    <MeasurePieChar
                        resultList={resultList}
                        profitResult={profitResult}
                        ProfitAndLossResult={ProfitAndLossResult}
                        incomeTotal={incomeTotal}
                        profit={profit}
                    />
                    <MeasureResultList
                        resultList={resultList}
                        testProfit={testProfit}
                        profitResult={profitResult}
                        ProfitAndLossResult={ProfitAndLossResult}
                        incomeTotal={incomeTotal}
                        profit={profit}
                        dispatch={dispatch}
                        resultListShowChildList={resultListShowChildList}
                    />
                </ScrollView>
                <ButtonGroup>
                    <Button
                        onClick={()=>{
                            dispatch(measureActions.showMeasureResult(false))
                            dispatch(measureActions.clearMeasureResultShowChildList())
                        }}
                    >
                        <Icon type="adjustment" size='15'/>修改
                    </Button>
                </ButtonGroup>
            </Container>
        )
    }
}
