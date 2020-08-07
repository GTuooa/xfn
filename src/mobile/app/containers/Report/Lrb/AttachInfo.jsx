import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import XfnIcon from 'app/components/Icon'
@immutableRenderDecorator
export default
class AttachInfo extends React.Component {
    render(){
        const {className,extraMessage,history}=this.props
        return (
            <div className={className}>
                <div className='acctach-info-title'>
                    <div>附加信息</div>
                    <div
                        style={{color:'rgb(94,129,209)'}}
                        onClick={()=>{
                            history.push('/extraInformation')
                        }}
                    >
                        设置<XfnIcon type='arrow-right'/>
                    </div>
                </div>
                <div className='acctach-info-content'>
                    {extraMessage.size>0 && extraMessage.map((item)=>
                        <div className='acctach-info-content-item'>
                            {`${item.get('extraName')}：${item.get('extraValue')}${item.get('unit')}`}
                        </div>
                    )}
                </div>
            </div>
        )
    }

}
