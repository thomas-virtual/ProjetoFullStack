using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProEventos.Application.Contratos;
using ProEventos.Application.dtos;
using ProEventos.Domain.Identity;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Application
{
    public class AccountService : IAccountService
    {
        private readonly IUserPersist _userPersist;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IMapper _mapper;

        public AccountService(
            IUserPersist userPersist, 
            UserManager<User> userManager, 
            SignInManager<User> signInManager, 
            IMapper mapper
        )
        {
            this._userPersist = userPersist;
            this._userManager = userManager;
            this._signInManager = signInManager;
            this._mapper = mapper;
        }

        public async Task<UserUpdateDto> GetUserByUsernameAsync(string username)
        {
            try
            {
                 var user = _userPersist.GetUserByUsername(username);
                 if(user == null) return null;

                 var userUpdateDto = _mapper.Map<UserUpdateDto>(user);
                 return userUpdateDto;
            }
            catch (System.Exception ex)
            {
                throw new Exception("Erro ao tentar pegar usuário por username. Error: " + ex.Message);
            }
        }

        public async Task<UserDto> CreateAccountAsync(UserDto userDto)
        {
            try
            {
                 var user = _mapper.Map<User>(userDto);
                 var result = await _userManager.CreateAsync(user, userDto.Password);

                 if(result.Succeeded)
                 {
                    var userUpdateDto = _mapper.Map<UserDto>(user);
                    return userUpdateDto;
                 }

                 return null;
            }
            catch (System.Exception ex)
            {
                throw new Exception("Erro ao tentar criar conta do usuário. Error: " + ex.Message);
            }
        }

        public async Task<UserUpdateDto> UpdateAccount(UserUpdateDto userUpdateDto)
        {
            try
            {
                var user = _userPersist.GetUserByUsername(userUpdateDto.Username);
                if(user == null) return null;

                _mapper.Map(userUpdateDto, user);

                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var result = await _userManager.ResetPasswordAsync(user, token, userUpdateDto.Password);

                _userPersist.Update<User>(user);

                if(await _userPersist.SaveChangesAsync())
                {
                    var userReturn = _userPersist.GetUserByUsername(user.UserName);
                    return _mapper.Map<UserUpdateDto>(userReturn);
                }

                return null;
            }
            catch (System.Exception ex)
            {
                throw new Exception("Erro ao tentar atualizar usuário. Error: " + ex.Message);
            }
        }

        public async Task<SignInResult> CheckUserPasswordAsync(UserUpdateDto userUpdateDto, string password)
        {
            try
            {   
                var user = await _userManager
                                 .Users
                                 .SingleOrDefaultAsync(user => user.UserName == userUpdateDto.Username.ToLower());

                return await _signInManager.CheckPasswordSignInAsync(user, password, false);
            }
            catch (System.Exception ex)
            {
                throw new Exception("Erro ao verificar senha do usuário. Error: " + ex.Message);
            }
        }

        public async Task<bool> UserExists(string username)
        {
            try
            {
                 return await _userManager.Users.AnyAsync(user => user.UserName == username.ToLower());
            }
            catch (System.Exception ex)
            {
                throw new Exception("Erro ao verificar se usuário existe. Error: " + ex.Message);
            }
        }
    }
}