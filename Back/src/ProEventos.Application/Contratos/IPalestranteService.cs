using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Application.dtos;
using ProEventos.Persistence.Models;

namespace ProEventos.Application.Contratos
{
    public interface IPalestranteService
    {
        Task<PalestranteDto> AddPalestrantes(int userId, PalestranteAddDto model);
        Task<PalestranteDto> UpdatePalestrantes(int userId, PalestranteUpdateDto model);
        Task<PageList<PalestranteDto>> GetAllPalestrantesAsync(PageParams pageParams, bool includeEventos = false);
        Task<PalestranteDto> GetPalestranteByUserIdAsync(int userId, bool includeEventos = false);
    } 
}