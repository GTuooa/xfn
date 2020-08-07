import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Map, fromJS } from 'immutable'
import { connect }	from 'react-redux'

import { homeActions } from 'app/redux/Home/home.js'
import * as allActions from 'app/redux/Home/All/other.action'
// import * as sobConfigActions from 'app/redux/Config/Sob/sobConfig.action'
import { Button, ButtonGroup, Container, ScrollView, ExperienceModal } from 'app/components'
import { ROOTURL } from 'app/constants/fetch.constant.js'
import * as thirdParty from 'app/thirdParty/dingding'
import './index.less'

@connect(state => state)
export default
class SobWelcome extends React.Component {

	constructor() {
		super()
		this.state = {
			// imgOnload: false,
			experientialModal: false,
		}
	}
	componentDidMount() {
		thirdParty.setTitle({
			title: '小番财务'
		})
		thirdParty.setRight({show: false})
		// const imgcontainer = ReactDOM.findDOMNode(this.refs['imgcontainer']);
		// sessionStorage.setItem("firstload", "first")

		// if (sessionStorage.getItem("toSecurity") === 'welcome') {
		// 	this.props.history.push('/config/security/index')
		// }
	}
	render() {
		const {
			sobConfigState,
			homeState,
			dispatch,
			history
		} = this.props
		const { experientialModal } = this.state

		const isddAdmin = homeState.getIn(['data', 'userInfo', 'isAdmin']) === 'TRUE' || homeState.getIn(['data', 'userInfo', 'isFinance']) === 'TRUE' || homeState.getIn(['data', 'userInfo', 'isDdAdmin']) === 'TRUE' || homeState.getIn(['data', 'userInfo', 'isDdPriAdmin']) === 'TRUE'

		const moduleInfo = homeState.getIn(['data', 'userInfo', 'moduleInfo'])
		const GLCanUse = moduleInfo.get('GL') && moduleInfo.get('GL') === true ? true : false

		const moduleList = homeState.get('moduleList')

		const authorityImgUrl = 'https://www.xfannix.com/utils/img/guide/guide_authority_complete.png' // 无账套引导全
		const authorityImgUrlInter = 'https://xfn-ddy-website.oss-cn-hangzhou-internal.aliyuncs.com/utils/img/guide/guide_authority_complete.png' // 无账套引导全
		const authoritySorryImgUrl = 'https://www.xfannix.com/utils/img/guide/guide_authority_sorry.png'  // 无账套引导上半
		const authorityContentImgUrl = 'https://www.xfannix.com/utils/img/guide/guide_authority_content.png' // 无账套引导下半

		const adminList = homeState.getIn(['adminNameList', 'adminList'])

		// const sobConfigMode = sobConfigState.get('sobConfigMode')
		// const selectedSob = sobConfigState.get('tempSob')
		// const template = selectedSob.get('template')
		// const username = homeState.getIn(['data', 'userInfo', 'sobInfo', 'sobName'])
		// const demonstrationSobName = `${username}的演示账套`
		// const peanutsSobName = `${username}的账套`
		// const demonstrationSobName = username.length > 15 ? `${username.substr(0, 13)}...演示账套` : `${username}的演示账套`
		// const peanutsSobName = username.length > 17 ? `${username.substr(0, 15)}...账套` : `${username}的账套`


		// const demonstrationTemplate = '2'
		// const peanutsTemplate = '1'

		// const showSobName = username.length > 3 ? `${username.substr(0, 3)}...演示账套` : `${username}的演示账套`

		return (
		    <Container className="sob-welcome-wrap">
		        <ScrollView flex="1">
		            <div className="sob-welcome-img">
		                <img src={authoritySorryImgUrl}/>
		            </div>
		            <div className="sob-welcome-text-wrap">
		                <div>
		                    <span className="sob-welcome-text-bold">抱歉,&nbsp;</span>
		                    <span>当前您名下暂无账套，</span>
		                </div>
		                <div>
		                    <span>请联系{adminList.slice(0, 5).join('、')}设置</span>
		                </div>
		            </div>
		            <div className="sob-welcome-img">
		                <img src={authorityContentImgUrl}/>
		            </div>
		            {/* <div className="sob-welcome-img">
		                <img src='http://fannixwebsite.hz.taeapp.com/xfn/manual/mobile/images/00/1.png'/>
		            </div>
		            <div className="sob-welcome-img">
		                <img src='http://fannixwebsite.hz.taeapp.com/xfn/manual/mobile/images/00/2.png'/>
		            </div>
		            <div className="sob-welcome-img">
		                <img src='http://fannixwebsite.hz.taeapp.com/xfn/manual/mobile/images/00/3.png'/>
		            </div>
		            <div className="sob-welcome-img">
		                <img onLoad={() => this.setState({imgOnload: true})} src='http://fannixwebsite.hz.taeapp.com/xfn/manual/mobile/images/00/4.png'/>
		            </div> */}
		            {/* <div className="sob-welcome-sobitem">
		                <span className="sob-welcome-sobitem-first">{imgOnload ? '账套名称：' + showSobName : ''} </span>
		            </div> */}
		        </ScrollView>
		        <ButtonGroup height={50}>
		            {/* <Button style={{color: '#38acff'}} onClick={() => {
		                if (GLCanUse) {
		                    if (isddAdmin) {
		                        // history.push('/config/sob/option')
		                        dispatch(sobConfigActions.beforeHomeInsertOrModifySob(history))
		                    } else {
		                        thirdParty.toast.info('联系钉钉管理员或财务负责人创建账套')
		                    }
		                } else {
		                    thirdParty.toast.info('总账已到期，不能创建账套')
		                }
		            }}>创建账套</Button> */}
					<Button
						onClick={() => {
							dispatch(allActions.sendGuideImage(authorityImgUrlInter))
						}}
					>
						保存图片
					</Button>
		            <Button style={{color: '#38acff'}} onClick={() => {
						dispatch(homeActions.getPlaySobModelList())
		                this.setState({experientialModal:true})
						// thirdParty.openLink({
	                    //     url: `${ROOTURL}/index.html?dd_nav_bgcolor=FFFFFFFF&isOV=false&isplayground=true#/`,
	                    //     onSuccess : function(result) {},
	                    //     onFail : function(err) {}
	                    // })
		            }}>体验模式</Button>
		            {/* <Button style={{color: '#38acff'}}>保存图片</Button> */}
		        </ButtonGroup>
		        {/* <ButtonGroup height={50}>
		            <Button style={{color: '#38acff'}} onClick={() => dispatch(allActions.enterFirstSobFetch(peanutsSobName, peanutsTemplate))}>创建新账套</Button>
		            <Button onClick={() => dispatch(allActions.enterFirstSobFetch(demonstrationSobName, demonstrationTemplate))}>进入演示账套</Button>
		        </ButtonGroup> */}
		        <ExperienceModal
		            experientialModal={experientialModal}
					moduleList={moduleList}
		            closeModal={() => {
		                this.setState({experientialModal:false})
		            }}
					chooseSomeModal={(type, item) => {
						this.setState({experientialModal:false})
						history.goBack()
						dispatch(homeActions.changeLoginGuideString('firstToWelcome', false))
						dispatch(homeActions.enterPleasureGround(history, '', type, item))
					}}
		            // chooseSmart={() => {
		            //     this.setState({experientialModal:false})
					// 	console.log('chooseSmart');
		            //     dispatch(homeActions.enterPleasureGround(history,'welcome','SMART_DEMO'))
		            // }}
		            // chooseAccount={() => {
		            //     this.setState({experientialModal:false})
					// 	console.log('chooseAccount');
		            //     dispatch(homeActions.enterPleasureGround(history,'welcome','ACCOUNTING_DEMO'))
		            // }}
		        />
		    </Container>
		)
	}
}
