import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import * as thirdParty from 'app/thirdParty'
import { ROOTURL } from 'app/constants/fetch.constant.js'
import './page.less'

@connect(state => state)
export default
class Page extends React.Component {
    componentDidMount() {
        thirdParty.setTitle({
            title: '小番财务'
        })
        thirdParty.setIcon({
            showIcon: false
        })
        thirdParty.setRight({show: false})

        sessionStorage.setItem("firstload", "first")
    }

    render() {
        const url=`${ROOTURL}/index.html?corpid=${sessionStorage.getItem('corpId')}`
        return (
            <div className='Page'>
                <ul className='main'>
                    <li className='img'><img src="https://www.xfannix.com/utils/img/icons/1006.png"/></li>
                    <li className='code'>您访问的页面未及时着陆<span></span></li>
                    <li>
                        <ul className='reason'>
                            <li>可能原因：</li>
                            <li>网络不稳定</li>
                            <li>向钉钉发送的服务器请求未收到钉钉回复
                                <a href={url}>刷新试试</a>
                            </li>
                        </ul>
                        <ul className="choices">
                            <li>现在，您可以选择：</li>
                            <li>
                                <ul className='erCode'>
                                    <li>
                                        <img src="https://www.xfannix.com/utils/img/icons/csfanfan.png"/>
                                        <p>找客服吐个槽</p>
                                        <p>(长按用钉钉识别)</p>
                                    </li>
                                    <li>
                                        <img src="https://www.xfannix.com/utils/img/icons/gongzhonghao.png"/>
                                        <p>去公众号看看</p>
                                        <p>(保存后微信识别)</p>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
                <footer onClick={()=>{
                    thirdParty.openLink({
                        url: 'https://www.xfannix.com/mobile/app/index.html#/',
                        onSuccess : function(result) {},
                        onFail : function(err) {}
                    })
                }}>
                    <a onClick={() => {

                    }}>去官网了解更多</a>
                </footer>
            </div>
		)
	}
}
