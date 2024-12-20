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
    public class EventoService : IEventoService
    {
        private readonly IEventoPersist _eventoPersist;
        private readonly IGeralPersist _geralPersist;
        private readonly IMapper _mapper;
        public EventoService(IGeralPersist geralPersist, IEventoPersist eventoPersist, IMapper mapper)
        {
            this._geralPersist = geralPersist;
            this._eventoPersist = eventoPersist;
            this._mapper = mapper;

        }
        public async Task<EventoDto> AddEventos(int userId, EventoDto model)
        {
            try
            {   
                var evento = _mapper.Map<Evento>(model);
                evento.UserId = userId;

                _geralPersist.Add<Evento>(evento);

                if (await _geralPersist.SaveChangesAsync())
                {
                    var novoEvento = await _eventoPersist.GetEventoByIdAsync(userId, evento.EventoId, false);
                    var resultado = _mapper.Map<EventoDto>(novoEvento);
                    return resultado;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<EventoDto> UpdateEvento(int userId, int eventoId, EventoDto model)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(userId, eventoId, false);
                if (evento == null) return null;

                model.EventoId = evento.EventoId;
                model.UserId = evento.UserId;

                _mapper.Map(model, evento);

                _geralPersist.Update<Evento>(evento);
                if (await _geralPersist.SaveChangesAsync())
                {
                    var novoEvento = await _eventoPersist.GetEventoByIdAsync(userId, evento.EventoId, false);
                    var resultado = _mapper.Map<EventoDto>(novoEvento);
                    return resultado;
                }
                return null;
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }
        public async Task<bool> DeleteEvento(int userId, int eventoId)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(userId, eventoId, false);
                if (evento == null) throw new Exception("EventoDto não encontrado!");

                _geralPersist.Delete<Evento>(evento);
                return await _geralPersist.SaveChangesAsync();
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<PageList<EventoDto>> GetAllEventosAsync(int userId, PageParams pageParams, bool includePalestrantes = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetAllEventosAsync(userId, pageParams, includePalestrantes);
                if (eventos == null) return null;

                

                var resultado = _mapper.Map<PageList<EventoDto>>(eventos);

                resultado.CurrentPage = eventos.CurrentPage; 
                resultado.TotalPages = eventos.TotalPages; 
                resultado.PageSize = eventos.PageSize; 
                resultado.TotalCount = eventos.TotalCount;  

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<EventoDto> GetEventoByIdAsync(int userId, int eventoId, bool includePalestrantes = false)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(userId, eventoId, includePalestrantes);
                if (evento == null) return null;

                var resultado = _mapper.Map<EventoDto>(evento);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}