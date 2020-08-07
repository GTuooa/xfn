import React, { PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { ROOTURL } from 'app/constants/fetch.constant.js'
import './page.less'

@immutableRenderDecorator
export default
class Page1006 extends React.Component {
    constructor() {
		super()
		this.state = {
			showTel: false,
			showStudy: false
		}
	}
	render() {
        const { showTel, showStudy } = this.state
        const url=`${ROOTURL}/index.html?corpid=${sessionStorage.getItem('corpId')}`
		return (
            <div className='Page'>
                <ul className='main'>
                    <li><img src='https://www.xfannix.com/utils/img/icons/1006.png'/></li>
                    <li>
                        <ul>
                            <li className='code'>您访问的页面未及时着陆...</li>
                            <li className='explain'>
                                <ul>
                                    <li>可能原因：</li>
                                    <li>网络不稳定</li>
                                    <li>向钉钉发送的服务器请求未收到钉钉的回复
                                        <a href={url}>刷新试试</a>
                                    </li>
                                </ul>
                            </li>
                            <li className='choices'>
                                <p>现在，您可以选择:</p>
                                <div className='contact'
                                    onMouseOver={()=>this.setState({'showTel': true})}
                                    onMouseOut= {()=>this.setState({'showTel': false})}>
                                    找客服吐个槽
                                    <ul className='tel' style={{'display':showTel ? '' : 'none'}}>
                                        <li className='triangle'></li>
                                        <li><img className='tel-erweima' src='https://www.xfannix.com/utils/img/icons/csfanfan.png'/></li>
                                        <li>用钉钉扫一扫添加</li>
                                    </ul>
                                </div>
                                <div className='news'
                                    onMouseOver={()=>this.setState({'showStudy': true})}
                                    onMouseOut= {()=>this.setState({'showStudy': false})}>
                                    去学点新东西
                                    <ul className='tel study' style={{'display':showStudy ? '' : 'none'}}>
                                        <li className='triangle'></li>
                                        <li><img src='https://www.xfannix.com/utils/img/icons/gongzhonghao.png'/></li>
                                        <li>用微信扫一扫加入群</li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
                <div className='footer'>
                    <div className='group'>
                        <a href="https://www.xfannix.com/desktop/app/index.html#/">去官网了解更多</a>
                    </div>
                </div>
            </div>
		)
	}
}
