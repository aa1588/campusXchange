import React, { useState } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import AuthService from '../services/authservice'

const Register = () => {
    const [successful, setSuccessful] = useState(false)
    const [message, setMessage] = useState('')
    const [userid, setUserid] = useState('')

    const validationSchema = Yup.object().shape({
        firstname: Yup.string().required('This field is required!'),
        lastname: Yup.string().required('This field is required!'),
        email: Yup.string()
            .email('This is not a valid email.')
            .required('This field is required!'),
        phone: Yup.string().required('This field is required!'),
        password: Yup.string()
            .test(
                'len',
                'The password must be between 6 and 40 characters.',
                (val: any) =>
                    val &&
                    val.toString().length >= 6 &&
                    val.toString().length <= 40
            )
            .required('This field is required!'),
    })

    const otpSchema = Yup.object({
        otp: Yup.string()
            .required('OTP is required')
            .length(4, 'OTP must be 4 digits'),
    })

    const handleRegister = (formValue: {
        firstname: string
        lastname: string
        email: string
        phone: string
        password: string
    }) => {
        const { firstname, lastname, email, phone, password } = formValue

        setMessage('')
        setSuccessful(false)

        AuthService.register(firstname, lastname, email, phone, password).then(
            (response) => {
                setMessage('Please enter the OTP provided in your email.')
                setUserid(response.data.message)
                setSuccessful(true)
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString()

                setMessage(resMessage)
                setSuccessful(false)
            }
        )
    }

    const handleOtpSubmission = (formValue: { otp: string }) => {
        const { otp } = formValue

        AuthService.verifyOtp(userid, otp).then(
            () => {
                setMessage('User has been successfully registered.')
            },
            () => {
                setMessage('OTP verification failed. Please try again.')
            }
        )
    }

    const initialValues = {
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        password: '',
    }

    return (
        <div className="col-md-12">
            <div className="card card-container">
                <img
                    src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                    alt="profile-img"
                    className="profile-img-card"
                />

                {!successful ? (
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleRegister}
                    >
                        <Form>
                            <div className="form-group">
                                <label htmlFor="firstname">First Name</label>
                                <Field
                                    name="firstname"
                                    type="text"
                                    className="form-control"
                                />
                                <ErrorMessage
                                    name="firstname"
                                    component="div"
                                    className="alert alert-danger"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="lastname">Last Name</label>
                                <Field
                                    name="lastname"
                                    type="text"
                                    className="form-control"
                                />
                                <ErrorMessage
                                    name="lastname"
                                    component="div"
                                    className="alert alert-danger"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <Field
                                    name="email"
                                    type="email"
                                    className="form-control"
                                />
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="alert alert-danger"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone number</label>
                                <Field
                                    name="phone"
                                    type="text"
                                    className="form-control"
                                />
                                <ErrorMessage
                                    name="phone"
                                    component="div"
                                    className="alert alert-danger"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <Field
                                    name="password"
                                    type="password"
                                    className="form-control"
                                />
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="alert alert-danger"
                                />
                            </div>

                            <div className="form-group">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-block"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </Form>
                    </Formik>
                ) : (
                    <Formik
                        initialValues={{ otp: '' }}
                        validationSchema={otpSchema}
                        onSubmit={handleOtpSubmission}
                        enableReinitialize
                    >
                        <Form>
                            <div className="form-group">
                                <label htmlFor="otp">Enter OTP</label>
                                <Field
                                    name="otp"
                                    type="text"
                                    className="form-control"
                                />
                                <ErrorMessage
                                    name="otp"
                                    component="div"
                                    className="alert alert-danger"
                                />
                            </div>

                            <div className="form-group">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-block"
                                >
                                    Submit OTP
                                </button>
                            </div>
                        </Form>
                    </Formik>
                )}

                {message && (
                    <div className="form-group">
                        <div
                            className={
                                successful
                                    ? 'alert alert-success'
                                    : 'alert alert-danger'
                            }
                            role="alert"
                        >
                            {message}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Register
