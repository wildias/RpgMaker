using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RpgMaker.Api.Data;
using RpgMaker.Api.Hubs;
using RpgMaker.Api.Model;
using RpgMaker.Api.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("RpgMakerDB");

builder.Services.AddDbContext<RpgMakerContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddSignalR();
builder.Services.AddHttpClient();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();

// App services
builder.Services.AddScoped<PersonagemService>();
builder.Services.AddScoped<UsuarioService>();

// Auth
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// CORS
const string CorsDevPolicy = "AllowFrontend";
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsDevPolicy, policy =>
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials() // habilite apenas se usar cookies; NÃO combine com AllowAnyOrigin
    );
});

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowDevOrigins", policy =>
//        policy
//            .SetIsOriginAllowed(_ => true)
//            .AllowAnyHeader()
//            .AllowAnyMethod()
//            .AllowCredentials()
//    );
//});

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
});

builder.WebHost.ConfigureKestrel(options => { options.ListenAnyIP(5000); });

var app = builder.Build();
app.UseCors("AllowFrontend");

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<RpgMakerContext>();
    dbContext.Database.Migrate();
}

app.MapHub<PersonagemHub>("/personagemHub");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

// ORDEM IMPORTA: CORS antes de Auth/Authorization e antes do MapControllers
app.UseCors(CorsDevPolicy);

app.UseAuthentication();
app.UseAuthorization();

// (Opcional) se tiver endpoints fora de controllers e quiser garantir resposta ao preflight:
app.MapMethods("{*path}", new[] { "OPTIONS" }, () => Results.Ok());

app.MapControllers();

app.Run();