

using blackJack;

public class DeckApiResponse
{
    public bool success { get; set; }
    public string deck_id { get; set; }
    public List<Card> cards { get; set; }
    public int remaining { get; set; }
}


