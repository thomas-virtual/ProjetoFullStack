using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ProEventos.Application.Contratos;
using ProEventos.Application.dtos;
using ProEventos.Domain;
using ProEventos.Persistence;

namespace ProEventos.Application
{
    public class LoteService : ILoteService
    {
        private readonly ProEventosContext _context; 
        private readonly IGeralPersist _geralPersist; 
        private readonly ILotePersist _lotePersist;
        private readonly IMapper _mapper;
        public LoteService(
            ProEventosContext context, 
            IGeralPersist geralPersist, 
            ILotePersist lotePersist,
            IMapper mapper
            )
        {
            this._lotePersist = lotePersist;
            this._geralPersist = geralPersist;
            this._context = context;
            this._mapper = mapper;
        }
        public async Task<LoteDto[]> SaveLotes(int eventoId, LoteDto[] models)
        {
            try
            {
                var lotes = await _lotePersist.GetLotesByEventoIdAsync(eventoId);
                if (lotes == null) return null;

                foreach (var model in models)
                {
                    if(model.Id == 0) 
                    {
                        await AddLote(model);
                    }
                    else
                    {
                        var lote = lotes.FirstOrDefault(lote => lote.Id == model.Id);
                        model.EventoId = eventoId;

                        _mapper.Map(model, lote);

                        _geralPersist.Update<Lote>(lote);

                        await _geralPersist.SaveChangesAsync();
                    }
                }

                var loteRetorno = await _lotePersist.GetLotesByEventoIdAsync(eventoId);
                return _mapper.Map<LoteDto[]>(loteRetorno);
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<LoteDto> AddLote(LoteDto model) {
            var lote = _mapper.Map<Lote>(model);
            lote.EventoId = model.EventoId;
            _geralPersist.Add<Lote>(lote);

            if (await _geralPersist.SaveChangesAsync())
            {
                var novoLote = await _lotePersist.GetLoteByIdsAsync(model.EventoId, model.Id);
                var resultado = _mapper.Map<LoteDto>(novoLote);
                return resultado;
            }
            return null;
        }

        public async Task<LoteDto> GetLoteByIdsAsync(int eventoId, int Id)
        {
            try
            {
                var lote = await _lotePersist.GetLoteByIdsAsync(eventoId, Id);
                if(lote == null) return null;

                var resultado = _mapper.Map<LoteDto>(lote);
                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<LoteDto[]> GetLotesByEventoIdAsync(int eventoId)
        {
            try
            {
                var lotes = await _lotePersist.GetLotesByEventoIdAsync(eventoId);
                if(lotes == null) return null;

                var resultado = _mapper.Map<LoteDto[]>(lotes);
                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteLote(int eventoId, int Id)
        {
            try
            {
                var lote = await _lotePersist.GetLoteByIdsAsync(eventoId, Id);
                if(lote == null) throw new Exception("LoteDto não encontrado");

                _geralPersist.Delete<Lote>(lote);
                return await _geralPersist.SaveChangesAsync();  
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}