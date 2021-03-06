
var app = app || {};

app.SeatingView = Backbone.View.extend({
  tagName: 'div',
  className: 'plane',
  events: {
  'click .seat': 'selectSeat',
  'click #save': 'reserveSeat'
},
  render: function() {
    var toolView = new app.ToolView();
    toolView.render();

    this.$el.appendTo('#main');
    console.log(this.model);
    var planeID = this.model.get('airplane_id');
    var plane = app.airplanes.where({id: planeID });
    var columns = plane[0].get('columns');
    var rows = plane[0].get('row');
    console.log(columns);
    console.log(rows);
    // letters to set to seat
    var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    // looping rows & columns

    for (var x = 1; x <= rows; x++) {
      for (var y = 1; y <= columns; y++) {
        var seatName = x.toString() + letters[y-1]
        var $seat = $('<div class="unselected seat" id=' +seatName + '>' + seatName + '</div>');
        $seat.addClass(seatName);
        this.$el.append($seat)
      }
    }
    var $button = $('<button id="save" class="btn btn-warning">Reserve</button>');
    this.$el.append($button);

    var flightID= this.model.get('id');
    var flightBookings = app.bookings.where({flight_id: flightID});
    var seatsTaken = flightBookings.map(function(flight) {
      return flight.get('seat')
    });
      _.each(seatsTaken,function(s){
        $('div[id="'+ s + '"]').addClass('taken')
      })
  },

  selectSeat: function(event){
    // only allowing one seat to be selected per reservation

    var planeID = this.model.get('id');
    var alreadyBooked= app.bookings.where({user_id: app.GlobalUser, flight_id: planeID});
    if (alreadyBooked.length === 0){
      var $seat = $(event.target);
      var reserved = $('.seat').hasClass('reserved')
      if (!reserved || $seat.hasClass('reserved')){
        $(event.target).toggleClass('reserved');
      }
    } else {
      alert('You have already made a reservation. Please book another flight.')
    }
  },


  reserveSeat: function() {
    // debugger;
    var planeID = this.model.get('id');
    var alreadyBooked= app.bookings.where({user_id: app.GlobalUser, flight_id: planeID});
    var reserved = $('.seat').hasClass('reserved')
    if (alreadyBooked.length> 0){
      alert("You already have a reservation.")
    } else if (reserved){
      var arrayOfselectedSeats = $('.plane .reserved')
      app.bookings.create({
        user_id: app.GlobalUser,
        flight_id: this.model.get('id'),
        seat: $('.plane .reserved').text()
      })
      var $success = $('<p>').html('You have reserved seat: ' + $('.plane .reserved').text() + '. <p>No refunds or exchanges. Please read the fine print.</p>');

      var $msg = $('<div>')
      $msg.html($success);
      this.$el.append($msg);
    } else {
      alert("Hurry, please pick a seat!!!!");
    }
  },



});


// createSeats: function() {
//   var planeID = this.model.attributes.airplane_id;
//   var plane = app.airplanes.where({id: planeID });
//   var columns = plane[0].get('columns');
//   var rows = plane[0].get('row');
//   console.log(columns);
//   console.log(rows);
//   // letters to set to seat
//   var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
//   // looping rows & columns
//   for (var x = 1; x <= rows; x++) {
//     for (var y = 1; y <= columns; y++) {
//       var $seat = $('<div class="unselected"></div>');
//       $seat.addClass(x.toString() + letters[y-1]);
//       $('#main').append($seat);
//     }
//   }
// }




//
//
//
//
//
//
// // airplane = { name: 'big plane', row: 32, columns: 12 };
//
// // need unique seat numbers/id - seat
//
// // To create airplane layout - table
// //
// // var init = function (reservedSeat) {
// //   var str = [], className;
// //   for (i = 0; i < airplane.row; i++) {
// //     for (j = 0; j < airplane.columns; j++) {
// //       className = airplane.seatCss + ' ' + airplane.rowCssPrefix + i.toString() + ' ' + airplane.colCssPrefix + j.toString();
// //       if ($.isArray(reservedSeat) && $.inArray(reservedSeat) != -1) {
// //         className += ' ' + airplane.selectedSeatCss;
// //       }
// //       str.push('<li class="' + className + '"' + 'style="top:' + (i * airplane.seatHeight).toString() + 'px;left:' + (j * airplane.seatWidth).toString() + 'px">' + '</li>');
// //     }
// //   }
// //   $('#main').html(str.join(''));
// // };
//
//
// // To select seats
// //
// // $('.' + airplane.seatCss).click(function () {
// // if ($(this).hasClass(airplane.selectedSeatCss)){
// //     alert('This seat is already reserved');
// // }
// // else{
// //     $(this).toggleClass(airplane.selectingSeatCss);
// //     }
// // });
//
//
// // using aiplane object from db
// // row
// // columns
// // seat no = 'row' + 'columns'
//
// // seatingView: function() {
// //   var numRows = parseInt(this.$el.find("input[name='row']").val());
// //   var row = [];
// //   for(var i=1; i <= numRows; i++) {
// //     rows.push({ row: i });
// //   }
// //
// //   var numColumns = parseInt(this.$el.find("input[name='columns']").val());
// //   var columns = [];
// //   for(var i=0; i < numColumns; i++) {
// //     columns.push({ column: columnLetters[i] });
// //   }
//

//   // selectSeat: function(sel){
//   //   // stopping
//   //   sel.stopImmediatePropagation();
//   //   // Start with listing seats whether selected or not
//   //   $('.seat').not('.reserved').addClass('unselected');
//   //     if ($(sel.currentTarget).hasClass('selected')) {
//   //       alert ("This seat has been booked. Please choose another seat.");
//   //       return;
//   //     }
//   //     if ( app.reservations.findWhere({seat: sel.currentTarget.id, airplane_id: this.model.attributes.id })) {
//   //         alert ("This seat is currently unavailable. Please choose another seat.");
//   //         this.getReservations(this.model.attributes.id);
//   //         return;
//   //     }
//   //     $('.seat').removeClass('selected');
//   //     $(sel.currentTarget).removeClass('unselected');
//   //     $(sel.currentTarget).addClass('selected');
//   //
//   //     var seat = $(".selected").eq(0).attr("id");
//   //     var flight_id = this.model.attributes.id;
//   //     var reservations = app.reservations.where({user_id: app.current_user.id, confirmed: false});
//   //     _.each(reservations, function (reservation) {
//   //       reservation.destroy();
//   //     });
//   //     app.reservations.remove(reservations);
//   //     var reservation = new app.Reservation({user_id: app.current_user.id, seat: seat, flight_id: flight_id });
//   //     reservation.save().done(function() {
//   //       app.reservations.add( reservation );
//   //     });
//   //   }
//
//
//
//             // var addAisle = function() {
//             //   if (columns === '4') {
//             //       $('.columnB').addClass('aisle-right');
//             //   }else if (columns === '6') {
//             //       $('.columnC').addClass('aisle-right');
//             //   }else if (columns === '8') {
//             //       $('.columnB').addClass('aisle-right');
//             //       $('.columnF').addClass('aisle-right');
//             //   }
