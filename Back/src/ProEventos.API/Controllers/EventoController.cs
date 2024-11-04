using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ProEventos.API.Models;

namespace ProEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventoController : ControllerBase
    {
        public IEnumerable<Evento> _evento = new Evento[] {
            new Evento() {
                EventoId = 1,
                DataEvento = DateTime.Now.AddDays(2).ToString("dd/MM/yyyy"),
                Local = "Belo Horizonte",
                Lote = "1º Lote",
                QtdPessoas = 250,
                Tema = "Angular 11 e .NET 5",
                ImagemURL = "foto.png"
            },
            new Evento() {
                EventoId = 2,
                DataEvento = DateTime.Now.AddDays(3).ToString("dd/MM/yyyy"),
                Local = "São Paulo",
                Lote = "2º Lote",
                QtdPessoas = 350,
                Tema = "Angular e suas tecnologias",
                ImagemURL = "foto1.png"
            },
        };
        public EventoController(ILogger<EventoController> logger)
        {
        }

        [HttpGet]
        public IEnumerable<Evento> Get()
        {
            return _evento;
        }

        [HttpGet("{id}")]
        public IEnumerable<Evento> GetById(int id)
        {
            return _evento.Where(e => e.EventoId == id);
        }
    }
}
