import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from "react-redux"
import FormContainer from "../components/FormContainer"
import { useLoginMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const LoginScreen = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);
  
  useEffect(()=>{
        if(userInfo){
            navigate("/")
        }
    },[userInfo, navigate])

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({user:res.user , token: res.token}));
      toast.success("Login successful");
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

  return (
    <FormContainer>
      <h1>Log in</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email' className='my-3'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='password' className='my-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='my-3' disabled={isLoading}>
          Log In
        </Button>
        

      </Form>
        <Row className='py-3'>
          <Col>
            New User? <Link to='/register'>Register</Link>
          </Col>
        </Row>

    </FormContainer>
  )
}

export default LoginScreen