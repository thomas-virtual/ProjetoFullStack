using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProEventos.API.Extensions;
using ProEventos.API.helpers;
using ProEventos.Application.Contratos;
using ProEventos.Application.dtos;
using ProEventos.Domain;
using ProEventos.Persistence.Models;

namespace ProEventos.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class EventosController : ControllerBase
    {
        public readonly IEventoService _eventoService;
        private readonly IUtil _util;
        private readonly string _destination = "Images";

        public EventosController(IEventoService eventoService, IUtil util)
        {
            this._eventoService = eventoService;
            this._util = util;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] PageParams pageParams)
        {
            try
            {
                var eventos = await _eventoService.GetAllEventosAsync(User.GetUserIdentifier(), pageParams, true);
                if (eventos == null) return NoContent();

                Response.AddPagination(eventos.CurrentPage, eventos.PageSize, eventos.TotalCount, eventos.TotalPages);

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
                var evento = await _eventoService.GetEventoByIdAsync(User.GetUserIdentifier(), id, true);
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

        [HttpPost]
        public async Task<IActionResult> Post(EventoDto model) 
        {
            try
            {
                 var evento = await _eventoService.AddEventos(User.GetUserIdentifier(), model);
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

        [HttpPost("upload-image/{eventoId}")]
        public async Task<IActionResult> UploadImage(int eventoId) 
        {
            try
            {
                 var evento = await _eventoService.GetEventoByIdAsync(User.GetUserIdentifier(), eventoId, true);
                 if(evento == null) return NoContent();

                 var file = Request.Form.Files[0];
                 if(file.Length > 0)
                 {
                    // DELETE IMAGE
                    _util.DeleteImage(evento.ImagemURL, _destination);

                    // SAVE IMAGE 
                    evento.ImagemURL = await _util.SaveImage(file, _destination);
                 }

                 var eventoRetorno = await _eventoService.UpdateEvento(User.GetUserIdentifier(), eventoId, evento);

                 return Ok(eventoRetorno);
            }
            catch (Exception ex)
            {
                
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar fazer Upload da Imagem. Error: {ex.Message}"
                    );
            } 
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, EventoDto model) 
        {
            try
            {
                 var evento = await _eventoService.UpdateEvento(User.GetUserIdentifier(), id, model);
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
                var evento = await _eventoService.GetEventoByIdAsync(User.GetUserIdentifier(), id, true);
                if(await _eventoService.DeleteEvento(User.GetUserIdentifier(), id))
                {
                    _util.DeleteImage(evento.ImagemURL, _destination);
                    return Ok(new { message = "Deletado"}); 
                } 
                else 
                {
                    throw new Exception("Ocorreu um problema não especificado ao tentar deletar Evento");
                }
            }
            catch (Exception ex)
            {
                
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar deletar eventos. Error: {ex.Message}"
                    );
            } 
        }
    }
}
