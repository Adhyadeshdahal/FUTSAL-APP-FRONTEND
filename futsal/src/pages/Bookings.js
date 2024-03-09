import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';

import 'primeicons/primeicons.css';

import './bookings.css';

const BookingList = () => {
    const [bookings, setBookings] = useState([]);

    const byDate = () => {
        setBookings([...bookings].sort((a, b) => new Date(a.date) - new Date(b.date)));
    };

    const byPrice = () => {
        setBookings([...bookings].sort((a, b) => a.price - b.price));
    };

    useEffect(() => {
        async function fetchBookings() {
            try {
                // Retrieve the token from local storage
                const authToken = localStorage.getItem('authToken');

                const response = await fetch('http://127.0.0.1:5000/Bookings/myBookings', {
                    headers: {
                        'x-auth-token': authToken,
                        'Content-Type': 'application/json'
                    }
                });
                console.log(response);
                if (!response.ok) {
                    throw new Error('Failed to fetch bookings');
                }
                const data = await response.json();
                setBookings(data);
            } catch (error) {
                console.error('Error fetching bookings:', error.message);
            }
        }

        fetchBookings();
    }, []);
    console.log(bookings);

    const handleCancel = async (bookingId) => {
        try {
            // Retrieve the token from local storage
            const authToken = localStorage.getItem('authToken');
    
            const response = await fetch(`http://127.0.0.1:5000/Bookings/myBookings/${bookingId}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': authToken,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to cancel booking');
            }
            // Assuming you want to update the bookings list after cancellation
            const updatedBookings = bookings.filter(booking => booking.BookingId !== bookingId);
            setBookings([updatedBookings]);
        } catch (error) {
            console.error('Error cancelling booking:', error.message);
        }
    };
    

    return (
      <div className='mascc'>
          <div className="container">
            <h1 className="text-center mt-5 mb-4 display-4" style={{ color: 'black' }}>
              My Bookings
            </h1>

            <div className="sort-button">
                <span style={{ fontSize: '2em', verticalAlign: 'middle' }}>&#9776;</span>
                Sort by
                <div className="dropdown-menu">
                    <a href="#" onClick={byDate}>Date</a>
                    <a href="#" onClick={byPrice}>Price</a>
                </div>
            </div>
            <table className="table table-striped table-bordered">
                <thead className="thead-dark" style={{ backgroundColor: 'green', color: 'white' }}>
                    <tr>
                        <th>Booking ID</th>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                   { bookings && bookings.map((booking, index) => (
                        <tr key={`${booking.BookingId}_${index}`} className={index === 0 ? 'bg-green' : ''}>
                            <td>{booking.bookingId}</td>
                            <td>{booking.futsalName}</td>
                            <td>{booking.date}</td>
                            <td>{booking.timing}</td>
                            <td>
    {new Date().toISOString().split('T')[0] >= booking.date ? (
        <Button
            label="Cancel"
            className="p-button-danger"
            disabled
            style={{
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'not-allowed',
            }}
        />
    ) : booking.bookingId && (
        <Button
            label="Cancel"
            className="p-button-danger"
            style={{
                background: 'red',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
            }}
            onMouseOver={(e) => document.querySelector('.p-button-danger').style.backgroundColor = 'darkred'}
            onMouseOut={(e) => document.querySelector('.p-button-danger').style.backgroundColor = 'red'}
            onClick={() => handleCancel(booking.bookingId)}
        />
    )}
</td>



                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    );
};

export default BookingList;

