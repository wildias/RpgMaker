using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;

namespace RpgMaker.Api.Hubs
{
    [Authorize]
    public class PersonagemHub : Hub
    {

    }
}
