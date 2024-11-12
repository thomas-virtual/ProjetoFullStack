using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;

namespace ProEventos.Persistence
{
    public class LotePersistence : ILotePersist
    {
        private readonly ProEventosContext _context;
        public LotePersistence(ProEventosContext context)
        {
            this._context = context;
        }

        public async Task<Lote[]> GetLotesByEventoIdAsync(int eventoId)
        {
            IQueryable<Lote> query = _context.Lotes;

            query = query.AsNoTracking()
                         .Where(lote => lote.EventoId == eventoId);
            
            return await query.ToArrayAsync();
        }
        public async Task<Lote> GetLoteByIdsAsync(int eventoId, int loteId)
        {
            IQueryable<Lote> query = _context.Lotes;

            query = query.AsNoTracking()
                         .Where(lote => lote.EventoId == eventoId
                                        && lote.Id == loteId);
            
            return await query.FirstOrDefaultAsync();
        }
    }
}