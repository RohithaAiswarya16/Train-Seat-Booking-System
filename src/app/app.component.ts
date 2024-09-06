import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  rows = 12; // 12 rows in total
  seatsPerRow = 7;
  seats = [];
  bookedSeats = [];
  totalSeats = 80;

  constructor() {
    this.initializeSeats();
  }

  // Initialize the seats in the coach
  initializeSeats() {
    let seatNumber = 1;
    for (let row = 1; row <= this.rows; row++) {
      let totalSeatsInRow = row === 12 ? 3 : this.seatsPerRow; // Last row has only 3 seats
      let rowSeats = [];
      for (let seat = 1; seat <= totalSeatsInRow; seat++) {
        rowSeats.push({
          seatNumber: seatNumber++,
          isBooked: false,
        });
      }
      this.seats.push(rowSeats); // Group seats by row
    }
  }

  // Book seats based on user input
  bookSeats(requestedSeats: number) {
    requestedSeats = Number(requestedSeats);

    if (requestedSeats > 7 || requestedSeats < 1) {
      alert('You can book between 1 and 7 seats at a time.');
      return;
    }

    let seatsToBook = [];

    // Try to book all seats in a single row
    for (let row of this.seats) {
      let availableSeatsInRow = row.filter((seat) => !seat.isBooked);
      if (availableSeatsInRow.length >= requestedSeats) {
        seatsToBook = availableSeatsInRow.slice(0, requestedSeats);
        break;
      }
    }

    // If not enough seats in one row, book nearby seats across multiple rows
    if (seatsToBook.length === 0) {
      for (let row of this.seats) {
        let availableSeatsInRow = row.filter((seat) => !seat.isBooked);
        seatsToBook = seatsToBook.concat(
          availableSeatsInRow.slice(0, requestedSeats - seatsToBook.length)
        );
        if (seatsToBook.length === requestedSeats) break;
      }
    }

    // Check if we found enough seats
    if (seatsToBook.length < requestedSeats) {
      alert('Not enough seats available.');
      return;
    }

    // Mark the seats as booked
    seatsToBook.forEach((seat) => (seat.isBooked = true));
    this.bookedSeats = seatsToBook.map((seat) => seat.seatNumber);

    // Check if the train is fully booked
    if (this.isFullyBooked()) {
      alert('The coach is fully booked.');
    }
  }

  // Check if all seats are booked
  isFullyBooked() {
    let bookedSeatCount = 0;
    for (let row of this.seats) {
      bookedSeatCount += row.filter((seat) => seat.isBooked).length;
    }
    return bookedSeatCount === this.totalSeats;
  }
}
