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
using ProEventos.Application.Contratos;
using ProEventos.Application.dtos;
using ProEventos.Domain;
using ProEventos.Persistence.Models;

namespace ProEventos.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PalestrantesController : ControllerBase
    {
        public readonly IPalestranteService _palestranteService;
        public readonly IWebHostEnvironment _hostEnviroment;
        public PalestrantesController(IPalestranteService palestranteService, IWebHostEnvironment hostEnviroment)
        {
            this._hostEnviroment = hostEnviroment;
            this._palestranteService = palestranteService;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll([FromQuery] PageParams pageParams)
        {
            try
            {
                var palestrantes = await _palestranteService.GetAllPalestrantesAsync(pageParams, true);
                if (palestrantes == null) return NoContent();

                Response.AddPagination(
                    palestrantes.CurrentPage, 
                    palestrantes.PageSize, 
                    palestrantes.TotalCount, 
                    palestrantes.TotalPages
                );

                return Ok(palestrantes);
            }
            catch (Exception ex)
            {
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar 'todos' palestrantes. Error: {ex.Message}"
                    );
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetPalestrantes()
        {
            try
            {
                var palestrante = await _palestranteService.GetPalestranteByUserIdAsync(User.GetUserIdentifier(), true);
                if (palestrante == null) return NoContent();

                return Ok(palestrante);
            }
            catch (Exception ex)
            {
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar palestrante. Error: {ex.Message}"
                    );
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(PalestranteAddDto model) 
        {
            try
            {
                var palestrante = await _palestranteService.GetPalestranteByUserIdAsync(User.GetUserIdentifier(), false);
                 if(palestrante == null)
                    palestrante = await _palestranteService.AddPalestrantes(User.GetUserIdentifier(), model);

                 return Ok(palestrante);
            }
            catch (Exception ex)
            {
                
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar criar palestrante. Error: {ex.Message}"
                    );
            } 
        }

        [HttpPut]
        public async Task<IActionResult> Put(PalestranteUpdateDto model) 
        {
            try
            {
                 var palestrante = await _palestranteService.UpdatePalestrantes(User.GetUserIdentifier(), model);
                 if(palestrante == null) return NoContent();

                 return Ok(palestrante);
            }
            catch (Exception ex)
            {
                
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar atualizar palestrante. Error: {ex.Message}"
                    );
            } 
        }
    }
}
