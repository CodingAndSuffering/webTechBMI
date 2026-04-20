$(function () {
  function getImageByBMI(weight, height) {
    const bmi = weight / ((height / 100) ** 2);

    if (bmi < 18.5)
      return "https://static.wikia.nocookie.net/allthetropes/images/2/26/Yzma.jpg/revision/latest/scale-to-width-down/285?cb=20240929011323";

    if (bmi < 25)
      return "https://media.printler.com/media/photo/184635.jpg";

    if (bmi < 30)
      return "https://static.boredpanda.com/blog/wp-content/uploads/2024/11/Fat-cartoon-character-4-6736f2b7a5105__700.jpg";

    return "https://static.wikia.nocookie.net/characters/images/8/8c/Diabeto.png/revision/latest/thumbnail/width/360/height/450?cb=20250916231158";
  }

  $("#addUserForm").submit(function (e) {
    e.preventDefault();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const weight = +$("#inputWeight").val();
    const height = +$("#inputHeight").val();

    const user = {
      id: Date.now(),
      name: $("#inputName").val(),
      age: +$("#inputAge").val(),
      height: height,
      weight: weight,
      gender: $("#inputGender").val(),
      activityLevel: $("#inputActivity").val(),

      image: getImageByBMI(weight, height)
    };

    //validation
    if (!user.name || !user.age || !user.height || !user.weight) {
      alert("Fill all fields");
      return;
    }

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));

    const img = getImageByBMI(weight, height);

    $("#modalImage").attr("src", img);
    $("#imageModal").css("display", "flex");

    $("#closeModal").on("click", function () {
      $("#imageModal").hide();
      window.location.href = "index.html";
    });

    setTimeout(() => {
      window.location.href = "index.html";
    }, 10000);

  });

});