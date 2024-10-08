import React from 'react'
import { ToastUtil } from '../utils/ToastUtils'

const Test = () => {
    const successToast = () => {
        console.log('click')
        ToastUtil.displaySuccessToast('This is a success message!')
    }
    const errorToast = () => {
        ToastUtil.displayErrorToast('This is a success message!')
    }
    const infoToast = () => {
        ToastUtil.displayInfoToast('This is a success message!')
    }

    return (
        <div>
            <h1>Test Component</h1>
            <button onClick={successToast}>Show Success Toast</button>
            <button onClick={errorToast}>Show Error Toast</button>
            <button onClick={infoToast}>Show Info Toast</button>
        </div>
    )
}

export default Test
