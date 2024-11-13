using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
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
        public readonly IWebHostEnvironment _hostEnviroment;
        public EventosController(IEventoService eventoService, IWebHostEnvironment hostEnviroment)
        {
            this._hostEnviroment = hostEnviroment;
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

        [HttpPost("upload-image/{eventoId}")]
        public async Task<IActionResult> UploadImage(int eventoId) 
        {
            try
            {
                 var evento = await _eventoService.GetEventoByIdAsync(eventoId, true);
                 if(evento == null) return NoContent();

                 var file = Request.Form.Files[0];
                 if(file.Length > 0)
                 {
                    // DELETE IMAGE
                    DeleteImage(evento.ImagemURL);

                    // SAVE IMAGE 
                    evento.ImagemURL = await SaveImage(file);
                 }

                 var eventoRetorno = await _eventoService.UpdateEvento(eventoId, evento);

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

        [NonAction]
        public void DeleteImage(String imageName) 
        {
            var imagePath = Path.Combine(_hostEnviroment.ContentRootPath, @"Resources/images", imageName);
            if(System.IO.File.Exists(imagePath))
            {
                System.IO.File.Delete(imagePath);
            }
            
        }

        [NonAction]
        public async Task<string> SaveImage(IFormFile imageFile) 
        {
            string imageName = new String(Path.GetFileNameWithoutExtension(imageFile.FileName)
                                              .Take(10)
                                              .ToArray()
                                         ).Replace(" ", "-");
            
            imageName = $"{imageName}${DateTime.UtcNow.ToString("yymmssfff")}{Path.GetExtension(imageFile.FileName)}";
            var imagePath = Path.Combine(_hostEnviroment.ContentRootPath, @"Resources/images", imageName);

            using(var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(fileStream);
            }

            return imageName;
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
                var evento = await _eventoService.GetEventoByIdAsync(id, true);
                if(await _eventoService.DeleteEvento(id))
                {
                    DeleteImage(evento.ImagemURL);
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
