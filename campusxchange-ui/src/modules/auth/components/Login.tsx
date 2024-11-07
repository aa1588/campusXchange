import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Link } from 'react-router-dom'
import AuthService from '../service/authservice'
import { ToastUtil } from '../../../utils/ToastUtils'

type Props = {
    updateUser: () => void
}

const Login: React.FC<Props> = ({ updateUser }) => {
    const [redirect, setRedirect] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')

    const validationSchema = Yup.object().shape({
        email: Yup.string().required('This field is required!'),
        password: Yup.string().required('This field is required!'),
    })

    const handleLogin = (formValue: { email: string; password: string }) => {
        const { email, password } = formValue
        setMessage('')
        setLoading(true)

        AuthService.login(email, password).then(
            () => {
                setRedirect('/home')
                ToastUtil.displaySuccessToast('Login successful!')
                updateUser()
            },
            (error) => {
                setLoading(false)
                setMessage('Login failed with provided email and password.')
            }
        )
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }

    const initialValues = {
        email: '',
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

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleLogin}
                >
                    <Form>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <Field
                                name="email"
                                type="text"
                                className="form-control"
                            />
                            <ErrorMessage
                                name="email"
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

                        <div className="form-group mt-2">
                            <button
                                type="submit"
                                className="btn btn-success btn-block"
                                disabled={loading}
                            >
                                {loading && (
                                    <span className="spinner-border spinner-border-sm"></span>
                                )}

                                <span>Login</span>
                            </button>
                        </div>

                        {message && (
                            <div className="form-group">
                                <div
                                    className="alert alert-danger"
                                    role="alert"
                                >
                                    {message}
                                </div>
                            </div>
                        )}
                    </Form>
                </Formik>
                <small>
                    Don't have an account?
                    <Link
                        to={'/register'}
                        className="text-decoration-none fw-bold  text-success"
                    >
                        {' '}
                        Register
                    </Link>
                </small>
            </div>
        </div>
    )
}

export default Login
