using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProEventos.API.Extensions;
using ProEventos.API.helpers;
using ProEventos.Application.Contratos;
using ProEventos.Application.dtos;

namespace ProEventos.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly ITokenService _tokenService;
        private readonly IUtil _util;
        private readonly string _destination = "Perfil";

        public AccountController(IAccountService accountService, ITokenService tokenService, IUtil util)
        {
            this._accountService = accountService;
            this._tokenService = tokenService;
            this._util = util;
        }

        [HttpGet("GetUser")]
        public async Task<IActionResult> GetUser() 
        {
            try
            {
                 var username = User.GetUserName();
                 var user = await _accountService.GetUserByUsernameAsync(username);
                 return Ok(user);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar usuário. Erro: {ex.Message}"
                );
            }
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(UserLoginDto loginDto) 
        {
            try
            {
                 var user = await _accountService.GetUserByUsernameAsync(loginDto.Username);
                 if(user == null) return Unauthorized("Usuário ou senha invalidos");

                 var result = await _accountService.CheckUserPasswordAsync(user, loginDto.Password);
                 if(!result.Succeeded) return Unauthorized("Senha incorreta!");

                 return Ok(new {
                    username = user.Username,
                    primeiroNome = user.PrimeiroNome,
                    token = _tokenService.CreateToken(user).Result
                 });
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar usuários. Erro: {ex.Message}"
                );
            }
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(UserDto userDto) 
        {
            try
            {
                 if(await _accountService.UserExists(userDto.Username)) return BadRequest("Usuario já cadastrado!");

                 var user = await _accountService.CreateAccountAsync(userDto);
                 if(user != null) return Ok(new {
                    username = user.Username,
                    primeiroNome = user.PrimeiroNome,
                    token = _tokenService.CreateToken(user).Result
                 });

                 return BadRequest("Usuário não cadastrado, Tente novamente mais tarde!"); 
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar usuários. Erro: {ex.Message}"
                );
            }
        }

        [HttpPut("UpdateUser")]
        public async Task<IActionResult> UpdateUser(UserUpdateDto userUpdateDto) 
        {
            try
            {
                 if(userUpdateDto.Username != User.GetUserName())
                    return Unauthorized("Usuário Invalido");
                    
                 var user = await _accountService.GetUserByUsernameAsync(User.GetUserName());
                 if(user == null) return Unauthorized("Usuário invalido");

                 var userReturn = await _accountService.UpdateAccount(userUpdateDto);
                 if(userReturn == null) return NoContent();

                 return Ok(new {
                    userName = userReturn.Username,
                    primeiroNome = userReturn.PrimeiroNome,
                    token = _tokenService.CreateToken(userReturn).Result
                 }); 
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar usuários. Erro: {ex.Message}"
                );
            }
        }

        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadImage() 
        {
            try
            {
                 var user = await _accountService.GetUserByUsernameAsync(User.GetUserName());
                 if(user == null) return NoContent();

                 var file = Request.Form.Files[0];
                 if(file.Length > 0)
                 {
                    // DELETE IMAGE
                    _util.DeleteImage(user.ImagemURL, _destination);

                    // SAVE IMAGE 
                    user.ImagemURL = await _util.SaveImage(file, _destination);
                 }

                 var userRetorno = await _accountService.UpdateAccount(user);

                 return Ok(userRetorno);
            }
            catch (Exception ex)
            {
                
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar fazer Upload da Imagem. Error: {ex.Message}"
                    );
            } 
        }
    }
}