// import dd from 'dd';
//
// export default {
// 	alert,
// 	setTitle,
// 	config,
// 	error,
// 	ready,
// 	webViewBounceDisable,
// 	requestAuthCode,
// 	preload,
// 	go,
// 	setNavigationRight,
// 	datepicker,
// 	chosen,
// 	choose,
// 	modal,
// 	close,
// 	showPreloader,
// 	hidePreloader,
// 	confirm,
// 	toast,
// 	actionSheet,
// 	setIcon,
// 	prompt,
// 	setRight,
// 	httpOverLwp,
// 	setMenu,
// 	requestOperateAuthCode,
// 	openLink,
// 	pay,
// 	uploadImage,
// 	previewImage
// }
//
// export function config(conf) {
// 	dd.config({
// 		...conf,
// 		jsApiList: [
// 			'runtime.permission.requestAuthCode',//此api 必须加入jsApiList 否则报错404: “API NOT EXIST”
// 			'ui.webViewBounce.disable',
// 			'device.notification.alert',
// 			'biz.navigation.setTitle',
// 			'ui.nav.preload',
// 			'ui.nav.go',
//
// 			'runtime.permission.requestOperateAuthCode',
// 			'biz.util.openSlidePanel',
// 			'biz.navigation.quit',
// 			'biz.contact.choose',
//
// 			'biz.util.chosen',
// 			'biz.util.datepicker',
// 			'biz.navigation.setTitle',
// 			'biz.navigation.close',
//
// 			'ui.webViewBounce.disable',
// 			'device.notification.modal',
//
// 			'device.notification.showPreloader',
// 			'device.notification.hidePreloader',
// 			'device.notification.alert',
// 			'device.notification.confirm',
// 			'device.notification.toast',
// 			'device.notification.actionSheet',
// 			'biz.navigation.setIcon',
// 			'device.notification.prompt',
// 			'biz.navigation.setRight',
// 			'service.request.httpOverLwp',
// 			'biz.navigation.setMenu',
// 			'runtime.permission.requestOperateAuthCode',
// 			'biz.util.openLink',
// 			'biz.alipay.pay',
// 			'biz.util.uploadImage',
// 			'biz.util.previewImage',
// 			'device.connection.getNetworkType',
// 			'biz.telephone.showCallMenu'
// 		]
// 	})
// }
//
// function requestAuthCode(opts) {
// 	dd.runtime.permission.requestAuthCode(opts)
// }
//
// function alert(opts) {
// 	dd.device.notification.alert(opts)
// }
//
// function setTitle(opts) {
// 	dd.biz.navigation.setTitle(opts)
// }
//
// function error(opts) {
// 	dd.error(opts)
// }
//
// function ready(opts) {
// 	dd.ready(opts)
// }
//
// function webViewBounceDisable() {
// 	dd.ui.webViewBounce.disable()
// }
//
// function preload(opts) {
// 	dd.ui.nav.preload(opts)
// }
//
// function go(opts) {
// 	dd.ui.nav.go(opts)
// }
//
//
// // function config(opts) {
// // 	dd.config(opts);
// // }
//
// export function httpOverLwp(config) {
// 	dd.service.request.httpOverLwp(config)
// }
//
// function datepicker(opts) {
// 	dd.biz.util.datepicker(opts);
// }
//
// function chosen(opts) {
// 	dd.biz.util.chosen(opts);
// }
//
// function choose(opts) {
// 	dd.biz.contact.choose(opts);
// }
//
// // function choose(opts) {
// // 	dd.biz.contact.choose({...opts, corpId: sessionStorage.getItem('corpId')});
// // }
//
//
//
//
//
//
//
// function modal(opts) {
// 	dd.device.notification.modal(opts);
// }
//
// function prompt(opts) {
// 	dd.device.notification.prompt(opts);
// }
//
// function close() {
// 	dd.biz.navigation.close();
// }
//
// function setNavigationRight(opts) {
// 	dd.biz.navigation.setRight(opts)
// }
//
// function showPreloader(opts) {
// 	dd.device.notification.showPreloader(opts)
// }
//
// function hidePreloader(opts) {
// 	dd.device.notification.hidePreloader(opts)
// }
//
// function confirm(opts) {
// 	dd.device.notification.confirm(opts)
// }
//
// function toast(opts) {
// 	dd.device.notification.toast(opts)
// }
//
// function actionSheet(opts) {
// 	dd.device.notification.actionSheet(opts)
// }
//
// function setIcon(opts) {
// 	dd.biz.navigation.setIcon(opts)
// }
//
// function setRight(opts) {
// 	dd.biz.navigation.setRight(opts)
// }
//
// function setMenu (opts) {
// 	dd.biz.navigation.setMenu(opts)
// }
//
// function requestOperateAuthCode (opts) {
// 	dd.runtime.permission.requestOperateAuthCode(opts)
// }
//
// function openLink(opts) {
// 	dd.biz.util.openLink(opts)
// }
//
// function pay (opts){
// 	dd.biz.alipay.pay(opts)
// }
//
// export function uploadImage(opts){
// 	dd.biz.util.uploadImage(opts)
// }
// export function previewImage(opts){
// 	dd.biz.util.previewImage(opts)
// }
