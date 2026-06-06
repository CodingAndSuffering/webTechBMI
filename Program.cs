using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<WebTechBMI.Services.UserService>();
builder.Services.AddSingleton<WebTechBMI.Services.ImageService>();
builder.Services.AddControllers();

var app = builder.Build();

var contentRoot = app.Environment.ContentRootPath;
var fileProvider = new PhysicalFileProvider(contentRoot);

app.UseDefaultFiles(new DefaultFilesOptions
{
    FileProvider = fileProvider,
    DefaultFileNames = { "index.html" }
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = fileProvider,
    ServeUnknownFileTypes = true
});

app.MapControllers();

app.Run();
