var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var trash = document.getElementsByClassName("fa-trash");
var edit = document.getElementsByClassName("fa-pencil-square-o");
var heart = document.getElementsByClassName("heart");

Array.from(thumbUp).forEach(function (element) {
  element.addEventListener('click', function () {
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
    fetch('messages', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'name': name,
        'msg': msg,
        'thumbUp': thumbUp
      })
    })
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        console.log(data)
        window.location.reload(true)
      })
  });
});




//---------edit logic start-------------------------
Array.from(edit).forEach(function (element) {
  console.log("This is edit in main.js");

  element.addEventListener('click', function () {
    const input = this.parentNode.childNodes[0]
    input.focus()
    input.addEventListener('keyup', editText)


  });
});

function editText(e) {
  console.log("Testing the edit function in main.js!!!");


  const newText = e.target.value
  const _id = this.parentNode.parentNode.getAttribute('id')

  fetch('updateEvent', {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      _id,
      newText
    })
  })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })

};


//---------edit logic end-------------------------




//-----favorite feature

Array.from(heart).forEach(function (element) {
  element.addEventListener('click', function () {
    console.log("Favorited logic check: ", this.classList.contains('fa-heart-o') ? true : false);

    const _id = this.parentNode.parentNode.childNodes[1].getAttribute('id')
    // const _id = this.parentNode.parentNode.childNodes[1]
    // const msg = this.parentNode.parentNode.childNodes[3].innerText
    fetch('updateEvent', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ //create object here that is value of body property
        // 'name': name,
        // 'msg': msg
        _id,
        favorited: this.classList.contains('fa-heart-o') ? true : false //create value of favorited property here
      })
    }).then(function (response) {
      console.log(response);

      window.location.reload()
    })
  });
});


//______________











Array.from(trash).forEach(function (element) {
  element.addEventListener('click', function () {
    const _id = this.parentNode.parentNode.childNodes[1].getAttribute('id')
    // const msg = this.parentNode.parentNode.childNodes[3].innerText
    fetch('removeEvent', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // 'name': name,
        // 'msg': msg
        _id
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});
