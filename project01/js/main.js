$("#user").hide();
const URL = "https://62b40a124f851f87f4635c93.mockapi.io/api/v1/users/";

// Get Users Api
async function getUsersFromApi(URL, callback) {
  const response = await fetch(URL);
  var users = await response.json();
  var tab = '';
  for (let u of users) {
    tab += '<li class="userItem " id="' + [u.id] + '"><div class="info"><span>' + [u.id] + '</span><span>' + [u.firstName] + '</span><span>' + [u.lastName] + '</span><span>' + [u.gender] + '</span><span>' + [u.createdAt] +
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

        $("#list_users").remove();
        $("#user").show();

      })

      .catch(function(error) {
        // If there is any error you will catch them here
        console.log(error);
      });
  });
}

// Update user
function updateUser() {

  // Change info user
  $(".input_field").on("change", function(e) {
    let getId = $(".id").val();
    let updateFirstname = $(".firstname").val();
    let updateLastname = $(".lastname").val();
    let updateCreatedAt = $(".createdAt").val();
    let updateGender = $(".gender").val();
    let updateActive = $(".active").val();

    // Update info user
    $(".user .update_user").click(function() {
      var updateUrl = URL + getId;
      $.ajax({
        url: updateUrl,
        type: 'PUT',
        dataType: 'json',
        data: {
          firstName: updateFirstname,
          lastName: updateLastname,
          createdAt: updateCreatedAt,
          gender: updateGender,
          active: updateActive,
        },
        success: function(data, textStatus, xhr) {
          console.log(data);
        },
        error: function(xhr, textStatus, errorThrown) {
          console.log('Error in Operation');
        }
      });

      // Reload page
      window.setTimeout(() => {
        window.location.reload(true);
      }, 1000);

    });
  });
}

function deleteUser() {
  $('.delete_user').click(function() {
    let id = $(".id").val();
    fetch(URL + id, {
      method: 'DELETE'
    }).then(() => {
      console.log('removed');
    }).catch(err => {
      console.error(err)
    });

    window.setTimeout(() => {
      window.location.reload(true);
    }, 1000);
  })
}

getUsersFromApi(URL, infoUser);
updateUser();
deleteUser();
