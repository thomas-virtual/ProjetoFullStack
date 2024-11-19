using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ProEventos.Application.Contratos;
using ProEventos.Application.dtos;
using ProEventos.Domain;
using ProEventos.Persistence;
using ProEventos.Persistence.Models;

namespace ProEventos.Application
{
    public class PalestranteService : IPalestranteService
    {
        private readonly IPalestrantePersist _palestrantePersist;
        private readonly IMapper _mapper;
        public PalestranteService(IMapper mapper, IPalestrantePersist palestrantePersist)
        {
            this._palestrantePersist = palestrantePersist;
            this._mapper = mapper;
        }
        public async Task<PalestranteDto> AddPalestrantes(int userId, PalestranteAddDto model)
        {
            try
            {   
                var palestrante = _mapper.Map<Palestrante>(model);
                palestrante.UserId = userId;

                _palestrantePersist.Add<Palestrante>(palestrante);

                if (await _palestrantePersist.SaveChangesAsync())
                {
                    var novoPalestrante = await _palestrantePersist.GetPalestranteByUserIdAsync(userId, false);
                    var resultado = _mapper.Map<PalestranteDto>(novoPalestrante);
                    return resultado;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<PalestranteDto> UpdatePalestrantes(int userId, PalestranteUpdateDto model)
        {
            try
            {
                var palestrante = await _palestrantePersist.GetPalestranteByUserIdAsync(userId, false);
                if (palestrante == null) return null;

                model.Id = palestrante.Id;
                model.UserId = palestrante.UserId;

                _mapper.Map(model, palestrante);

                _palestrantePersist.Update<Palestrante>(palestrante);
                if (await _palestrantePersist.SaveChangesAsync())
                {
                    var novoPalestrante = await _palestrantePersist.GetPalestranteByUserIdAsync(userId, false);
                    var resultado = _mapper.Map<PalestranteDto>(novoPalestrante);
                    return resultado;
                }
                return null;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }
        public async Task<PageList<PalestranteDto>> GetAllPalestrantesAsync(PageParams pageParams, bool includeEventos = false)
        {
            try
            {
                var palestrantes = await _palestrantePersist.GetAllPalestrantesAsync(pageParams, includeEventos);
                if (palestrantes == null) return null;

                var resultado = _mapper.Map<PageList<PalestranteDto>>(palestrantes);

                resultado.CurrentPage = palestrantes.CurrentPage; 
                resultado.TotalPages = palestrantes.TotalPages; 
                resultado.PageSize = palestrantes.PageSize; 
                resultado.TotalCount = palestrantes.TotalCount;  

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<PalestranteDto> GetPalestranteByUserIdAsync(int userId, bool includeEventos = false)
        {
            try
            {
                var palestrante = await _palestrantePersist.GetPalestranteByUserIdAsync(userId, includeEventos);
                if (palestrante == null) return null;

                var resultado = _mapper.Map<PalestranteDto>(palestrante);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}