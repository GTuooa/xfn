import React from 'react'
import { ROOT, ROOTURL } from 'app/constants/fetch.constant.js'

export default
class BrowserIndex extends React.Component {

	componentDidMount() {
		const href = location.href

		const urlParam = this.getUrlParam(href)
		// const start = href.indexOf('?')
		// let serverMessage = location.href.slice(start+1).split('&')
		// const corpId = serverMessage[1] ? serverMessage[1].slice(7) : ''
		// const code = serverMessage[2] ? serverMessage[2].slice(5) : ''
		const corpId = urlParam.corpid
		const code = urlParam.code

		if (corpId) {
			localStorage.setItem('userCode', code)
			global.isInWeb = 'true'
			// window.location.replace(`${ROOTURL}/index.html?isOV=false&corpid=${corpId}&isInWeb=true`)
			// window.location.href = `http://localhost:3800/build/desktop/index.html#/?isOV=false&corpid=${corpId}&isInWeb=true`
			// window.open(`http://localhost:3800/build/desktop/index.html#/?isOV=false&corpid=${corpId}&isInWeb=true`)
			// url: `${ROOTURL}/index.html?isOV=false&corpid=${sessionStorage.getItem('corpId')}&isInWeb=true`
			// action={`${ROOTURL}/index.html`}

			const userForm = this.refs['userInfoForm']
			
			userForm.submit()
		}
	}

	getUrlParam (url) {

		const post = url.indexOf('?')
		// const endPost = url.length
		let serverMessage = url.slice(post+1).split('&')
	
		let _urlParam = {}
		for (let i=0; i < serverMessage.length; i++) {
			const valueList = serverMessage[i].split('=')
			_urlParam[valueList[0]] = valueList[1]
		}
		return _urlParam
	}

	render() {

		const href = location.href

		const urlParam = this.getUrlParam(href)
		const corpId = urlParam.corpid
		const urlbackup = urlParam.urlbackup ? urlParam.urlbackup : 'false'

		if (corpId) {
			return (
				<div>
					<span>正在跳转</span>
						<form
							ref="userInfoForm"
							id="userInfoForm"
							name="userInfoForm"
							// action={`http://localhost:3800/build/desktop/index.html`}
							action={`${ROOTURL}/index.html`}
							method="GET"
						>
						<input type="hidden" id="isOV" name="isOV" value={'false'} />
						<input type="hidden" id="corpid" name="corpid" value={`${corpId}`} />
						<input type="hidden" id="isInWeb" name="isInWeb" value={'true'} />
						<input type="hidden" id="urlbackup" name="urlbackup" value={urlbackup} />
					</form>
				</div>
			)
		} else {
			return (
				<div>没能成功着陆</div>
			)
		}
	}
}