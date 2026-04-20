$(function () {

  let users = JSON.parse(localStorage.getItem("users")) || [];

  function bmi(w, h) {
    return (w / ((h / 100) ** 2)).toFixed(1);
  }

  function status(b) {
    if (b < 18.5) return "Underweight";
    if (b < 25) return "Normal";
    if (b < 30) return "Overweight";
    return "Obese";
  }

  function statusClass(s) {
    return "status-" + s.toLowerCase();
  }

  function caloriePlan(user) {
    if (!user.gender || !user.activityLevel) return null;

    let bmr = user.gender === "male"
      ? 10 * user.weight + 6.25 * user.height - 5 * user.age + 5
      : 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;

    const activityMap = {
      low: 1.2,
      moderate: 1.55,
      high: 1.9
    };

    const maintenance = Math.round(bmr * activityMap[user.activityLevel]);

    return {
      maintain: maintenance,
      lose: maintenance - 500,
      gain: maintenance + 500
    };
  }

  function render(list) {
    $("#userTableBody").empty();

    list.forEach(u => {
      const b = bmi(u.weight, u.height);
      const s = status(b);
      const cal = caloriePlan(u);

      $("#userTableBody").append(`
        <tr>
          <!-- 👇 NEW IMAGE COLUMN -->
          <td>
            <img src="${u.image || 'https://via.placeholder.com/50'}"
                 width="50"
                 height="50"
                 style="border-radius:50%; object-fit:cover;">
          </td>

          <td>${u.name}</td>
          <td>${u.age}</td>
          <td>${u.height}</td>
          <td>${u.weight}</td>
          <td>${b}</td>
          <td class="${statusClass(s)}">${s}</td>

          <td>
            ${!cal ? "-" : `
              <div>Maintain: ${cal.maintain}</div>
              <div>Lose: ${cal.lose}</div>
              <div>Gain: ${cal.gain}</div>
            `}
          </td>

          <td>
            <a href="edit-user.html?id=${u.id}" class="btn btn-warning btn-sm">Edit</a>
            <button class="btn btn-danger btn-sm deleteBtn" data-id="${u.id}">Delete</button>
          </td>
        </tr>
      `);
    });
  }

  $(document).on("click", ".deleteBtn", function () {
    const id = $(this).data("id");

    if (!confirm("Delete user?")) return;

    users = users.filter(u => u.id != id);
    localStorage.setItem("users", JSON.stringify(users));

    render(users);
  });

  $("#searchInput").on("input", function () {
    const val = $(this).val().toLowerCase();
    render(users.filter(u => u.name.toLowerCase().includes(val)));
  });

  render(users);

});