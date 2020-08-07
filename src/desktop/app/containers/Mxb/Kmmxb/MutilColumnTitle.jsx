import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Tooltip} from 'antd'
import { Icon } from 'app/components'
import * as kmmxbActions from 'app/redux/Mxb/Kmmxb/kmmxb.action.js'
@immutableRenderDecorator
export default
class MutilColumnTitle extends React.Component {

    render(){
        const { dispatch, className, showMoreColumn, title, maxColumnCount, changeShowMoreColumn }=this.props

        return(
            <div className="table-title-wrap">
                {showMoreColumn ?
                    <ul className={"table-title"}>
                        <li style={{minWidth: '76px',maxWidth: '76px',flex: '76'}}>日期</li>
                        <li style={{minWidth: '80px',maxWidth: '80px',flex: '80'}}>凭证字号</li>
                        <li style={{minWidth: `${782-70*title.length}px`,maxWidth:`${1422-110*title.length}px`,flex:`${1422-110*title.length}`}}>摘要</li>
                        {title.slice(0,maxColumnCount-1).map((v, i) => <li key={i+1} style={{minWidth: '70px',maxWidth: '110px',flex: '110'}}><Tooltip title={v}><span>{v}</span></Tooltip></li>)}
                        {title.slice(maxColumnCount-1).map((v, i) =>
                            <li onClick={()=>{
                                    changeShowMoreColumn(false)
                                }}
                                key={i}
                                style={{minWidth: '70px',maxWidth: '110px',flex: '110'}}
                                className='kmmxb-table-show'
                            >
                                <Tooltip title={v}>
                                {i === 0 && <div className='kmmxb-table-show-left'><Icon type="caret-right"/></div>}
                                {v}
                                {i === title.length-maxColumnCount && <div className='kmmxb-table-show-right'><Icon type="caret-left"/></div>}
                                </Tooltip>
                            </li>
                        )}
                        <li style={{minWidth: '32px',maxWidth: '32px',flex: '32'}}>方向</li>
                        <li style={{minWidth: '110px',maxWidth: '110px',flex: '110'}}>余额</li>
                    </ul>
                    :
                    title.length > maxColumnCount ?
                        <ul className={ "table-title"}>
                            <li style={{minWidth: '76px',maxWidth: '76px',flex: '76'}}>日期</li>
                            <li style={{minWidth: '80px',maxWidth: '80px',flex: '80'}}>凭证字号</li>
                            <li style={{minWidth: `${782-70*maxColumnCount}px`,maxWidth:`${1422-110*maxColumnCount}px`,flex:`${1422-110*maxColumnCount}`}}>摘要</li>
                            {title.slice(0,maxColumnCount-1).map((v, i) => <li key={i+1} style={{minWidth: '70px',maxWidth: '110px',flex: '110'}}><Tooltip title={v}><span>{v}</span></Tooltip></li>)}
                            <li className='kmmxb-table-show'
                                onClick={()=>{
                                    changeShowMoreColumn(true)
                                }}
                            >
                                <div className='kmmxb-table-show-left'><Icon type="caret-left"/></div>
                                    其他
                                <div className='kmmxb-table-show-right'><Icon type="caret-right"/></div>
                            </li>
                            <li style={{minWidth: '32px',maxWidth: '32px',flex: '32'}}>方向</li>
                            <li style={{minWidth: '110px',maxWidth: '110px',flex: '110'}}>余额</li>
                        </ul>:
                        <ul className={"table-title"}>
                            <li style={{minWidth: '76px',maxWidth: '76px',flex: '76'}}>日期</li>
                            <li style={{minWidth: '80px',maxWidth: '80px',flex: '80'}}>凭证字号</li>
                            <li style={{minWidth: `${782-70*title.length}px`,maxWidth:`${1422-110*title.length}px`,flex:`${1422-110*title.length}`}}>摘要</li>
                            {title.map((v, i) => <li key={i+1} style={{minWidth: '70px',maxWidth: '110px',flex: '110'}}><Tooltip title={v}><span>{v}</span></Tooltip></li>)}
                            <li style={{minWidth: '32px',maxWidth: '32px',flex: '32'}}>方向</li>
                            <li style={{minWidth: '110px',maxWidth: '110px',flex: '110'}}>余额</li>
                        </ul>

            }
            </div>
        )
    }
}
