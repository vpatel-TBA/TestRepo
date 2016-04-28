
namespace TBA.BeastWebService.Models
{
    public class ClientInfo
    {
        public bool IsSuccess { get; set; }
        public int MessageId { get; set; }
        public int UserId { get; set; }
        public int ClientId { get; set; }
        public int CustomerId { get; set; }
        public string EmailId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Message { get; set; }
        public string Token { get; set; }
    }
}