using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProEventos.API.Extensions;
using ProEventos.Application.Contratos;
using ProEventos.Application.dtos;

namespace ProEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RedeSocialController : ControllerBase
    {
        private readonly IRedeSocialService _redeSocialService;
        private readonly IEventoService _eventoService;
        private readonly IPalestranteService _palestranteService;

        public RedeSocialController(
            IRedeSocialService redeSocialService,
            IEventoService eventoService,
            IPalestranteService palestranteService
        )
        {
            this._redeSocialService = redeSocialService;
            this._eventoService = eventoService;
            this._palestranteService = palestranteService;
        }

        [HttpGet("eventos/{eventoId}")]
        public async Task<IActionResult> GetByEvento(int eventoId) 
        {
            try
            {
                if(!(await AutorEvento(eventoId)))
                {
                    return Unauthorized();
                }

                 var redesSociais = await _redeSocialService.GetAllByEventoIdAsync(eventoId);
                 if(redesSociais == null) return NoContent();

                 return Ok(redesSociais);
            }
            catch (Exception ex)
            {
                
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar redes sociais por 'EVENTO'. Error: {ex.Message}"
                    );
            }
        }

        [HttpGet("palestrante")]
        public async Task<IActionResult> GetByPalestrante() 
        {
            try
            {
                var palestrante = await _palestranteService.GetPalestranteByUserIdAsync(User.GetUserIdentifier(), false);
                if(palestrante == null) return Unauthorized();

                 var redesSociais = await _redeSocialService.GetAllByPalestranteIdAsync(palestrante.Id);
                 if(redesSociais == null) return NoContent();

                 return Ok(redesSociais);
            }
            catch (Exception ex)
            {
                
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar redes sociais por 'PALESTRANTE'. Error: {ex.Message}"
                    );
            }
        }

        [HttpPut("eventos/{eventoId}")]
        public async Task<IActionResult> SaveByEvento(int eventoId, RedeSocialDto[] models) 
        {
            try
            {
                if(!(await AutorEvento(eventoId)))
                {
                    return Unauthorized();
                }

                var redesSociais = await _redeSocialService.SaveByEvento(eventoId, models);
                if(redesSociais == null) return NoContent();

                return Ok(redesSociais);
            }
            catch (Exception ex)
            {
                
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar criar Rede Social por Evento. Error: {ex.Message}"
                    );
            }
        }

        [HttpPut("palestrante")]
        public async Task<IActionResult> SaveByPalestrante(RedeSocialDto[] models) 
        {
            try
            {
                var palestrante = await _palestranteService.GetPalestranteByUserIdAsync(User.GetUserIdentifier(), false);
                if(palestrante == null) return Unauthorized();
                
                var redesSociais = await _redeSocialService.SaveByPalestrante(palestrante.Id, models);
                if(redesSociais == null) return NoContent();

                return Ok(redesSociais);
            }
            catch (Exception ex)
            {
                
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar criar Rede Social por Palestrante. Error: {ex.Message}"
                    );
            }
        }

        [HttpDelete("evento/{eventoId}/{redeSocialId}")]
        public async Task<IActionResult> DeleteByEvento(int eventoId, int redeSocialId) 
        {
            try
            {
                if(!(await AutorEvento(eventoId)))
                {
                    return Unauthorized();
                }

                var redeSocial = await _redeSocialService.GetRedeSocialEventoByIdsAsync(eventoId, redeSocialId);
                if(redeSocial == null) return NoContent();

                 return await _redeSocialService.DeleteByEvento(eventoId, redeSocialId)
                            ? Ok(new { message = "Rede Social Deletada"}) 
                            : throw new Exception("Ocorreu um problema não especificado ao tentar deletar a Rede Social.");
            }
            catch (Exception ex)
            {  
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar deletar Redes Sociais por Evento. Error: {ex.Message}"
                    );
            } 
        }

        [HttpDelete("palestrante/{redeSocialId}")]
        public async Task<IActionResult> DeleteByPalestrante(int redeSocialId) 
        {
            try
            {
                var palestrante = await _palestranteService.GetPalestranteByUserIdAsync(User.GetUserIdentifier(), false);
                if(palestrante == null) return Unauthorized();

                var redeSocial = await _redeSocialService.GetRedeSocialPalestranteByIdsAsync(palestrante.Id, redeSocialId);
                if(redeSocial == null) return NoContent();

                 return await _redeSocialService.DeleteByPalestrante(palestrante.Id, redeSocialId)
                            ? Ok(new { message = "Rede Social Deletada"}) 
                            : throw new Exception("Ocorreu um problema não especificado ao tentar deletar a Rede Social.");
            }
            catch (Exception ex)
            {  
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar deletar Redes Sociais por Palestrante. Error: {ex.Message}"
                    );
            } 
        }

        [NonAction]
        public async Task<bool> AutorEvento(int eventoId)
        {
            var evento = await _eventoService.GetEventoByIdAsync(User.GetUserIdentifier(), eventoId, false);
            if(evento == null) return false;

            return true;
        }
    }
}