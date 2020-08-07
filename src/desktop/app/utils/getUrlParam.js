export default function getUrlParam (url) {
    const post = url.indexOf('?')
	const endPost = url.indexOf('#/') == -1 ? url.length : url.indexOf('#/')
	let serverMessage = url.slice(post+1, endPost).split('&')

	let _urlParam = {}
	for (let i=0; i < serverMessage.length; i++) {
		const valueList = serverMessage[i].split('=')
		_urlParam[valueList[0]] = valueList[1]
	}
	return _urlParam
}
