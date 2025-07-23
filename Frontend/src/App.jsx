import {  Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import AllRoutes from "./routes/AllRoutes"
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {


  return (
    <>
      <Header />
      <main className="py-3">
        <Container className="mt-4">
          <AllRoutes />
        </ Container>
      </main>
      <Footer />
      <ToastContainer position='top-center'/>
    </>
  )
}

export default App
