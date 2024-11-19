using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ProEventos.API.helpers
{
    public interface IUtil
    {
        Task<string> SaveImage(IFormFile imageFile, string destination);
        void DeleteImage(string imageURL, string destination);
    }
}