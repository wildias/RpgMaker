# ===== BASE =====
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

# ===== BUILD =====
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Como o csproj está na mesma pasta do Dockerfile
COPY RpgMaker.Api.csproj ./
RUN dotnet restore RpgMaker.Api.csproj

# Copia todo o resto
COPY . .
RUN dotnet build RpgMaker.Api.csproj -c $BUILD_CONFIGURATION -o /app/build

# ===== PUBLISH =====
FROM build AS publish
RUN dotnet publish RpgMaker.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

# ===== FINAL =====
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "RpgMaker.Api.dll"]
