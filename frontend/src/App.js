import { useState, useEffect } from 'react'

import Header from "./components/Header"
import Table from "./components/Table"
import "./App.css"


const App = () =>{

  const [tests, setTests] = useState([])

  useEffect(() => {
    const getTests = async () =>{
      const testsFromServer = await fetchTests()
      setTests(testsFromServer)
    }
    getTests()
  }, [])


  // Fetch tests
  const fetchTests = async () =>{
    const res = await fetch('http://localhost:5000/tests')
    const data = await res.json()

    return data
  }

  return (
    <div className="container">
      <Header />
      <Table tests={tests}/>
    </div>
  )
}


export default App;