using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProEventos.Application.Contratos;
using ProEventos.Application.dtos;
using ProEventos.Domain;

namespace ProEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventosController : ControllerBase
    {
        public readonly IEventoService _eventoService;
        public EventosController(IEventoService eventoService)
        {
            this._eventoService = eventoService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var eventos = await _eventoService.GetAllEventosAsync(true);
                if (eventos == null) return NoContent();

                return Ok(eventos);
            }
            catch (Exception ex)
            {
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar eventos. Error: {ex.Message}"
                    );
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var evento = await _eventoService.GetEventoByIdAsync(id, true);
                if (evento == null) return NoContent();

                return Ok(evento);
            }
            catch (Exception ex)
            {
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar evento. Error: {ex.Message}"
                    );
            }
        }

        [HttpGet("/tema/{tema}")]
        public async Task<IActionResult> GetByTema(string tema)
        {
            try
            {
                var eventos = await _eventoService.GetAllEventosByTemaAsync(tema, true);
                if (eventos == null) return NoContent();

                return Ok(eventos);
            }
            catch (Exception ex)
            {
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar eventos. Error: {ex.Message}"
                    );
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(EventoDto model) 
        {
            try
            {
                 var evento = await _eventoService.AddEventos(model);
                 if(evento == null) return NoContent();

                 return Ok(evento);
            }
            catch (Exception ex)
            {
                
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar criar eventos. Error: {ex.Message}"
                    );
            } 
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, EventoDto model) 
        {
            try
            {
                 var evento = await _eventoService.UpdateEvento(id, model);
                 if(evento == null) return NoContent();

                 return Ok(evento);
            }
            catch (Exception ex)
            {
                
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar eventos. Error: {ex.Message}"
                    );
            } 
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id) 
        {
            try
            {
                 return await _eventoService.DeleteEvento(id) 
                            ? Ok("Deletado") 
                            : BadRequest("Evento não deletado");
            }
            catch (Exception ex)
            {
                
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar eventos. Error: {ex.Message}"
                    );
            } 
        }
    }
}
