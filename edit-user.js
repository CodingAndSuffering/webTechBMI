$(function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find(u => u.id == id);

  if (!user) {
    alert("User not found");
    window.location.href = "index.html";
    return;
  }

  // Fill form
  $("#name").val(user.name);
  $("#age").val(user.age);
  $("#height").val(user.height);
  $("#weight").val(user.weight);
  $("#gender").val(user.gender || "");
  $("#activityLevel").val(user.activityLevel || "");

  function calculateBMI() {
    const height = Number($("#height").val());
    const weight = Number($("#weight").val());
    if (height > 0 && weight > 0) {
      const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
      $("#bmiDisplay").text(`BMI: ${bmi}`);
    } else {
      $("#bmiDisplay").text("Enter height and weight to calculate BMI");
    }
  }

  calculateBMI();
  $("#height, #weight").on("input", calculateBMI);

  // Save changes
  $("#editForm").on("submit", function (e) {
    e.preventDefault();

    const updatedUser = {
      ...user,
      name: $("#name").val(),
      age: Number($("#age").val()),
      height: Number($("#height").val()),
      weight: Number($("#weight").val()),
      gender: $("#gender").val(),
      activityLevel: $("#activityLevel").val()
    };

    users = users.map(u => u.id == id ? updatedUser : u);

    localStorage.setItem("users", JSON.stringify(users));

    window.location.href = "index.html";
  });
});
