using Microsoft.EntityFrameworkCore;
using PackageTracker.Server;
using PackageTracker.Server.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<PackageDbContext>(options =>
    options.UseInMemoryDatabase("PackageDb"));

var app = builder.Build();


//Įdedami pavyzdiniai duomenys
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<PackageDbContext>();

    if (!db.Packages.Any())
    {
        db.Packages.AddRange(
            new Package
            {
                PackageId = Guid.NewGuid(),
                Status = "Created",
                Sender = new PackageSender { SenderName = "Alice", SenderAddress = "V.Krėvės pr. 65", SenderPhone = "123456789" },
                Recipient = new PackageRecipient { RecipientName = "Bob", RecipientAddress = "Nemuno g. 45", RecipientPhone = "1578964223" },
                CreatedAt = DateTime.UtcNow.AddDays(-1).Date
            },
            new Package
            {
                PackageId = Guid.NewGuid(),
                Status = "Created",
                Sender = new PackageSender { SenderName = "Carol", SenderAddress = "Taikos pr. 78", SenderPhone = "741258963" },
                Recipient = new PackageRecipient { RecipientName = "Dave", RecipientAddress = "Vilniaus g. 78", RecipientPhone = "159735264" },
                CreatedAt = DateTime.UtcNow.AddDays(-2).Date
            },
            new Package
            {
                PackageId = Guid.NewGuid(),
                Status = "Created",
                Sender = new PackageSender { SenderName = "Eve", SenderAddress = "Biržų al. 12", SenderPhone = "8523654123" },
                Recipient = new PackageRecipient { RecipientName = "Frank", RecipientAddress = "Ąžuolo g. 56", RecipientPhone = "789423651" },
                CreatedAt = DateTime.UtcNow.AddDays(-3)
            },
            new Package
            {
                PackageId = Guid.NewGuid(),
                Status = "Created",
                Sender = new PackageSender { SenderName = "Grace", SenderAddress = "Obelių g. 2", SenderPhone = "369285147" },
                Recipient = new PackageRecipient { RecipientName = "Heidi", RecipientAddress = "Skinijos g. 45A", RecipientPhone = "987654321" },
                CreatedAt = DateTime.UtcNow.AddDays(-4).Date
            }
        );
        db.SaveChanges();
    }
}

app.UseDefaultFiles();
app.MapStaticAssets();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
