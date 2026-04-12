$(function () {

  const id = new URLSearchParams(window.location.search).get("id");
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find(u => u.id == id);

  function render() {
    $("#progressTable").empty();

    user.history.forEach(h => {
      $("#progressTable").append(`<tr><td>${h.date}</td><td>${h.weight}</td></tr>`);
    });
  }

  $("#addProgressBtn").click(function () {
    user.history.push({
      date: $("#progressDate").val(),
      weight: +$("#progressWeight").val()
    });

    localStorage.setItem("users", JSON.stringify(users));
    render();
  });

  render();
});