using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using Microsoft.Extensions.Hosting;
using WebTechBMI.Models;

namespace WebTechBMI.Services
{
    public class UserService
    {
        private readonly string _storageFilePath;

        public UserService(IHostEnvironment environment)
        {
            _storageFilePath = Path.Combine(environment.ContentRootPath, "users.json");
        }

        /// <summary>
        /// Gets all users
        /// </summary>
        public List<User> GetAllUsers()
        {
            if (!File.Exists(_storageFilePath))
            {
                return new List<User>();
            }

            try
            {
                var fileContents = File.ReadAllText(_storageFilePath);
                return JsonSerializer.Deserialize<List<User>>(fileContents, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                }) ?? new List<User>();
            }
            catch
            {
                return new List<User>();
            }
        }

        /// <summary>
        /// Gets a user by ID
        /// </summary>
        public User? GetUserById(long id)
        {
            var users = GetAllUsers();
            return users.FirstOrDefault(u => u.Id == id);
        }

        /// <summary>
        /// Searches users by name
        /// </summary>
        public List<User> SearchByName(string searchTerm)
        {
            var users = GetAllUsers();
            return users.Where(u => u.Name?.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) == true).ToList();
        }

        /// <summary>
        /// Adds a new user
        /// </summary>
        public bool AddUser(User user)
        {
            if (!ValidateUser(user))
                return false;

            user.Id = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            
            var users = GetAllUsers();
            users.Add(user);
            
            SaveUsers(users);
            return true;
        }

        /// <summary>
        /// Updates an existing user
        /// </summary>
        public bool UpdateUser(User user)
        {
            if (!ValidateUser(user))
                return false;

            var users = GetAllUsers();
            var existingUser = users.FirstOrDefault(u => u.Id == user.Id);
            
            if (existingUser == null)
                return false;

            existingUser.Name = user.Name;
            existingUser.Age = user.Age;
            existingUser.Height = user.Height;
            existingUser.Weight = user.Weight;
            existingUser.Gender = user.Gender;
            existingUser.ActivityLevel = user.ActivityLevel;
            existingUser.Image = user.Image;

            SaveUsers(users);
            return true;
        }

        /// <summary>
        /// Deletes a user by ID
        /// </summary>
        public bool DeleteUser(long id)
        {
            var users = GetAllUsers();
            var userToDelete = users.FirstOrDefault(u => u.Id == id);
            
            if (userToDelete == null)
                return false;

            users.Remove(userToDelete);
            SaveUsers(users);
            return true;
        }

        /// <summary>
        /// Validates user data
        /// </summary>
        private bool ValidateUser(User user)
        {
            if (string.IsNullOrWhiteSpace(user.Name))
                return false;
            if (user.Age <= 0)
                return false;
            if (user.Height <= 0)
                return false;
            if (user.Weight <= 0)
                return false;

            return true;
        }

        /// <summary>
        /// Saves users to storage (would be database in real app)
        /// </summary>
        private void SaveUsers(List<User> users)
        {
            var options = new JsonSerializerOptions
            {
                WriteIndented = true
            };

            var fileContents = JsonSerializer.Serialize(users, options);
            File.WriteAllText(_storageFilePath, fileContents);
        }
    }
}
