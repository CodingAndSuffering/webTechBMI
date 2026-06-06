using Microsoft.AspNetCore.Mvc;
using WebTechBMI.Models;
using WebTechBMI.Services;

namespace WebTechBMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly ImageService _imageService;

        public UsersController(UserService userService, ImageService imageService)
        {
            _userService = userService;
            _imageService = imageService;
        }

        [HttpGet]
        public ActionResult<List<User>> Get([FromQuery] string? search)
        {
            if (string.IsNullOrWhiteSpace(search))
                return _userService.GetAllUsers();

            return _userService.SearchByName(search);
        }

        [HttpGet("{id}")]
        public ActionResult<User> Get(long id)
        {
            var user = _userService.GetUserById(id);
            if (user == null)
                return NotFound();

            return user;
        }

        [HttpPost]
        public ActionResult<User> Post([FromBody] User user)
        {
            user.Image = _imageService.GetImageByBMI(user.Weight, user.Height);

            if (!_userService.AddUser(user))
                return BadRequest("Unable to save user.");

            return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
        }

        [HttpPut("{id}")]
        public IActionResult Put(long id, [FromBody] User user)
        {
            if (id != user.Id)
                return BadRequest("Id mismatch.");

            user.Image = _imageService.GetImageByBMI(user.Weight, user.Height);

            if (!_userService.UpdateUser(user))
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(long id)
        {
            if (!_userService.DeleteUser(id))
                return NotFound();

            return NoContent();
        }
    }
}
