using System.Threading.Tasks;
using AutoMapper;
using ProEventos.Application.dtos;
using ProEventos.Domain;
using ProEventos.Domain.Identity;
using ProEventos.Persistence.Models;

namespace ProEventos.API.helpers
{
    public class ProEventosProfile : Profile
    {
        public ProEventosProfile()
        {
            CreateMap<Evento, EventoDto>().ReverseMap();
            CreateMap<Lote, LoteDto>().ReverseMap();

            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<User, UserUpdateDto>().ReverseMap();
            CreateMap<User, UserLoginDto>().ReverseMap();
        }
    }
}