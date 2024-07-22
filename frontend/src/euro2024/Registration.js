import { React } from 'react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { TextField, Button } from '@mui/material'
import Alert from '@mui/material/Alert'
import './LoginRegistration.css'

const Registration = () => {
  const [inputs, setInputs] = useState({
    userName: '',
    userPassword: '',
    userRepeatPassword: '',
  })

  const [backendResponse, setBackendResponse] = useState('')
  const [backendError, setBackendError] = useState('')

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const submitHandler = (e) => {
    e.preventDefault()

    const sendRequest = async () => {
      await fetch('http://localhost:8080/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          USER_NAME: inputs.userName,
          USER_PASSWORD: inputs.userPassword,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.warning !== undefined) {
            setBackendError(data.warning)
            setBackendResponse('')
          }
          if (data.message !== undefined) {
            setBackendResponse(data.message)
            setBackendError('')
          }
        })
        .catch((err) => console.log(err))
    }

    if (inputs.userPassword === inputs.userRepeatPassword) sendRequest()
    else setBackendError('The passwords do not match. Please try again.')
  }

  return (
    <div className="home">
      <h4>Create a new account</h4>
      <form className="form-control" onSubmit={submitHandler}>
        <TextField
          style={{ marginRight: '20px' }}
          onChange={handleChange}
          value={inputs.userName}
          name="userName"
          margin="normal"
          id="outlined-title"
          label="User Name"
          variant="outlined"
        />
        <TextField
          onChange={handleChange}
          value={inputs.userPassword}
          type="password"
          name="userPassword"
          margin="normal"
          id="outlined-body"
          label="User Password"
          variant="outlined"
        />
        <TextField
          onChange={handleChange}
          value={inputs.userRepeatPassword}
          type="password"
          name="userRepeatPassword"
          margin="normal"
          id="outlined-body"
          label="Repeat the Password"
          variant="outlined"
        />
        <br></br>
        <Button type="submit" variant="contained">
          Register
        </Button>
        <br></br>
        <NavLink className="link" to="/login">
          Do you have an account?<strong> Login!</strong>
        </NavLink>
        {backendResponse !== '' ? (
          <div>
            <br></br>
            <Alert variant="filled" severity="success">
              {backendResponse}
            </Alert>
          </div>
        ) : (
          ''
        )}
        {backendError !== '' ? (
          <div>
            <br></br>
            <Alert variant="filled" severity="error">
              {backendError}
            </Alert>
          </div>
        ) : (
          ''
        )}
      </form>
    </div>
  )
}

export default Registration
