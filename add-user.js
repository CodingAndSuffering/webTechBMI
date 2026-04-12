$(function () {

  $("#addUserForm").submit(function (e) {
    e.preventDefault();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = {
      id: Date.now(),
      name: $("#inputName").val(),
      age: +$("#inputAge").val(),
      height: +$("#inputHeight").val(),
      weight: +$("#inputWeight").val(),
      gender: $("#inputGender").val(),
      activityLevel: $("#inputActivity").val(),
      history: []
    };

    if (!user.name || !user.age || !user.height || !user.weight) {
      alert("Fill all fields");
      return;
    }

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));

    window.location.href = "index.html";
  });

});