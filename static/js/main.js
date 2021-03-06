$(document).ready( () => {
  elementLoader();

  // Using empty namespace instead of '/test'
  namespace = '';

  // connect to Socket.IO server
  var socket = io(namespace);

  // Event handler for new connections
  // Invoked when connection with server estab.
  socket.on('connect', function() {
    socket.emit('connect_event', {data: 'Client connected!'})
  });

  // Event handler for server sent data
  // Callback invoked on 'server_message'
  // Display data to output-label id 'counter'
  socket.on('server_message', function(msg, cb) {
    //$('#counter').append("!");
    $('#counter').text(msg.count);
    if (cb)
      cb();
  });
});

let elementLoader = () => {
  $(document).on('click', '.navBar#topNavBar > button', function () {
    pageName = this.innerHTML;

    loadNewDash(pageName)
    updateActiveClassTo(this);
  })

  // make dash-panel-container clickable for testing
  /*$(document).on('click', 'div.dash-panel-container', function() {
    flipAxis = "Y";
    containerFlipper(this, flipAxis);
  });*/
  $(document).on('mouseenter', 'div.card-container', function() {
    cards = this.getElementsByClassName('card')
    Array.from(cards).forEach(function(card) {
      toggleClass(card, 'highlight')
      setTimeout(function() {toggleClass(card, 'highlight')}, 500)
    })
  })

  $(document).on('click', 'div.card-container', function() {
    flipAxis = "X";
    containerFlipper(this, flipAxis);
  });
}

let loadNewDash = dashPaneltoQueue => loadDashHTML("/" + dashPaneltoQueue)

let loadDashHTML = fromRoute => {
  fetch(fromRoute)
    .then( response => response.text() )
      .then( (data) => {
        data = data.trim();
        document.querySelector('.dash-panel.hidden').innerHTML = data;
      })
        .then(flipDashView());
     };

let updateActiveClassTo = to_this => { clearActiveClass(), toggleClass(to_this, 'active') }

let clearActiveClass = () => {
  // Removes 'active' class tag from *all* elements where currently set
  Array.from(document.querySelectorAll('.active')).forEach((currentActive) => {
    toggleClass(currentActive, 'active')
  });
}

let toggleClass = (element, className) => element.classList.toggle(className)

let flipDashView = () => () => containerFlipper(document.querySelector("#main-dash-container"), "Y")

let containerFlipper = (outerContainer, axis) => {
  // Flipper transition for container level elements (cntnr - innercntnr -fContent, bContent-)
  let innerContainer = outerContainer.children[0];
  var facesToChange = Array(innerContainer.children[0],innerContainer.children[1]);
  for (var i = 0; i < facesToChange.length; i++) {
    facesToChange[i].classList.toggle('hidden');
  };

  if (!Array.from(facesToChange[1].classList).includes('hidden')) {
    innerContainer.style.transform = `rotate${axis}(-180deg)`;
    } else {
    innerContainer.style.transform = `rotate${axis}(0deg)`;
    };
};
