using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockTracking.Application.Interfaces
{
    public interface ITokenGeneratorService
    {
        string GenerateToken(string username, string role);
    }
}
