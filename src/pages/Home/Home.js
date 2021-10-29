import Select from "react-select";
import { React, useState } from 'react'
import { url } from "../../constants";
import axios from 'axios';

const Home = () => {
  let numberOfSeatsArray = [1, 2, 3, 4, 5, 6, 7]
  const [numberOfSeats, setSeats] = useState(0)
  const [ticketsNotAvailable, setTicketsNotAvailable] = useState([])
  const [ticketsBooked, setTicketBooked] = useState([])
  const bookTickets = (e) => {
    axios.post(`${url}/bookticket/${numberOfSeats}`)
    .then(function (response) {
      if (response.status === 200) {
        console.log(response.data)
        setTicketBooked(response.data)
      }
      else if (response.status === 201) {
        return alert("Sorry No Tickets Available")
      }
      else{
        return alert("Something Went Wrong")
      }
    });
    e.preventDefault();
  }
  const Result = () => {
    return (<div className="result">
      <ul>
        {ticketsBooked.map((item) => {
          return <li>{item}</li>
        })}
      </ul>
    </div>)

  }
  const NotAvailable = () => {
    return (<div className="notAvailble">
      <h1>Sorry Tickets Are Not Available</h1>
    </div>)
  }
  return (
    <div className="container mainContainer">
      <br />
      <h1 className="text-center color-white" style={{ pendingTop: "30%" }}>
        Book Tickets Now!
      </h1>
      <br /><br /><br /><br />
      <Select
        className="select"
        placeholder="Select Number of Tickets"
        options={numberOfSeatsArray.map((item) => ({
          value: item,
          label: item,
        }))}
        onChange={(e) => {
          setSeats(e.value)
        }}
      />
      <br /><br />
      <button type="submit" id="bookTicketButton" className="btn btn-info" disabled={numberOfSeats === 0 ? true : false} onClick={bookTickets}>Book Tickets</button>
      {ticketsNotAvailable ? <NotAvailable /> : <Result />}
    </div>
  )
}
export default Home;