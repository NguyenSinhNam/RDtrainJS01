$("#update_user").hide();
$('#new_user').hide();
const URL = "https://62b40a124f851f87f4635c93.mockapi.io/api/v1/users/";

// Get Users Api
async function getUsersFromApi(URL, callback) {
  const response = await fetch(URL);
  var users = await response.json();
  var tab = '';
  for (let u of users) {
    var createdAt = [u.createdAt];
    if (!isNaN(createdAt)) {
      let myObj = $.parseJSON(createdAt),
        myDate = new Date(1000 * myObj);

      let day = myDate.getDate(),
        month = myDate.getMonth() + 1,
        year = myDate.getFullYear();

      month = (month < 10 ? "0" : "") + month;

      createdAt = year + "-" + month + "-" + day;

    } else {
      createdAt = [u.createdAt]
    }

    var gender = [u.gender];
    if (gender == 'true') {
      gender = 'male';
    } else {
      gender = 'female';
    }

    tab += '<li class="userItem " id="' + [u.id] + '"><div class="info"><span>' + [u.id] + '</span><span>' + [u.firstName] + '</span><span>' + [u.lastName] + '</span><span>' + gender + '</span><span>' + createdAt +
      '</span></div></li>';
  }
  // Show all user
  document.getElementById("list_users").innerHTML = tab;

  callback();
};

function infoUser() {
  // Show info user item
  var userItem = $(".userItem");
  userItem.on('click', function() {
    var getID = $(this).attr('id');

    fetch(URL + getID)
      .then(response => response.json())
      .then(function(user) {

        $(".id").val([user.id]);
        $(".firstname").val([user.firstName]);
        $(".lastname").val([user.lastName]);
        $(".gender").val([user.gender]);
        $(".active").val([user.active]);

        let createdAt = [user.createdAt];

        if (!isNaN(createdAt)) {
          let myObj = $.parseJSON(createdAt),
            myDate = new Date(1000 * myObj);

          let day = myDate.getDate(),
            month = myDate.getMonth() + 1,
            year = myDate.getFullYear();

          month = (month < 10 ? "0" : "") + month;

          let date = year + "-" + month + "-" + day;

          $(".createdAt").val(date);
        } else {
          $(".createdAt").val([user.createdAt]);
        }

        $(".table_user").remove();
        $("#update_user").show();

      })

      .catch(function(error) {
        // If there is any error you will catch them here
        console.log(error);
      });
  });
}

function api(type, data, url) {
  $.ajax({
    url: url,
    type: type,
    dataType: 'json',
    data,
    success: function(data, textStatus, xhr) {
      console.log(data);
      window.setTimeout(() => {
        window.location.reload(true);
      }, 1000);
    },
    error: function(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
    }
  });
}

// Change user
function changeUser() {

  // Update info user
  $('#update_user').each(function() {
    $(".input_field").on("change", function(e) {
      let getId = $(".id").val();
      let updateFirstname = $(".firstname").val();
      let updateLastname = $(".lastname").val();
      let updateCreatedAt = $(".createdAt").val();
      let updateGender = $(".gender").val();
      let updateActive = $(".active").val();

      // Update info user
      $(".update_user").click(function() {
        var updateUrl = URL + getId;

        var data = {
          firstName: updateFirstname,
          lastName: updateLastname,
          createdAt: updateCreatedAt,
          gender: updateGender,
          active: updateActive,
        }

        api('PUT', data, updateUrl);

      });
    });
  });

  // Delete User
  $('.delete_user').click(function() {
    let id = $(".id").val();
    let deleteUrl = URL + id;

    var data = {
      id: id
    }

    api('DELETE', data, deleteUrl);

  })

}

function createUser() {

  // Create User
  $(".create_user").on('click', function() {
    $(".table_user").remove();
    $("#update_user").remove();
    $("#new_user").show();
  });

  fetch(URL)
    .then(response => response.json())
    .then(function(users) {

      $(".add_user").on('click', function() {

        var firstName = $('.new_firstname').val();
        var lastName = $('.new_lastname').val();
        var gender = $('.new_gender').val();
        var active = $('.new_active').val();
        var createdAt;
        var id = users.length + 1;

        console.log(id);

        if (firstName == '') {
          var txt = 'Please enter firstName';
          document.querySelector('.required_firstname').innerHTML = txt;
        }

        if (lastName == '') {
          var txt = 'Please enter lastName';
          document.querySelector('.required_lastname').innerHTML = txt;
        }

        if (gender == '') {
          var txt = 'Please choose gender';
          document.querySelector('.required_gender').innerHTML = txt;
        }

        if (active == '') {
          var txt = 'Please choose active';
          document.querySelector('.required_active').innerHTML = txt;
        }

        let myDate = new Date(),
          day = myDate.getDate(),
          month = myDate.getMonth() + 1,
          year = myDate.getFullYear();

        month = (month < 10 ? "0" : "") + month;

        createdAt = year + "-" + month + "-" + day;

        const formData = new FormData();

        formData.set('firstName', firstName);
        formData.set('lastName', lastName);
        formData.set('gender', gender);
        formData.set('createdAt', createdAt);
        formData.set('active', active);
        // formData.append('id', id);

        // users.push(formData);
        //
        // console.log(formData.getAll('active'));
        //
        // const request = new XMLHttpRequest();
        //
        // console.log(request);
        //
        // request.open("PUT", URL);
        // request.send(formData);
        //
        // let data = {
        //   name: 'Sammy'
        // }

        console.log(JSON.stringify(formData));

        let request = new Request(URL, {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8'
          })
        });

        fetch(request)
          .then(function() {

            // Handle response you get from the API
            console.log(request);
          });

      })

    })
}

getUsersFromApi(URL, infoUser);
changeUser();
createUser();
