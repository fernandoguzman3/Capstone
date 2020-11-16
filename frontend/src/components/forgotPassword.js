import React, { Component } from 'react'
import { Formik } from 'formik'
import { object, ref, string } from 'yup'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'

import Spinner from './loading'
import Alert from './alert'

export default class ForgotPassword extends Component {
  state = {
    passChangeSuccess: false,
  }

  _handleModalClose = () => {
    this.setState(() => ({
      passChangeSuccess: false,
    }))
  }

  _renderModal = () => {
    const onClick = () => {
      this.setState(() => ({ passChangeSuccess: false }))
    }

    return (
      <Alert
        isOpen={this.state.passChangeSuccess}
        onClose={this._handleClose}
        handleSubmit={onClick}
        title="Password Reset"
        text="Your password was changed successfully"
        submitButtonText="Done"
      />
    )
  }

  _handleSubmit = ({
    email,
    newPass,
    confirmPass,
    setSubmitting,
    resetForm,
  }) => {
    // fake async login
    setTimeout(async () => {
      setSubmitting(false)

      this.setState(() => ({
        passChangeSuccess: true,
      }))

      resetForm()
    }, 1000)
  }

  render() {
    return (
        
      <Formik
        initialValues={{
          email: '',
          newPass: '',
          confirmPass: '',
        }}
        validationSchema={object().shape({
          email: string().required('Email is required'),
          newPass: string().required('New password is required'),
          confirmPass: string()
            .oneOf([ref('newPass')], 'Passwords do not match')
            .required('Password is required'),
        })}
        onSubmit={(
          { email, newPass, confirmPass },
          { setSubmitting, resetForm }
        ) =>
          this._handleSubmit({
            email,
            newPass,
            confirmPass,
            setSubmitting,
            resetForm,
          })
        }
        render={props => {
          const {
            values,
            touched,
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
            isValid,
            isSubmitting,
          } = props
          return isSubmitting ? (
            <Spinner />
          ) : (
              
            <Paper className="paper-margin" elevation="10">
                <div style={{'padding-top': '50px'}}></div>
               <h1>Recupera tu contrasena</h1>
               
              <form className="form" onSubmit={handleSubmit}>
              <div style={{'padding-top': '50px'}}></div>
                <FormControl fullWidth margin="dense">
                  <InputLabel
                    htmlFor="email"
                    error={Boolean(touched.email && errors.email)}
                  >
                    {'Correo Electronico'}
                  </InputLabel>
                  <Input
                    id="email"
                    name="email"
                   
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.email && errors.email)}
                  />
                  <FormHelperText
                    error={Boolean(touched.email && errors.email)}
                  >
                    {touched.email && errors.email
                      ? errors.email
                      : ''}
                  </FormHelperText>
                </FormControl>
                <FormControl
                  fullWidth
                  margin="dense"
                  error={Boolean(touched.newPass && errors.newPass)}
                >
                  <InputLabel
                    htmlFor="password-new"
                    error={Boolean(touched.newPass && errors.newPass)}
                  >
                    {'New Password'}
                  </InputLabel>
                  <Input
                    id="password-new"
                    name="newPass"
                    type="password"
                    value={values.newPass}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.newPass && errors.newPass)}
                  />
                  <FormHelperText
                    error={Boolean(touched.newPass && errors.newPass)}
                  >
                    {touched.newPass && errors.newPass ? errors.newPass : ''}
                  </FormHelperText>
                </FormControl>
                <FormControl
                  fullWidth
                  margin="dense"
                  error={Boolean(touched.confirmPass && errors.confirmPass)}
                >
                  <InputLabel
                    htmlFor="password-confirm"
                    error={Boolean(touched.confirmPass && errors.confirmPass)}
                  >
                    {'Confirm Password'}
                  </InputLabel>
                  <Input
                    id="password-confirm"
                    name="confirmPass"
                    type="password"
                    value={values.confirmPass}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.confirmPass && errors.confirmPass)}
                  />
                  <FormHelperText
                    error={Boolean(touched.confirmPass && errors.confirmPass)}
                  >
                    {touched.confirmPass && errors.confirmPass
                      ? errors.confirmPass
                      : ''}
                  </FormHelperText>
                </FormControl>
                <Button
                  type="submit"
                  variant="raised"
                  color="primary"
                  disabled={Boolean(!isValid || isSubmitting)}
                  style={{ margin: '16px' }}
                >
                  {'Reset Password'}
                </Button>
              </form>
              {this._renderModal()}
            </Paper>
          )
        }}
      />
    )
  }
}
