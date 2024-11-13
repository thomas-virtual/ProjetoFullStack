using System;
using System.ComponentModel.DataAnnotations;
using ProEventos.Domain;

namespace ProEventos.Application.dtos
{
    public class EventoDto
    {
        public int EventoId { get; set; }
        public string Local { get; set; }
        public string DataEvento { get; set; }

        [Required()]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Intervalo de caracteres entre 3 e 50")]
        public string Tema { get; set; }

        // [MinLength(50, ErrorMessage = "Quantidade minima é de 50")]
        public int QtdPessoas { get; set; }

        public string ImagemURL { get; set; }

        [Phone()]
        public string Telefone { get; set; }

        [EmailAddress()]
        public string Email { get; set; }
        public Lote[] Lotes { get; set; }
    }
}