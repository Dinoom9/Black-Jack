using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace blackJack.Controllers
{
    [ApiController]
    [Route("[controller]")]
 

    public class fetchCardsController :  ControllerBase
    {
        DeckApiResponse Deck_Cards;
        string Deck_ID; 
     
        // this function getDeck from api adress
        public void GetNewDeck(){
            HttpClient client = new HttpClient();
            string cards = client.GetStringAsync("https://deckofcardsapi.com/api/deck/new/draw/?count=52").Result;
            DeckApiResponse apiResponse = JsonConvert.DeserializeObject<DeckApiResponse>(cards);
            Deck_Cards = apiResponse;
            Deck_ID = Deck_Cards.deck_id.ToString();
        }
      
        //Get and Build a new Deck
        [HttpGet]
        public IEnumerable<object> GetObjectsDeck()
        {
            GetNewDeck();
            yield return Deck_Cards;
        }

    }
}