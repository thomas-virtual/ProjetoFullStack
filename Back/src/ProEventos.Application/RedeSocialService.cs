using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ProEventos.Application.Contratos;
using ProEventos.Application.dtos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Application
{
    public class RedeSocialService : IRedeSocialService
    {
        private readonly IRedeSocialPersist _redeSocialPersist;
        private readonly IMapper _mapper;
        public RedeSocialService(
            IRedeSocialPersist redeSocialPersist,
            IMapper mapper
            )
        {
            this._redeSocialPersist = redeSocialPersist;
            this._mapper = mapper;
        }
        public async Task<RedeSocialDto[]> SaveByEvento(int eventoId, RedeSocialDto[] models)
        {
            try
            {
                var redesSociais = await _redeSocialPersist.GetAllByEventoIdAsync(eventoId);
                if (redesSociais == null) return null;

                foreach (var model in models)
                {
                    if(model.Id == 0) 
                    {
                        await AddRedeSocial(eventoId, model, true);
                    }
                    else
                    {
                        var redeSocial = redesSociais.FirstOrDefault(rs => rs.Id == model.Id);
                        model.EventoId = eventoId;

                        _mapper.Map(model, redeSocial);

                        _redeSocialPersist.Update<RedeSocial>(redeSocial);

                        await _redeSocialPersist.SaveChangesAsync();
                    }
                }

                var redeSocialRetorno = await _redeSocialPersist.GetAllByEventoIdAsync(eventoId);
                return _mapper.Map<RedeSocialDto[]>(redeSocialRetorno);
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto[]> SaveByPalestrante(int palestranteId, RedeSocialDto[] models)
        {
            try
            {
                var redesSociais = await _redeSocialPersist.GetAllByPalestranteIdAsync(palestranteId);
                if (redesSociais == null) return null;

                foreach (var model in models)
                {
                    if(model.Id == 0) 
                    {
                        await AddRedeSocial(palestranteId, model, false);
                    }
                    else
                    {
                        var redeSocial = redesSociais.FirstOrDefault(rs => rs.Id == model.Id);
                        model.PalestranteId = palestranteId;

                        _mapper.Map(model, redeSocial);

                        _redeSocialPersist.Update<RedeSocial>(redeSocial);

                        await _redeSocialPersist.SaveChangesAsync();
                    }
                }

                var redeSocialRetorno = await _redeSocialPersist.GetAllByPalestranteIdAsync(palestranteId);
                return _mapper.Map<RedeSocialDto[]>(redeSocialRetorno);
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task AddRedeSocial(int id, RedeSocialDto model, bool isEvento) {
            try
            {
                 var redeSocial = _mapper.Map<RedeSocial>(model);

                if(isEvento)
                {
                    redeSocial.PalestranteId = null;
                    redeSocial.EventoId = id;
                }
                else 
                {
                    redeSocial.PalestranteId = id;
                    redeSocial.EventoId = null;
                }

                _redeSocialPersist.Add<RedeSocial>(redeSocial);

                await _redeSocialPersist.SaveChangesAsync();
            }
            catch (System.Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }
        public async Task<RedeSocialDto[]> GetAllByEventoIdAsync(int eventoId)
        {
            try
            {
                var redesSociais = await _redeSocialPersist.GetAllByEventoIdAsync(eventoId);
                if(redesSociais == null) return null;

                var resultado = _mapper.Map<RedeSocialDto[]>(redesSociais);
                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto[]> GetAllByPalestranteIdAsync(int palestranteId)
        {
            try
            {
                var redesSociais = await _redeSocialPersist.GetAllByPalestranteIdAsync(palestranteId);
                if(redesSociais == null) return null;

                var resultado = _mapper.Map<RedeSocialDto[]>(redesSociais);
                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto> GetRedeSocialEventoByIdsAsync(int eventoId, int redeSocialId)
        {
            try
            {
                var redeSocial = await _redeSocialPersist.GetRedeSocialEventoByIdsAsync(eventoId, redeSocialId);
                if(redeSocial == null) return null;

                var resultado = _mapper.Map<RedeSocialDto>(redeSocial);
                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto> GetRedeSocialPalestranteByIdsAsync(int palestranteId, int redeSocialId)
        {
            try
            {
                var redeSocial = await _redeSocialPersist.GetRedeSocialPalestranteByIdsAsync(palestranteId, redeSocialId);
                if(redeSocial == null) return null;

                var resultado = _mapper.Map<RedeSocialDto>(redeSocial);
                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteByEvento(int eventoId, int redeSocialId)
        {
            try
            {
                var redeSocial = await _redeSocialPersist.GetRedeSocialEventoByIdsAsync(eventoId, redeSocialId);
                if(redeSocial == null) throw new Exception("RedeSocial não encontrado para Delete");

                _redeSocialPersist.Delete<RedeSocial>(redeSocial);
                return await _redeSocialPersist.SaveChangesAsync();  
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteByPalestrante(int palestranteId, int redeSocialId)
        {
            try
            {
                var redeSocial = await _redeSocialPersist.GetRedeSocialPalestranteByIdsAsync(palestranteId, redeSocialId);
                if(redeSocial == null) throw new Exception("RedeSocial não encontrado para Delete");

                _redeSocialPersist.Delete<RedeSocial>(redeSocial);
                return await _redeSocialPersist.SaveChangesAsync();  
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}