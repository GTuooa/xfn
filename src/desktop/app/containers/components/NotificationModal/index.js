import React from 'react'
import './style.less'

const NotificationTitle = (
    <div className="err-notification-modal-title">
        系统发生了未知错误
    </div>
)

const NotificationModal = (url, responStatus, code, message) => (
    <div>
        <div>
            <dl>
                <dt className="err-notification-modal-top-item">您可以对当前页面进行截屏：</dt>
                <dd className="err-notification-modal-top-item">
                    地址：{url}
                </dd>
                <dd className="err-notification-modal-top-item">
                    浏览器返回码：{responStatus}
                </dd>
            </dl>
        </div>
        <div className="err-notification-modal">

            <div className="err-notification-modal-left">
                <img className="err-notification-modal-img" src="https://www.xfannix.com/utils/img/icons/cspo.png" />
                <span>
                    （扫码添加技术专员）
                </span>
            </div>
            <div className="err-notification-modal-right">
                <dl>
                    {
                        code !== undefined ?
                        <dd className="err-notification-modal-right-item">
                            后端返回码：{code}
                        </dd>
                        : null
                    }
                    {
                        message !== undefined ?
                        <dd className="err-notification-modal-right-item">
                            后端信息：{message}
                        </dd>
                        : null
                    }
                    <dd className="err-notification-modal-right-item">1.发送至您的专属小番服务群；</dd>
                    <dd className="err-notification-modal-right-item">2.发送至小番技术服务专员；</dd>
                    <dd className="err-notification-modal-right-item">3.拨打技术服务专线。</dd>
                </dl>
                <div className="err-notification-modal-tel">
                    0571-28121680转4
                </div>
            </div>
        </div>
    </div>
)

export { NotificationModal, NotificationTitle }
