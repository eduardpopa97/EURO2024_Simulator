import { React } from 'react'
import { TextField, Button } from '@mui/material'
import Alert from '@mui/material/Alert'
import { useState, useEffect } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import './LoginRegistration.css'

const Login = () => {
  const [inputs, setInputs] = useState({
    userName: '',
    userPassword: '',
  })

  const [backendError, setBackendError] = useState('')

  useEffect(() => {
    if (localStorage.getItem('loggedUserID') !== null) navigate('/pickTeam')
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const submitHandler = (e) => {
    e.preventDefault()

    const sendRequest = async () => {
      await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          USER_NAME: inputs.userName,
          USER_PASSWORD: inputs.userPassword,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.warning !== undefined) setBackendError(data.warning)
          else {
            navigate('/pickTeam')
            localStorage.setItem('loggedUserName', data.session.USER_NAME)
            localStorage.setItem('loggedUserID', data.session.USER_ID)
          }
        })
        .catch((err) => console.log(err))
    }

    sendRequest();
  }

  return (
    <div className="home">
      <h4>Ultimate Euro 2024 Manager</h4>
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
        <br></br>
        <Button type="submit" variant="contained">
          Login
        </Button>
        <br></br>
        <NavLink className="link" to="/registration">
          Don't have an account?<strong> Register!</strong>
        </NavLink>
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

export default Login
