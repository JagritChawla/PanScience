import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from "react-redux"
import FormContainer from "../components/FormContainer"
import { useRegisterMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const RegisterScreen = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/")
    }
  }, [userInfo, navigate])

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await register({ email, password }).unwrap();
        dispatch(setCredentials({ user: res.user, token: res.token }));
        toast.success("Login successful");
        navigate('/');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }

  }

  return (
    <FormContainer>
      <h1>Sign Up</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className='my-3'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control type='email' placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}>

          </Form.Control>
        </Form.Group>

        <Form.Group controlId="password" className='my-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}>

          </Form.Control>
        </Form.Group>

        <Form.Group controlId="confirmPassword" className='my-3'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type='password' placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}>

          </Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='mt-2' disabled={isLoading}>
          Register
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          Already have an Account ? <Link to="/login">Login</Link >
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen