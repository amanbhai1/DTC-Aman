import React, { useState } from 'react';
import QRCode from 'qrcode.react';

function Booking() {
  const [view, setView] = useState('book');
  const [bookingDetails, setBookingDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [bookingID, setBookingID] = useState('');
  const [manageErrorMessage, setManageErrorMessage] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('');

  const handleViewChange = (view) => {
    setView(view);
    setBookingDetails(null);
    setErrorMessage('');
    setBookingID('');
    setManageErrorMessage('');
    setLoadingMessage('');
  };

  const handleBookTicket = (e) => {
    e.preventDefault();
    const form = e.target;
    const from = form.from.value;
    const to = form.to.value;
    const date = form.date.value;

    if (!from || !to || !date) {
      setErrorMessage('All fields are required.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
      setErrorMessage('Cannot select a past date.');
      return;
    }

    setErrorMessage('');
    setLoadingMessage('Searching for Buses...');
    setTimeout(() => {
      const randomID = Math.floor(Math.random() * 100000);
      setBookingID(randomID);
      setBookingDetails({
        from,
        to,
        date,
        id: randomID,
        time: '10:00 AM'
      });
      setLoadingMessage('');
    }, 3000);
  };

  const handleFindBooking = (e) => {
    e.preventDefault();
    const bookingId = e.target.bookingID.value;

    if (!bookingId) {
      setManageErrorMessage('Booking ID is required.');
      return;
    }

    setManageErrorMessage('');
    setBookingDetails({
      from: 'Delhi',
      to: 'Agra',
      date: '2024-08-30',
      id: bookingId,
      name: 'Krish',
      time: '10:00 AM'
    });
  };

  return (
    <div className="App min-h-screen flex flex-col justify-center items-center mt-20">
      <header className="bg-green-600 text-white py-6 shadow-md w-full text-center">
        <h1 className="text-3xl animate-fade-in">Bus Ticket Booking</h1>
        <div className="mt-4">
          <button
            onClick={() => handleViewChange('book')}
            className={`px-4 py-2 rounded-full border border-green-600 transition-all duration-300 transform hover:scale-105 ${
              view === 'book' ? 'bg-white text-green-600' : 'bg-green-600 text-white'
            }`}
          >
            Book Ticket
          </button>
          <button
            onClick={() => handleViewChange('manage')}
            className={`ml-4 px-4 py-2 rounded-full border border-green-600 transition-all duration-300 transform hover:scale-105 ${
              view === 'manage' ? 'bg-white text-green-600' : 'bg-green-600 text-white'
            }`}
          >
            Manage Booking
          </button>
        </div>
      </header>
      <main className="flex-grow flex justify-center items-center w-full p-6 animate-slide-in">
        {view === 'book' && <BookTicket handleBookTicket={handleBookTicket} bookingDetails={bookingDetails} errorMessage={errorMessage} loadingMessage={loadingMessage} />}
        {view === 'manage' && <ManageBooking handleFindBooking={handleFindBooking} bookingDetails={bookingDetails} manageErrorMessage={manageErrorMessage} />}
      </main>
    </div>
  );
}

function BookTicket({ handleBookTicket, bookingDetails, errorMessage, loadingMessage }) {
  return (
    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md transform transition-all hover:shadow-2xl hover:-translate-y-1 duration-300 mb-8 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Book Your Ticket</h2>
      <form onSubmit={handleBookTicket} className="w-full">
        <label className="block mb-3">
          From:
          <input
            type="text"
            name="from"
            placeholder="Enter departure city"
            className="mt-1 p-2 w-full border rounded"
          />
        </label>
        <label className="block mb-3">
          To:
          <input
            type="text"
            name="to"
            placeholder="Enter destination city"
            className="mt-1 p-2 w-full border rounded"
          />
        </label>
        <label className="block mb-3">
          Date:
          <input
            type="date"
            name="date"
            className="mt-1 p-2 w-full border rounded"
          />
        </label>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded mt-4 transition-all duration-300 hover:bg-green-700"
        >
          Book Ticket
        </button>
      </form>
      {loadingMessage && <p className="text-blue-500 mt-4 text-center text-xl">{loadingMessage}</p>}
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      {bookingDetails && (
        <div className="mt-8 text-center">
          <p className="text-green-600 text-xl font-bold mb-4">Successfully Booked</p>
          <p className="text-lg mb-4">Your booking ID: {bookingDetails.id}</p>
          <div className="flex justify-center">
            <QRCode
              value={`From: ${bookingDetails.from}, To: ${bookingDetails.to}, Date: ${bookingDetails.date}, Booking ID: ${bookingDetails.id}, Time: ${bookingDetails.time}`}
              size={150}
              level={"H"}
              includeMargin={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ManageBooking({ handleFindBooking, bookingDetails, manageErrorMessage }) {
  return (
    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md transform transition-all hover:shadow-2xl hover:-translate-y-1 duration-300 mb-8 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Manage Your Booking</h2>
      <form onSubmit={handleFindBooking} className="w-full">
        <label className="block mb-3">
          Booking ID:
          <input
            type="text"
            name="bookingID"
            placeholder="Enter booking ID"
            className="mt-1 p-2 w-full border rounded"
          />
        </label>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded mt-4 transition-all duration-300 hover:bg-green-700"
        >
          Find Booking
        </button>
      </form>
      {manageErrorMessage && <p className="text-red-500 mt-4">{manageErrorMessage}</p>}
      {bookingDetails && (
        <div className="mt-8 bg-gray-100 p-4 rounded-lg shadow-md w-full">
          <h3 className="text-lg font-bold mb-2">Booking Details</h3>
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="border p-2"><strong>ID</strong></td>
                <td className="border p-2">{bookingDetails.id}</td>
              </tr>
              <tr>
                <td className="border p-2"><strong>Name</strong></td>
                <td className="border p-2">{bookingDetails.name}</td>
              </tr>
              <tr>
                <td className="border p-2"><strong>From</strong></td>
                <td className="border p-2">{bookingDetails.from}</td>
              </tr>
              <tr>
                <td className="border p-2"><strong>To</strong></td>
                <td className="border p-2">{bookingDetails.to}</td>
              </tr>
              <tr>
                <td className="border p-2"><strong>Date</strong></td>
                <td className="border p-2">{bookingDetails.date}</td>
              </tr>
              <tr>
                <td className="border p-2"><strong>Arrival Time</strong></td>
                <td className="border p-2">{bookingDetails.time}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Booking;
